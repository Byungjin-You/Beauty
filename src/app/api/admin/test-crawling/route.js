import { NextResponse } from 'next/server';
import { crawlHwahaeRealData } from '../../../../../src/lib/hybrid-crawler';

// 크롤링 테스트 API
export async function POST(request) {
  try {
    const { themeId, category, maxItems } = await request.json();

    if (!themeId) {
      return NextResponse.json(
        { success: false, message: 'themeId가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(`🧪 크롤링 테스트 시작: themeId=${themeId}, category=${category}, maxItems=${maxItems}`);

    // 하이브리드 크롤링 실행 (테스트용으로 5개만)
    const crawlResults = await crawlHwahaeRealData(category || 'trending', themeId);

    if (!crawlResults || crawlResults.length === 0) {
      return NextResponse.json({
        success: false,
        message: '크롤링 결과가 없습니다.',
        data: []
      });
    }

    // 테스트용으로 처음 5개만 반환
    const testData = crawlResults.slice(0, maxItems || 5);

    // 각 제품의 크롤링 품질 검증
    const analysisResults = testData.map((product, index) => {
      const analysis = {
        ...product,
        testAnalysis: {
          basicInfoComplete: !!(product.name && product.brand && product.price),
          ingredientsExtracted: !!(product.ingredients?.total || product.ingredients?.componentStats?.total),
          aiAnalysisExtracted: !!(product.aiAnalysis?.pros?.length > 0 || product.aiAnalysis?.cons?.length > 0),
          enhancedIngredientsExtracted: !!(
            product.ingredients?.fullIngredientsList?.length > 0 ||
            product.ingredients?.purposeBasedIngredients
          ),
          skinTypeAnalysisExtracted: !!(
            product.skinTypeAnalysis?.oily ||
            product.skinTypeAnalysis?.dry ||
            product.skinTypeAnalysis?.sensitive
          )
        }
      };

      // 크롤링 성공률 계산
      const successCriteria = [
        analysis.testAnalysis.basicInfoComplete,
        analysis.testAnalysis.ingredientsExtracted,
        analysis.testAnalysis.aiAnalysisExtracted,
        analysis.testAnalysis.enhancedIngredientsExtracted,
        analysis.testAnalysis.skinTypeAnalysisExtracted
      ];

      analysis.testAnalysis.successRate = (successCriteria.filter(Boolean).length / successCriteria.length) * 100;

      return analysis;
    });

    // 전체 테스트 요약
    const summary = {
      totalProducts: testData.length,
      avgSuccessRate: analysisResults.reduce((acc, curr) => acc + curr.testAnalysis.successRate, 0) / testData.length,
      basicInfoSuccess: analysisResults.filter(p => p.testAnalysis.basicInfoComplete).length,
      ingredientsSuccess: analysisResults.filter(p => p.testAnalysis.ingredientsExtracted).length,
      aiAnalysisSuccess: analysisResults.filter(p => p.testAnalysis.aiAnalysisExtracted).length,
      enhancedIngredientsSuccess: analysisResults.filter(p => p.testAnalysis.enhancedIngredientsExtracted).length,
      skinTypeAnalysisSuccess: analysisResults.filter(p => p.testAnalysis.skinTypeAnalysisExtracted).length
    };

    console.log('✅ 크롤링 테스트 완료:', {
      products: testData.length,
      avgSuccessRate: `${summary.avgSuccessRate.toFixed(1)}%`,
      summary
    });

    return NextResponse.json({
      success: true,
      message: `${testData.length}개 제품 크롤링 테스트 완료`,
      data: analysisResults,
      summary,
      testSettings: {
        themeId,
        category,
        maxItems: maxItems || 5,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ 크롤링 테스트 오류:', error);

    return NextResponse.json({
      success: false,
      message: error.message || '크롤링 테스트 중 오류가 발생했습니다.',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      data: []
    }, { status: 500 });
  }
}