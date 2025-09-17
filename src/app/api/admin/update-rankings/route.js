import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Ranking from '../../../../../models/Ranking';
import { crawlHwahaeRealData } from '../../../../../src/lib/hybrid-crawler';

// 유효한 화장품 성분 필터링 함수
function filterValidIngredients(ingredientsList) {
  if (!ingredientsList || !Array.isArray(ingredientsList)) {
    return [];
  }

  // 제외할 단어들 (웹사이트 UI 텍스트, 일반 단어 등)
  const excludeWords = new Set([
    'Product', 'Brand', 'Person', 'Rating', 'Organization', 'Object', 'Date',
    'Trident', 'Elastic', 'Agent', 'Hcqi', 'Hwahae Global Inc', 'All Rights Reserved',
    'Robust', 'Fair', 'Limited', 'Good', 'None', 'All', 'Inc', 'Copyright',
    'Reviews', 'Ingredients', 'Analysis', 'Beauty', 'Skin', 'Care', 'Cosmetic',
    'Product', 'Brand', 'Rating', 'Price', 'Volume', 'Type', 'Category',
    'Global', 'Company', 'Corporation', 'Co', 'Ltd', 'LLC', 'Reserved',
    'Rights', 'Terms', 'Privacy', 'Policy', 'Contact', 'About', 'Help',
    'Search', 'Filter', 'Sort', 'View', 'More', 'Less', 'Next', 'Previous',
    'Login', 'Register', 'Account', 'Profile', 'Settings', 'Logout',
    '전체', '상품', '브랜드', '평점', '리뷰', '성분', '분석', '뷰티', '스킨케어'
  ]);

  // 화장품 성분으로 인정할 패턴들
  const validIngredientPatterns = [
    /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/, // 대문자로 시작하는 영문 성분명
    /\b(acid|oil|extract|butter|wax|alcohol|oxide|sulfate|chloride|sodium|potassium|calcium|magnesium)\b/i,
    /\b(glycol|glycerin|glycerol|amine|amide|ester|ether|polymer|copolymer)\b/i,
    /\b(hyaluronic|ceramide|niacinamide|retinol|salicylic|lactic|citric|ascorbic)\b/i,
    /\b(tocopherol|panthenol|allantoin|bisabolol|caffeine|collagen|elastin)\b/i,
    /\b(dimethicone|cyclopentasiloxane|cyclohexasiloxane|phenoxyethanol|paraben)\b/i
  ];

  return ingredientsList
    .filter(ing => ing && ing.name) // 유효한 객체만
    .map(ing => ing.name) // 이름만 추출
    .filter(name => {
      // 제외 단어 체크
      if (excludeWords.has(name)) {
        return false;
      }

      // 너무 짧거나 긴 이름 제외
      if (name.length < 3 || name.length > 50) {
        return false;
      }

      // 숫자만 있는 경우 제외
      if (/^\d+$/.test(name)) {
        return false;
      }

      // 특수문자만 있는 경우 제외
      if (/^[^\w\s]+$/.test(name)) {
        return false;
      }

      // 유효한 성분 패턴 중 하나라도 매치되면 포함
      const isValidPattern = validIngredientPatterns.some(pattern => pattern.test(name));

      // 물, 글리세린 등 기본 성분들은 항상 포함
      const basicIngredients = ['Water', 'Aqua', 'Glycerin', 'Glycerol', 'Alcohol', 'Ethanol'];
      const isBasicIngredient = basicIngredients.includes(name);

      return isValidPattern || isBasicIngredient;
    })
    .slice(0, 30); // 최대 30개로 제한
}

// 개선된 성분 정보 매핑 함수
function mapEnhancedIngredients(rawIngredients) {
  if (!rawIngredients) {
    return {
      total: 0,
      lowRisk: 0,
      mediumRisk: 0,
      highRisk: 0,
      undetermined: 0,
      fullIngredientsList: [],
      purposeBasedIngredients: {},
      componentStats: {}
    };
  }

  console.log('🔍 mapEnhancedIngredients 입력 데이터:', JSON.stringify(rawIngredients, null, 2));

  // 개선된 크롤링 구조에서 데이터 추출
  const componentStats = rawIngredients.componentStats || {};
  const fullIngredientsList = rawIngredients.fullIngredientsList || [];
  const purposeBasedIngredients = rawIngredients.purposeBasedIngredients || {};
  const ingredientAnalysis = rawIngredients.ingredientAnalysis || {};

  console.log('🔍 추출된 ingredientAnalysis:', ingredientAnalysis);

  // 기존 구조와 호환성 유지 (componentStats 우선)
  const mappedIngredients = {
    // 기존 필드 (ProductDetailModal과 호환) - componentStats를 우선시
    total: componentStats.total ?? rawIngredients.total ?? 0,
    lowRisk: componentStats.lowRisk ?? rawIngredients.lowRisk ?? 0,
    mediumRisk: componentStats.mediumRisk ?? rawIngredients.mediumRisk ?? 0,
    highRisk: componentStats.highRisk ?? rawIngredients.highRisk ?? 0,
    undetermined: componentStats.undetermined ?? rawIngredients.undetermined ?? 0,

    // 새로운 개선된 필드 - 더 엄격한 필터링
    fullIngredientsList: filterValidIngredients(fullIngredientsList),
    purposeBasedIngredients: purposeBasedIngredients,

    // 원본 크롤링 데이터 보존
    componentStats: componentStats,

    // 성분 분석 정보 추가
    ingredientAnalysis: ingredientAnalysis,

    // 크롤링 품질 메타데이터
    qualityMetrics: {
      hasEnhancedData: fullIngredientsList.length > 0 || Object.keys(purposeBasedIngredients).length > 0,
      ingredientCount: fullIngredientsList.length,
      purposeCount: Object.keys(purposeBasedIngredients).length,
      dataCompleteness: calculateDataCompleteness(componentStats, fullIngredientsList, purposeBasedIngredients)
    }
  };

  console.log(`📊 성분 매핑 완료: 기본 성분 ${mappedIngredients.total}개, 추출된 성분 ${fullIngredientsList.length}개, 목적별 카테고리 ${Object.keys(purposeBasedIngredients).length}개`);

  return mappedIngredients;
}

// 데이터 완성도 계산 함수
function calculateDataCompleteness(componentStats, fullIngredientsList, purposeBasedIngredients) {
  let score = 0;
  let maxScore = 5;

  // 기본 성분 구성 정보 (1점)
  if (componentStats.total > 0) score += 1;

  // 위험도별 분류 정보 (1점)
  if (componentStats.lowRisk >= 0 && componentStats.mediumRisk >= 0 && componentStats.highRisk >= 0) score += 1;

  // 전체 성분 리스트 (2점 - 가장 중요)
  if (fullIngredientsList.length >= 5) score += 1;
  if (fullIngredientsList.length >= 15) score += 1;

  // 목적별 성분 분석 (1점)
  if (Object.keys(purposeBasedIngredients).length >= 3) score += 1;

  return Math.round((score / maxScore) * 100); // 백분율로 반환
}

// 개선된 크롤링 통계 계산 함수
function calculateEnhancedCrawlingStats(data) {
  let totalIngredientsExtracted = 0;
  let purposeAnalysisCount = 0;
  let totalCompleteness = 0;
  let enhancedDataCount = 0;

  data.forEach(item => {
    const ingredients = item.ingredients;

    if (ingredients) {
      // 전체 성분 개수 합계
      if (ingredients.fullIngredientsList && ingredients.fullIngredientsList.length > 0) {
        totalIngredientsExtracted += ingredients.fullIngredientsList.length;
        enhancedDataCount++;
      }

      // 목적별 분석이 있는 제품 수
      if (ingredients.purposeBasedIngredients && Object.keys(ingredients.purposeBasedIngredients).length > 0) {
        purposeAnalysisCount++;
      }

      // 데이터 완성도 합계
      if (ingredients.qualityMetrics) {
        totalCompleteness += ingredients.qualityMetrics.dataCompleteness;
      }
    }
  });

  return {
    totalProducts: data.length,
    enhancedDataCount: enhancedDataCount,
    totalIngredientsExtracted: totalIngredientsExtracted,
    avgIngredientsPerProduct: enhancedDataCount > 0 ? Math.round(totalIngredientsExtracted / enhancedDataCount) : 0,
    purposeAnalysisCount: purposeAnalysisCount,
    avgCompleteness: data.length > 0 ? Math.round(totalCompleteness / data.length) : 0,
    enhancedDataPercentage: data.length > 0 ? Math.round((enhancedDataCount / data.length) * 100) : 0
  };
}

export async function POST(request) {
  try {
    const { category = 'trending', themeId = '5102', maxItems = 100 } = await request.json();
    
    console.log(`🔄 실제 화해 사이트 크롤링 시작: ${category} 카테고리, themeId: ${themeId}`);
    
    // 실제 화해 사이트 크롤링
    const crawledData = await crawlHwahaeRealData(category, themeId);
    
    // 크롤링된 데이터에 카테고리 및 themeId 정보 추가 + 개선된 성분 데이터 매핑
    const data = crawledData.slice(0, maxItems).map((item, index) => {
      // 디버깅: 크롤링된 원본 데이터 구조 확인
      if (index < 3) {
        console.log(`🔍 원본 크롤링 데이터 ${index + 1} (${item.name}):`, {
          hasBrandLogo: !!item.brandLogo,
          hasCategoryRanking: !!item.categoryRanking,
          hasAiAnalysis: !!item.aiAnalysis,
          hasIngredients: !!item.ingredients,
          hasSkinTypeAnalysis: !!item.skinTypeAnalysis,
          hasAwards: !!item.awards,
          awardsCount: item.awards?.length || 0,
          keys: Object.keys(item)
        });
      }

      // 디버깅: 원본 성분 데이터 구조 확인
      if (index < 3) {
        console.log(`🧪 원본 성분 데이터 ${index + 1} (${item.name}):`, JSON.stringify(item.ingredients, null, 2));
      }

      // 개선된 성분 정보 매핑
      const enhancedIngredients = mapEnhancedIngredients(item.ingredients);

      const mappedItem = {
        ...item,
        category: category,
        themeId: themeId,
        // 개선된 성분 정보로 덮어쓰기
        ingredients: enhancedIngredients,
        // 수상 정보 보존 (중요!)
        awards: item.awards || [],
        // 크롤링 메타데이터 추가
        crawlingMetadata: {
          timestamp: new Date().toISOString(),
          source: 'enhanced-hybrid-crawler',
          version: '2.0',
          enhancedFeaturesEnabled: true
        }
      };

      // 디버깅: 매핑된 데이터 구조 확인
      if (index < 3) {
        console.log(`🗄️ 매핑된 데이터 ${index + 1} (${item.name}):`, {
          hasBrandLogo: !!mappedItem.brandLogo,
          hasCategoryRanking: !!mappedItem.categoryRanking,
          hasAiAnalysis: !!mappedItem.aiAnalysis,
          hasIngredients: !!mappedItem.ingredients,
          hasSkinTypeAnalysis: !!mappedItem.skinTypeAnalysis,
          hasCrawlingMetadata: !!mappedItem.crawlingMetadata,
          hasAwards: !!mappedItem.awards,
          awardsCount: mappedItem.awards?.length || 0
        });

        // 수상 정보가 있는 경우 상세 로그
        if (mappedItem.awards && mappedItem.awards.length > 0) {
          console.log(`🏆 ${item.name} 수상 정보:`, mappedItem.awards);
        }
      }

      return mappedItem;
    });
    
    try {
      // MongoDB 연결 시도
      await connectDB();
      
      // 기존 themeId 데이터 삭제
      await Ranking.deleteMany({ themeId: themeId });
      console.log(`🗑️ 기존 themeId ${themeId} 데이터 삭제 완료`);
      
      // 새 데이터 저장
      const savedRankings = await Ranking.insertMany(data);
      console.log(`💾 ${savedRankings.length}개 랭킹 데이터 저장 완료`);

      // 개선된 크롤링 통계 계산
      const enhancedStats = calculateEnhancedCrawlingStats(data);

      return NextResponse.json({
        success: true,
        message: `✅ 화해 사이트에서 ${savedRankings.length}개의 ${category} 랭킹을 크롤링하여 저장했습니다.\n\n🧪 개선된 성분 정보:\n• 전체 성분 리스트: ${enhancedStats.totalIngredientsExtracted}개\n• 목적별 분석: ${enhancedStats.purposeAnalysisCount}개 제품\n• 평균 데이터 완성도: ${enhancedStats.avgCompleteness}%`,
        data: savedRankings,
        count: savedRankings.length,
        savedToDatabase: true,
        crawledFromSite: true,
        enhancedCrawlingStats: enhancedStats
      });
      
    } catch (dbError) {
      console.log(`⚠️ MongoDB 연결 실패, 메모리에서만 작동: ${dbError.message}`);

      // 개선된 크롤링 통계 계산 (메모리 모드)
      const enhancedStats = calculateEnhancedCrawlingStats(data);

      // MongoDB 없이도 작동하도록 데이터 반환
      return NextResponse.json({
        success: true,
        message: `✅ 화해 사이트에서 ${data.length}개의 ${category} 랭킹을 크롤링했습니다. (메모리 모드)\n\n🧪 개선된 성분 정보:\n• 전체 성분 리스트: ${enhancedStats.totalIngredientsExtracted}개\n• 목적별 분석: ${enhancedStats.purposeAnalysisCount}개 제품\n• 평균 데이터 완성도: ${enhancedStats.avgCompleteness}%`,
        data: data,
        count: data.length,
        savedToDatabase: false,
        crawledFromSite: true,
        enhancedCrawlingStats: enhancedStats,
        warning: 'MongoDB 연결 실패로 메모리에서만 작동합니다.'
      });
    }
    
  } catch (error) {
    console.error('❌ 랭킹 업데이트 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      message: '랭킹 업데이트 중 오류가 발생했습니다.',
      error: error.message
    }, { status: 500 });
  }
}


export async function GET() {
  return NextResponse.json({
    message: 'POST 요청을 사용해주세요.',
    endpoints: {
      'POST /api/admin/update-rankings': '랭킹 데이터 업데이트',
      'body': {
        category: 'trending | category | skinType | age | brand',
        maxItems: 'number (기본값: 100)'
      }
    }
  });
}
