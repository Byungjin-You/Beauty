import { NextResponse } from 'next/server';
import { debugEnglishSite } from '../../../../lib/debug-english-crawler';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId') || '5102';
    
    console.log(`🔍 영어 사이트 디버깅 시작: themeId=${themeId}`);
    
    const debugResult = await debugEnglishSite(themeId);
    
    return NextResponse.json({
      success: true,
      debugResult
    });
    
  } catch (error) {
    console.error('❌ 디버깅 API 오류:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
