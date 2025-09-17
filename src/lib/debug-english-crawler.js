// 영어 사이트 디버깅 전용 크롤러

export async function debugEnglishSite(themeId = '5102') {
  if (typeof window !== 'undefined') {
    throw new Error('서버사이드 전용 함수입니다.');
  }

  try {
    const puppeteer = await import('puppeteer');
    
    const targetUrl = `https://www.hwahae.com/en/rankings?theme_id=${themeId}`;
    console.log(`🔄 디버깅 크롤링 시작: ${targetUrl}`);

    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // 페이지 이동
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // 기본 대기
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 1단계: 페이지 기본 정보 수집
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        bodyLength: document.body.innerHTML.length,
        hasUL: !!document.querySelector('ul'),
        hasOverflowAuto: !!document.querySelector('.overflow-auto'),
        totalLI: document.querySelectorAll('li').length,
        ulOverflowLI: document.querySelectorAll('ul.overflow-auto li').length
      };
    });
    
    console.log('📋 페이지 기본 정보:', pageInfo);
    
    // 2단계: 첫 번째 li 요소 상세 분석
    const firstLiAnalysis = await page.evaluate(() => {
      const firstLi = document.querySelector('ul.overflow-auto li');
      if (!firstLi) return null;
      
      return {
        outerHTML: firstLi.outerHTML.substring(0, 1000), // 처음 1000자
        textContent: firstLi.textContent.substring(0, 500), // 처음 500자
        hasLink: !!firstLi.querySelector('a'),
        linkHref: firstLi.querySelector('a')?.href || '',
        hasImage: !!firstLi.querySelector('img'),
        imageSrc: firstLi.querySelector('img')?.src || '',
        spanCount: firstLi.querySelectorAll('span').length,
        divCount: firstLi.querySelectorAll('div').length
      };
    });
    
    console.log('🔍 첫 번째 li 요소 분석:', firstLiAnalysis);
    
    // 3단계: 모든 li 요소의 기본 정보
    const allLiBasicInfo = await page.evaluate(() => {
      const allLi = document.querySelectorAll('ul.overflow-auto li');
      return Array.from(allLi).slice(0, 10).map((li, index) => {
        const link = li.querySelector('a');
        const hasProductLink = link && link.href.includes('/products/');
        const textPreview = li.textContent.substring(0, 100);
        
        return {
          index,
          hasProductLink,
          linkHref: link?.href || '',
          textPreview,
          hasPrice: textPreview.includes('₩'),
          hasVolume: textPreview.includes('mL') || textPreview.includes('g')
        };
      });
    });
    
    console.log('📊 모든 li 요소 기본 정보 (처음 10개):', allLiBasicInfo);

    await browser.close();
    
    return {
      pageInfo,
      firstLiAnalysis,
      allLiBasicInfo
    };

  } catch (error) {
    console.error('❌ 디버깅 크롤링 오류:', error);
    throw error;
  }
}
