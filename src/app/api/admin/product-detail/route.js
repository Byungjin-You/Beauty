import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Ranking from '../../../../../models/Ranking';

// 제품 상세 정보 업데이트
export async function PUT(request) {
  try {
    await connectDB();
    
    const { productId, basicData, detailData } = await request.json();
    
    if (!productId || !detailData) {
      return NextResponse.json(
        { success: false, message: '필수 데이터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // AI 분석 데이터 파싱
    const parseAiAnalysis = (prosText, consText) => {
      const parseLine = (text) => {
        if (!text) return [];
        return text.split(',').map(item => {
          const [name, count] = item.trim().split(':');
          return { name: name?.trim(), count: parseInt(count) || 0 };
        }).filter(item => item.name && item.count > 0);
      };

      return {
        pros: parseLine(prosText),
        cons: parseLine(consText)
      };
    };

    // 별점 분포 파싱 삭제됨 (사용자 요청)

    // 수상 정보 파싱
    const parseAwards = (awardsText) => {
      if (!awardsText) return [];
      return awardsText.split(',').map(item => {
        const [title, description] = item.trim().split(':');
        return {
          title: title?.trim() || '',
          description: description?.trim() || ''
        };
      }).filter(award => award.title && award.description);
    };

    // 업데이트할 데이터 구성
    const updateData = {
      // 기본 정보 업데이트
      ...(basicData && {
        brand: basicData.brand,
        name: basicData.name,
        price: basicData.price,
        volume: basicData.volume,
        image: basicData.image
      }),
      // 상세 정보 업데이트
      brandLogo: detailData.brandLogo || '',
      categoryRanking: detailData.categoryRanking || '',
      awards: parseAwards(detailData.awards),
      aiAnalysis: parseAiAnalysis(detailData.aiAnalysisPros, detailData.aiAnalysisCons),
      ingredients: {
        total: parseInt(detailData.ingredientsTotal) || 0,
        lowRisk: parseInt(detailData.ingredientsLowRisk) || 0,
        mediumRisk: parseInt(detailData.ingredientsMediumRisk) || 0,
        highRisk: parseInt(detailData.ingredientsHighRisk) || 0,
        undetermined: parseInt(detailData.ingredientsUndetermined) || 0,
        // 새로 추가된 개선된 성분 정보
        fullIngredientsList: detailData.fullIngredientsList ?
          detailData.fullIngredientsList.split(' | ').map(ing => ing.trim()).filter(ing => ing) : [],
        purposeBasedIngredients: detailData.purposeBasedIngredients ?
          Object.fromEntries(
            detailData.purposeBasedIngredients.split(',').map(item => {
              const [key, value] = item.trim().split(':');
              return [key?.trim(), parseInt(value) || 0];
            }).filter(([key, value]) => key && value >= 0)
          ) : {},
        // 개선된 크롤링 데이터를 위한 componentStats 지원
        componentStats: {
          total: parseInt(detailData.ingredientsTotal) || 0,
          lowRisk: parseInt(detailData.ingredientsLowRisk) || 0,
          mediumRisk: parseInt(detailData.ingredientsMediumRisk) || 0,
          highRisk: parseInt(detailData.ingredientsHighRisk) || 0,
          undetermined: parseInt(detailData.ingredientsUndetermined) || 0
        }
      },
      skinTypeAnalysis: {
        oily: {
          good: parseInt(detailData.skinTypeOilyGood) || 0,
          bad: parseInt(detailData.skinTypeOilyBad) || 0
        },
        dry: {
          good: parseInt(detailData.skinTypeDryGood) || 0,
          bad: parseInt(detailData.skinTypeDryBad) || 0
        },
        sensitive: {
          good: parseInt(detailData.skinTypeSensitiveGood) || 0,
          bad: parseInt(detailData.skinTypeSensitiveBad) || 0
        }
      }
    };

    // MongoDB 업데이트 (productId로만 조회)
    const result = await Ranking.findOneAndUpdate(
      { productId },
      { $set: updateData },
      { new: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: '제품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '제품 상세 정보가 성공적으로 업데이트되었습니다.',
      data: result
    });

  } catch (error) {
    console.error('제품 상세 정보 업데이트 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 제품 상세 정보 조회
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: '제품 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // productId는 숫자이므로 ObjectId 변환하지 않고 productId 필드로만 검색
    const product = await Ranking.findOne({ productId }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: '제품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 수상 정보 디버깅
    console.log('🏆 API에서 조회된 수상 정보:', product.awards);
    console.log('🔍 제품명:', product.name);

    return NextResponse.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('제품 상세 정보 조회 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
