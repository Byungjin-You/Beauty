// 크롤러 성능 테스트 스크립트
const { crawlHwahaeRealData } = require('./src/lib/hybrid-crawler.js');

async function testCrawler() {
  console.log('🚀 크롤러 성능 테스트 시작...\n');

  const startTime = Date.now();

  try {
    // 소량의 제품만 테스트 (3개)
    const results = await crawlHwahaeRealData();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n✅ 크롤링 완료!');
    console.log(`⏱️  총 소요 시간: ${duration}초`);
    console.log(`📦 수집된 제품 수: ${results.length}개`);

    if (results.length > 0) {
      console.log('\n📊 상세 정보가 있는 제품 수:',
        results.filter(r => r.aiAnalysis || r.componentStats).length);
    }

  } catch (error) {
    console.error('❌ 크롤링 실패:', error);
    process.exit(1);
  }
}

testCrawler();
