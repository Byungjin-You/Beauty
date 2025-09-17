import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Ranking from '../../../../../models/Ranking';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'trending';
    const themeId = searchParams.get('themeId');
    const limit = parseInt(searchParams.get('limit')) || 100;
    
    console.log(`🔍 랭킹 조회 요청: ${category} 카테고리, themeId: ${themeId}, 최대 ${limit}개`);
    
    try {
      // MongoDB 연결 시도
      await connectDB();
      
      let rankings;
      if (themeId) {
        // themeId로 조회 (특정 카테고리 필터)
        console.log(`🔍 themeId로 데이터 조회: ${themeId}`);
        rankings = await Ranking.find({ themeId: themeId })
          .sort({ rank: 1 })
          .limit(limit)
          .lean();
        console.log(`📊 조회 결과: ${rankings.length}개 데이터`);
        
        // 첫 번째 데이터의 themeId 확인
        if (rankings.length > 0) {
          console.log(`🎯 첫 번째 데이터 themeId: ${rankings[0].themeId}`);
        }
      } else {
        // 기존 방식으로 조회
        rankings = await Ranking.getLatestRankings(category, limit);
      }
      
      return NextResponse.json({
        success: true,
        data: rankings,
        count: rankings.length,
        category: category,
        themeId: themeId
      });
      
    } catch (dbError) {
      console.log(`⚠️ MongoDB 연결 실패, 빈 데이터 반환: ${dbError.message}`);
      
      // MongoDB 없이도 작동하도록 빈 배열 반환
      return NextResponse.json({
        success: false,
        data: [],
        count: 0,
        category: category,
        themeId: themeId,
        warning: 'MongoDB 연결 실패'
      });
    }
    
  } catch (error) {
    console.error('❌ 랭킹 조회 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      message: '랭킹 데이터 조회 중 오류가 발생했습니다.',
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json({
        success: false,
        message: '카테고리를 지정해주세요.'
      }, { status: 400 });
    }
    
    // MongoDB 연결
    await connectDB();
    
    // 카테고리별 데이터 삭제
    const result = await Ranking.deleteMany({ category });
    
    return NextResponse.json({
      success: true,
      message: `${category} 카테고리 랭킹 데이터가 삭제되었습니다.`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('❌ 랭킹 삭제 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      message: '랭킹 데이터 삭제 중 오류가 발생했습니다.',
      error: error.message
    }, { status: 500 });
  }
}
