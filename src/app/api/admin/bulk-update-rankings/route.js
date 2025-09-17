import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Ranking from '../../../../../models/Ranking';
import { crawlHwahaeRealData } from '../../../../../src/lib/hwahae-crawler';
import { hwahaeCategories } from '../../../../../src/data/hwahae-categories';

export async function POST(request) {
  try {
    const { maxItems = 100 } = await request.json();
    const categories = hwahaeCategories;
    
    console.log(`🚀 전체 카테고리 일괄 업데이트 시작: ${categories.length}개 메인 카테고리`);
    
    const results = [];
    let totalUpdated = 0;
    let totalErrors = 0;

    // MongoDB 연결
    await connectDB();
    
    for (const category of categories) {
      console.log(`\n📂 [${category.name}] 카테고리 처리 시작`);
      
      for (const subCategory of category.subcategories) {
        try {
          console.log(`  🔄 ${category.name} > ${subCategory.name} (themeId: ${subCategory.themeId}) 크롤링 시작...`);
          
          // 실제 화해 사이트 크롤링
          const crawledData = await crawlHwahaeRealData('trending', subCategory.themeId);
          
          if (crawledData && crawledData.length > 0) {
            // 크롤링된 데이터에 메타 정보 추가
            const data = crawledData.slice(0, maxItems).map(item => ({
              ...item,
              category: 'trending',
              themeId: subCategory.themeId
            }));
            
            // 기존 themeId 데이터 삭제
            const deleteResult = await Ranking.deleteMany({ themeId: subCategory.themeId });
            console.log(`    🗑️ 기존 데이터 ${deleteResult.deletedCount}개 삭제`);
            
            // 새 데이터 저장
            const savedRankings = await Ranking.insertMany(data);
            console.log(`    ✅ 새 데이터 ${savedRankings.length}개 저장 완료`);
            
            results.push({
              category: category.name,
              subCategory: subCategory.name,
              themeId: subCategory.themeId,
              success: true,
              count: savedRankings.length
            });
            
            totalUpdated += savedRankings.length;
          } else {
            console.log(`    ⚠️ 크롤링 데이터가 없음`);
            results.push({
              category: category.name,
              subCategory: subCategory.name,
              themeId: subCategory.themeId,
              success: false,
              error: '크롤링 데이터 없음'
            });
            totalErrors++;
          }
          
          // 서버 부하 방지를 위한 딜레이
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (subError) {
          console.error(`    ❌ ${category.name} > ${subCategory.name} 오류:`, subError.message);
          results.push({
            category: category.name,
            subCategory: subCategory.name,
            themeId: subCategory.themeId,
            success: false,
            error: subError.message
          });
          totalErrors++;
        }
      }
    }
    
    console.log(`\n🎉 전체 업데이트 완료!`);
    console.log(`📊 총 업데이트: ${totalUpdated}개 항목`);
    console.log(`❌ 오류 발생: ${totalErrors}개 카테고리`);
    
    // 오류 발생한 카테고리들 상세 로그
    const errorCategories = results.filter(r => !r.success);
    if (errorCategories.length > 0) {
      console.log(`\n❌ 오류 발생 카테고리 목록:`);
      errorCategories.forEach((errorCat, index) => {
        console.log(`  ${index + 1}. ${errorCat.category} > ${errorCat.subCategory} (themeId: ${errorCat.themeId})`);
        console.log(`     오류: ${errorCat.error}`);
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `전체 카테고리 업데이트가 완료되었습니다.`,
      summary: {
        totalCategories: categories.length,
        totalSubCategories: categories.reduce((sum, cat) => sum + cat.subcategories.length, 0),
        totalUpdated,
        totalErrors
      },
      results: results,
      errorCategories: errorCategories
    });
    
  } catch (error) {
    console.error('❌ 일괄 업데이트 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      message: '일괄 업데이트 중 오류가 발생했습니다.',
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST 요청을 사용해주세요.',
    description: '모든 화해 카테고리의 랭킹 데이터를 일괄 업데이트합니다.',
    endpoints: {
      'POST /api/admin/bulk-update-rankings': '전체 카테고리 랭킹 데이터 일괄 업데이트',
      'body': {
        maxItems: 'number (기본값: 100, 카테고리별 최대 항목 수)'
      }
    },
    warning: '이 작업은 시간이 오래 걸릴 수 있습니다. (예상 시간: 5-10분)'
  });
}
