import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Ranking from '../../../../../models/Ranking';

export async function GET() {
  try {
    console.log('🔍 데이터베이스 themeId 현황 조회 시작');
    
    // MongoDB 연결
    await connectDB();
    
    // 모든 고유 themeId 조회
    const uniqueThemeIds = await Ranking.distinct('themeId');
    console.log(`📊 데이터베이스에 저장된 고유 themeId: ${uniqueThemeIds.length}개`);
    console.log('🎯 themeId 목록:', uniqueThemeIds.sort());
    
    // 각 themeId별 데이터 개수 조회
    const themeIdCounts = [];
    for (const themeId of uniqueThemeIds) {
      const count = await Ranking.countDocuments({ themeId });
      themeIdCounts.push({ themeId, count });
    }
    
    // themeId별 샘플 데이터 조회 (첫 번째 제품)
    const sampleData = [];
    for (const themeId of uniqueThemeIds.slice(0, 10)) { // 처음 10개만
      const sample = await Ranking.findOne({ themeId }).lean();
      if (sample) {
        sampleData.push({
          themeId,
          productName: sample.name,
          brand: sample.brand,
          rank: sample.rank
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '데이터베이스 themeId 현황 조회 완료',
      data: {
        uniqueThemeIds: uniqueThemeIds.sort(),
        themeIdCounts: themeIdCounts.sort((a, b) => a.themeId.localeCompare(b.themeId)),
        sampleData: sampleData,
        totalUniqueThemeIds: uniqueThemeIds.length,
        totalRecords: themeIdCounts.reduce((sum, item) => sum + item.count, 0)
      }
    });
    
  } catch (error) {
    console.error('❌ themeId 현황 조회 오류:', error);
    
    return NextResponse.json({
      success: false,
      message: 'themeId 현황 조회 중 오류가 발생했습니다.',
      error: error.message
    }, { status: 500 });
  }
}
