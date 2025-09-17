// 최적화된 하이브리드 크롤링: 영어 사이트(가격/용량) + 한국어 사이트(이미지/변동정보)

// 설정 상수
const CONFIG = {
  TIMEOUTS: {
    PAGE_LOAD: 15000,     // 15초로 복원 (화해 사이트 느림)
    WAIT_SHORT: 1000,     // 1초로 정상화
    WAIT_MEDIUM: 2000,    // 2초 유지
    WAIT_LONG: 3000,      // 3초 유지
    STABILIZATION: 2000,  // 2초 유지
    SECTION_LOADING: 5000, // 5초 유지
    HUMAN_SIMULATION: 1500 // 1.5초 유지
  },
  URLS: {
    ENGLISH_BASE: 'https://www.hwahae.com/en/rankings',
    KOREAN_BASE: 'https://www.hwahae.co.kr/rankings',
    MAIN_PAGE: 'https://www.hwahae.co.kr'
  },
  USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  LIMITS: {
    MAX_ITEMS: 50,
    DETAIL_ITEMS: 10,
    INGREDIENTS_LIST: 30,
    LOG_CONTAINERS: 20,
    CONCURRENT_PAGES: 5   // 병렬 처리로 성능 향상 (속도 최적화)
  },
  BROWSER_ARGS: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-blink-features=AutomationControlled',
    '--disable-infobars'
    // 다른 감지 방지 옵션들은 제거하여 더 자연스럽게
  ]
};

// 스마트 대기 함수들 (조건부 대기로 성능 향상)
async function waitForSectionToLoad(page, sectionText, maxTimeout = CONFIG.TIMEOUTS.SECTION_LOADING) {
  try {
    await page.waitForFunction(
      (text) => {
        const sections = document.querySelectorAll('section');
        return Array.from(sections).some(section =>
          section.textContent.includes(text) &&
          section.querySelectorAll('button, div, span').length > 3
        );
      },
      { timeout: maxTimeout },
      sectionText
    );
    return true;
  } catch (error) {
    console.log(`⚠️ 섹션 로딩 타임아웃 (${sectionText}), 기본 대기 시간 사용`);
    return false;
  }
}

async function smartWait(ms, condition = null) {
  if (condition) {
    try {
      await Promise.race([
        condition,
        new Promise(resolve => setTimeout(resolve, ms))
      ]);
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  } else {
    await new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 리소스 차단으로 성능 향상
async function setupResourceBlocking(page) {
  await page.setRequestInterception(true);

  page.on('request', (req) => {
    const resourceType = req.resourceType();
    const url = req.url();

    // 차단할 리소스 타입
    if (resourceType === 'image' ||
        resourceType === 'stylesheet' ||
        resourceType === 'font' ||
        resourceType === 'media' ||
        url.includes('google-analytics') ||
        url.includes('googletagmanager') ||
        url.includes('facebook.net') ||
        url.includes('doubleclick') ||
        url.includes('ads') ||
        url.includes('analytics')) {
      req.abort();
    } else {
      req.continue();
    }
  });
}

// 공통 유틸리티 함수들
async function setupBotBypass(page) {
  // 더 현실적인 사용자 에이전트 설정
  const randomUA = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
  ];

  await page.setUserAgent(randomUA[Math.floor(Math.random() * randomUA.length)]);

  // 랜덤한 뷰포트 크기 설정 (일반적인 해상도들)
  const viewports = [
    { width: 1920, height: 1080 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1536, height: 864 }
  ];
  const viewport = viewports[Math.floor(Math.random() * viewports.length)];

  await page.setViewport({
    ...viewport,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    isLandscape: true
  });

  // 더 자연스러운 HTTP 헤더 설정
  await page.setExtraHTTPHeaders({
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'max-age=0',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Connection': 'keep-alive',
    'DNT': '1'
  });

  // 간단하고 효과적인 bot detection 우회 (이전 작동 방식)
  await page.evaluateOnNewDocument(() => {
    // 기본적인 webdriver 속성 제거만
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined
    });

    window.chrome = {
      runtime: {},
      app: { isInstalled: false },
      webstore: { onInstallStageChanged: {}, onDownloadProgress: {} }
    };

    // 기본적인 navigator 속성들
    Object.defineProperty(navigator, 'plugins', {
      get: () => [
        { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
        { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
        { name: 'Native Client', filename: 'internal-nacl-plugin' }
      ],
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['ko-KR', 'ko', 'en-US', 'en'],
    });

    // 기본적인 이벤트 리스너
    ['mousedown', 'mouseup', 'mousemove', 'mouseover'].forEach(eventType => {
      document.addEventListener(eventType, () => {}, true);
    });
    document.addEventListener('scroll', () => {}, true);
  });
}

// 간단한 메인 페이지 방문 함수 (이전 작동 방식)
async function visitMainPageFirst(page) {
  try {
    // 단순한 메인 페이지 방문
    await page.goto(CONFIG.URLS.MAIN_PAGE, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.TIMEOUTS.PAGE_LOAD
    });

    // 최소한의 대기
    await smartWait(CONFIG.TIMEOUTS.HUMAN_SIMULATION);

    // 간단한 스크롤
    await page.evaluate(() => {
      window.scrollTo(0, 200);
    });

    return true;
  } catch (error) {
    console.log('⚠️ 메인 페이지 방문 실패:', error.message);
    return false;
  }
}

// 고급 인간적 행동 시뮬레이션 함수
async function simulateHumanBehavior(page) {
  try {
    // 1. 페이지 상태 확인 및 초기 대기
    await smartWait(800 + Math.random() * 1200);

    // 2. 자연스러운 마우스 이동 패턴 (베지어 곡선 경로)
    const startX = 100 + Math.random() * 200;
    const startY = 100 + Math.random() * 200;
    await page.mouse.move(startX, startY);

    // 여러 단계의 자연스러운 마우스 움직임
    for (let i = 0; i < 4 + Math.floor(Math.random() * 4); i++) {
      const endX = 200 + Math.random() * 1000;
      const endY = 150 + Math.random() * 600;

      // 중간점을 통한 자연스러운 곡선 이동
      const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 200;
      const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 200;

      // 단계별 이동
      const steps = 5 + Math.floor(Math.random() * 10);
      for (let step = 0; step <= steps; step++) {
        const t = step / steps;
        const x = Math.pow(1-t, 2) * startX + 2*(1-t)*t * midX + Math.pow(t, 2) * endX;
        const y = Math.pow(1-t, 2) * startY + 2*(1-t)*t * midY + Math.pow(t, 2) * endY;

        await page.mouse.move(x, y);
        await smartWait(20 + Math.random() * 80);
      }

      // 가끔 클릭 시뮬레이션 (실제 클릭은 하지 않음)
      if (Math.random() < 0.3) {
        await smartWait(100 + Math.random() * 300);
      }

      await smartWait(300 + Math.random() * 700);
    }

    // 3. 현실적인 스크롤 패턴
    const scrollPattern = Math.floor(Math.random() * 3);

    switch (scrollPattern) {
      case 0: // 천천히 아래로 스크롤
        for (let i = 0; i < 3 + Math.floor(Math.random() * 4); i++) {
          const scrollAmount = 150 + Math.random() * 300;
          await page.evaluate((amount) => {
            window.scrollBy(0, amount);
          }, scrollAmount);
          await smartWait(800 + Math.random() * 1500);
        }
        break;

      case 1: // 빠르게 스크롤 후 다시 위로
        await page.evaluate(() => {
          window.scrollBy(0, 500 + Math.random() * 800);
        });
        await smartWait(500 + Math.random() * 1000);
        await page.evaluate(() => {
          window.scrollBy(0, -200 - Math.random() * 300);
        });
        await smartWait(400 + Math.random() * 800);
        break;

      case 2: // 단계별 스크롤 후 멈춤
        for (let i = 0; i < 2; i++) {
          await page.evaluate(() => {
            window.scrollBy(0, 250 + Math.random() * 200);
          });
          await smartWait(1000 + Math.random() * 2000); // 읽는 시간 시뮬레이션
        }
        break;
    }

    // 4. 페이지 상단으로 돌아가기 (자연스럽게)
    await page.evaluate(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    await smartWait(800 + Math.random() * 1200);

    // 5. 키보드 이벤트 시뮬레이션 (실제 입력은 하지 않음)
    if (Math.random() < 0.4) {
      // 가끔 Tab 키나 화살표 키 같은 내비게이션 키 시뮬레이션
      await smartWait(200 + Math.random() * 400);
    }

    // 6. 최종 대기 (페이지 로딩 완료 대기)
    await smartWait(1500 + Math.random() * 2500);

  } catch (error) {
    console.log('⚠️ 인간 행동 시뮬레이션 중 오류:', error.message);
    // 오류가 발생해도 기본 대기는 수행
    await smartWait(2000);
  }
}

function getDefaultDetailData() {
  return {
    brandLogo: '',
    categoryRanking: '',
    aiAnalysis: { pros: [], cons: [] },
    ingredients: {},
    skinTypeAnalysis: {
      oily: {good: 0, bad: 0},
      dry: {good: 0, bad: 0},
      sensitive: {good: 0, bad: 0}
    }
  };
}

export async function crawlHwahaeRealData(category = 'trending', themeId = '5102') {
  if (typeof window !== 'undefined') {
    throw new Error('이 함수는 서버사이드에서만 실행 가능합니다.');
  }

  try {
    const puppeteer = await import('puppeteer');
    
    console.log(`🔄 하이브리드 크롤링 시작: themeId=${themeId}`);

    const browser = await puppeteer.default.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--start-maximized',
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-default-apps',
        '--disable-popup-blocking',
        '--disable-translate',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-field-trial-config',
        '--disable-back-forward-cache',
        '--disable-backgrounding-occluded-windows',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ],
      defaultViewport: null,
      ignoreDefaultArgs: ['--enable-automation', '--enable-blink-features=AutomationControlled'],
      ignoreHTTPSErrors: true,
      slowMo: 1500 // 더 천천히 동작
    });

    // 병렬로 두 사이트 크롤링
    console.log('🚀 영어/한국어 사이트 병렬 크롤링 시작...');
    const [englishData, koreanData] = await Promise.all([
      crawlEnglishSite(browser, themeId),
      crawlKoreanSite(browser, themeId)
    ]);
    
    // 3단계: 상세 페이지 정보 수집 (실제 크롤링)
    console.log('📄 3단계: 실제 상세 페이지 크롤링 시작...');
    console.log(`📄 크롤링할 제품 수: ${englishData.length}개`);
    
    // 3.5단계: 영어 데이터와 한국 데이터 사전 병합 (detailUrl 포함)
    console.log('🔗 3.5단계: 기본 데이터 병합...');
    const premergedData = englishData.map((item, index) => {
      const koreanItem = koreanData[index] || {};
      return {
        ...item,
        image: koreanItem.image || item.image,
        rankChange: koreanItem.rankChange || null,
        detailUrl: koreanItem.detailUrl || ''
      };
    });
    
    // 처음 10개 제품에서 한국 사이트 상세 데이터 크롤링 (detailUrl 사용)
    console.log('📄 상세 페이지 크롤링 대상 제품 수:', Math.min(10, premergedData.length));
    const detailData = await crawlKoreanDetailPages(browser, premergedData.slice(0, 10));
    
    // 4단계: 최종 데이터 병합 (영어/한국 사이트 분업)
    console.log('🔗 4단계: 영어/한국 사이트 분업 데이터 병합...');
    const mergedData = premergedData.map((item, index) => {
      const detail = detailData[index] || {};
      return {
        // 영어 사이트에서: 브랜드명, 제품명, 가격, 용량, 평점, 리뷰수, productId, link
        productId: item.productId,
        rank: item.rank,
        brand: item.brand,           // 영어 사이트
        name: item.name,             // 영어 사이트  
        price: item.price,           // 영어 사이트
        volume: item.volume,         // 영어 사이트
        rating: item.rating,
        reviewCount: item.reviewCount,
        link: item.link,
        
        // 한국 사이트에서: 제품 이미지, 변동정보, 상세 URL
        image: item.image,           // 한국 사이트 (기존)
        rankChange: item.rankChange, // 한국 사이트 (기존)
        detailUrl: item.detailUrl,   // 한국 사이트 (새로 추가)
        
        // 한국 사이트 상세에서: 브랜드로고, 카테고리랭킹, 수상정보, AI분석, 성분정보, 피부타입분석
        brandLogo: detail.brandLogo || '',         // 한국 사이트 상세
        categoryRanking: detail.categoryRanking || '', // 한국 사이트 상세
        awards: detail.awards || [],               // 한국 사이트 상세 - 수상 정보
        aiAnalysis: detail.aiAnalysis || { pros: [], cons: [] }, // 한국 사이트 상세
        ingredients: detail.ingredients || {},     // 한국 사이트 상세
        skinTypeAnalysis: detail.skinTypeAnalysis || { oily: {good: 0, bad: 0}, dry: {good: 0, bad: 0}, sensitive: {good: 0, bad: 0} } // 한국 사이트 상세
      };
    });

    await browser.close();

    console.log(`✅ 하이브리드 크롤링 완료: ${mergedData.length}개 아이템`);
    console.log(`📊 첫 번째 아이템 상세 정보:`, JSON.stringify(mergedData[0], null, 2));
    return mergedData;

  } catch (error) {
    console.error('❌ 하이브리드 크롤링 오류:', error);
    throw error;
  }
}

// 영어 사이트에서 가격/용량 정보만 크롤링 (최적화)
async function crawlEnglishSite(browser, themeId) {
  const page = await browser.newPage();
  await setupResourceBlocking(page);

  await page.setUserAgent(CONFIG.USER_AGENT);

  const englishUrl = `${CONFIG.URLS.ENGLISH_BASE}?theme_id=${themeId}`;
  await page.goto(englishUrl, { waitUntil: 'domcontentloaded', timeout: CONFIG.TIMEOUTS.PAGE_LOAD });

  await new Promise(resolve => setTimeout(resolve, CONFIG.TIMEOUTS.LONG));

  // 스크롤하여 아이템 로드
  for (let i = 0; i < 4; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, CONFIG.TIMEOUTS.MEDIUM));
  }

  const englishData = await page.evaluate(() => {
    const items = [];
    const listItems = document.querySelectorAll('ul.overflow-auto li');

    listItems.forEach((item, index) => {
      try {
        const link = item.querySelector('a[href*="/products/"]');
        if (!link) return;

        const text = item.textContent || '';
        const href = link.getAttribute('href');
        
        // 제품 ID 추출
        const productIdMatch = href.match(/\/(\d+)$/);
        const productId = productIdMatch ? productIdMatch[1] : '';

        // 순위는 배열 인덱스 + 1로 단순화
        const rank = index + 1;

        // 브랜드명과 제품명 추출
        const brandElement = item.querySelector('span.hds-text-body-medium.hds-text-gray-tertiary');
        const nameElement = item.querySelector('span.hds-text-body-medium.hds-text-gray-primary');
        
        const brand = brandElement?.textContent?.trim() || '';
        const name = nameElement?.textContent?.trim() || '';

        // 별점 추출
        const ratingElement = item.querySelector('span.hds-text-body-small.hds-text-gray-secondary');
        const rating = ratingElement ? parseFloat(ratingElement.textContent.trim()) || 0 : 0;

        // 리뷰 수 추출
        let reviewCount = 0;
        const reviewElement = item.querySelector('span[class*="before:hds-content"]');
        if (reviewElement) {
          const reviewText = reviewElement.textContent.trim();
          reviewCount = parseInt(reviewText.replace(/,/g, '')) || 0;
        }

        // 가격 추출 (달러)
        const priceMatch = text.match(/\$(\d+\.?\d*)/);
        const price = priceMatch ? `$${priceMatch[1]}` : '';

        // 용량 추출
        const volumeMatch = text.match(/\/([\d.]+\s*[a-zA-Z]+)/);
        const volume = volumeMatch ? volumeMatch[1].trim() : '';

        if (brand && name && rating > 0) {
          items.push({
            productId,
            rank,
            brand,
            name,
            rating,
            reviewCount,
            price,
            volume,
            link: `https://www.hwahae.com${href}`
          });
        }
        
      } catch (error) {
        // console.error(`❌ 영어 사이트 아이템 ${index + 1} 파싱 오류:`, error);
      }
    });

    return items.sort((a, b) => a.rank - b.rank);
  });

  await page.close();
  return englishData;
}

// 한국어 사이트에서 이미지와 변동정보만 크롤링 (최적화)
async function crawlKoreanSite(browser, themeId) {
  const page = await browser.newPage();
  await setupResourceBlocking(page);
  await page.setUserAgent(CONFIG.USER_AGENT);

  const koreanUrl = `${CONFIG.URLS.KOREAN_BASE}?english_name=trending&theme_id=${themeId}`;
  await page.goto(koreanUrl, { waitUntil: 'networkidle2', timeout: CONFIG.TIMEOUTS.PAGE_LOAD });

  await new Promise(resolve => setTimeout(resolve, CONFIG.TIMEOUTS.STABILIZATION));

  // 스크롤 최적화
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, CONFIG.TIMEOUTS.SHORT));
  }

  const koreanData = await page.evaluate(() => {
    const results = [];
    const itemElements = document.querySelectorAll('li');

    itemElements.forEach((item, index) => {
      try {
        const link = item.querySelector('a');
        if (!link) return;
        
        // 브랜드와 제품명 (디버깅용)
        const brandSpan = item.querySelector('span.hds-text-body-medium.hds-text-gray-tertiary');
        const nameSpan = item.querySelector('span.hds-text-body-medium.hds-text-gray-primary');
        const brand = brandSpan?.textContent?.trim() || '';
        const name = nameSpan?.textContent?.trim() || '';
        
        // 랭킹 변동 정보 추출 (한국어 사이트에서만)
        let rankChange = null;
        
        // NEW 체크
        const newSpan = item.querySelector('span.hds-text-red-primary');
        if (newSpan?.textContent?.includes('NEW')) {
          rankChange = { type: 'new', value: null };
        } else {
          // 상승 화살표 (빨간색)
          const upSpan = item.querySelector('span.hds-text-red-primary[class*="smalltext-medium"]');
          if (upSpan?.querySelector('svg')) {
            const value = parseInt(upSpan.textContent.replace(/[^\d]/g, '')) || 1;
            rankChange = { type: 'up', value };
          } else {
            // 하락 화살표 (파란색)
            const downSpan = item.querySelector('span.hds-text-blue-600[class*="smalltext-medium"]');
            if (downSpan?.querySelector('svg')) {
              const value = parseInt(downSpan.textContent.replace(/[^\d]/g, '')) || 1;
              rankChange = { type: 'down', value };
            }
          }
        }

        // 이미지 추출 (최적화 - 가장 성공률 높은 방법만)
        let image = '';
        
        // 방법 1: picture > source srcset (가장 확실한 방법)
        const pictureElement = item.querySelector('picture');
        if (pictureElement) {
          const sourceElement = pictureElement.querySelector('source[srcset]');
          if (sourceElement) {
            const srcset = sourceElement.getAttribute('srcset');
            const urlMatch = srcset.match(/(https:\/\/img\.hwahae\.co\.kr\/products\/\d+\/\d+_\d+\.jpg)/);
            if (urlMatch) {
              image = urlMatch[1] + '?size=200x200';
            }
          }
        }
        
        // 방법 2: img[alt="thumbnail"] (백업)
        if (!image) {
          const thumbnailImg = item.querySelector('img[alt="thumbnail"]');
          if (thumbnailImg?.src?.includes('hwahae.co.kr')) {
            image = thumbnailImg.src.replace(/\?size=\d+x\d+/, '?size=200x200');
          }
        }
        
        // 상세 페이지 URL 추출
        let detailUrl = '';
        const linkElement = item.querySelector('a[href*="goods/"], a[href*="products/"]');
        if (linkElement) {
          const href = linkElement.getAttribute('href');
          detailUrl = href.startsWith('http') ? href : `https://www.hwahae.co.kr/${href}`;
        }
        
        // 데이터가 있는 경우만 저장
        if (image || rankChange || detailUrl) {
          results[index] = { image, rankChange, detailUrl };
          if (image && brand && name) {
            // console.log(`✓ ${index + 1}위: ${brand} - ${name.substring(0, 20)}... (URL: ${detailUrl ? '✅' : '❌'})`);
          }
        }
        
      } catch (error) {
        // console.error(`한국어 사이트 아이템 ${index} 처리 중 오류:`, error);
      }
    });

    const imageCount = results.filter(item => item?.image).length;
    const changeCount = results.filter(item => item?.rankChange).length;
    // console.log(`한국어 사이트에서 이미지 ${imageCount}개, 변동정보 ${changeCount}개 추출`);

    return results;
  });

  await page.close();
  return koreanData;
}

// 한국 사이트에서 상세 AI 분석 데이터 크롤링
// 개별 상품 상세 페이지 크롤링 (강화된 에러 핸들링)
async function crawlSingleProductDetail(browser, product, index, total) {
  console.log(`📄 한국 사이트 크롤링 중: ${index + 1}/${total} - ${product.name}`);

  // 재시도 로직 추가 (Execution context destroyed 오류 대응)
  let attempts = 0;
  const maxRetries = 2;

  while (attempts <= maxRetries) {
    if (attempts > 0) {
      console.log(`🔄 재시도 중 (${attempts}/${maxRetries}): ${product.name}`);
      // 재시도 전 랜덤 대기 (봇 감지 회피)
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    }

    let page = null;
    let detail = null;
  try {
      page = await browser.newPage();

      // 페이지 생성 후 즉시 준비 상태 확인
      try {
        await page.evaluate(() => document.readyState);
        console.log(`✅ 페이지 생성 성공: ${product.name}`);
      } catch (contextError) {
        throw new Error(`페이지 생성 직후 컨텍스트 오류: ${contextError.message}`);
      }

      // 페이지 에러 이벤트 핸들링
      page.on('error', (error) => {
        console.log(`⚠️ 페이지 에러 (${product.name}):`, error.message);
      });

      page.on('pageerror', (error) => {
        console.log(`⚠️ 페이지 스크립트 에러 (${product.name}):`, error.message);
      });

      page.on('disconnect', () => {
        console.log(`⚠️ 페이지 연결 끊김 (${product.name})`);
      });

      await setupResourceBlocking(page);
      await setupBotBypass(page);

      // 설정 완료 후 추가 준비 상태 확인
      try {
        const isReady = await page.evaluate(() => {
          return document.readyState === 'complete' || document.readyState === 'interactive';
        });

        if (!isReady) {
          console.log(`⚠️ 페이지 준비 상태 확인 실패: ${product.name}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (readyError) {
        throw new Error(`페이지 준비 상태 확인 실패: ${readyError.message}`);
      }
      
      // 한국 사이트 상세 페이지 URL 사용 (이미 크롤링된 URL)
      let detailUrl = product.detailUrl;
      if (!detailUrl && product.productId) {
        // detailUrl이 없으면 productId로 생성
        detailUrl = `https://www.hwahae.co.kr/products/${product.productId}`;
        console.log(`🔧 detailUrl 생성: ${detailUrl}`);
      }

      if (!detailUrl) {
        console.log('❌ 한국 사이트 상세 URL이 없음 (productId도 없음)');
        throw new Error('상세 URL 없음');
      }
      
      console.log(`📄 한국 사이트 상세 페이지: ${detailUrl}`);
      
      // 직접 상세 페이지 접근 (메인 페이지 방문 제거)
      try {
        // 직접 상세 페이지로 이동 (가장 효과적인 방법)
        console.log(`📄 상세 페이지 직접 접근: ${detailUrl}`);
        await page.goto(detailUrl, {
          waitUntil: 'domcontentloaded',
          timeout: CONFIG.TIMEOUTS.PAGE_LOAD
        });

        // 최소한의 자연스러운 대기
        await smartWait(CONFIG.TIMEOUTS.WAIT_SHORT);

        // 페이지 로딩 대기 (더 짧은 타임아웃)
        try {
          await Promise.race([
            page.waitForSelector('section', { timeout: CONFIG.TIMEOUTS.STABILIZATION }),
            new Promise(resolve => setTimeout(resolve, CONFIG.TIMEOUTS.STABILIZATION))
          ]);
        } catch (e) {
          console.log('📍 섹션 로딩 타임아웃, 계속 진행');
        }

      } catch (error) {
        console.error('❌ 페이지 접근 오류:', error.message);
        throw error;
      }
      
      // 섹션별 순차 스크롤링 (동적 로딩 대응)
      // console.log('📜 섹션별 순차 스크롤링...');
      
      // 1. 맨 위로 이동
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 2. AI 분석 섹션으로 스크롤
      // console.log('🤖 AI 분석 섹션으로 스크롤...');
      await page.evaluate(() => {
        const aiSection = Array.from(document.querySelectorAll('section')).find(section =>
          section.textContent.includes('AI가 분석한 리뷰')
        );
        if (aiSection) {
          aiSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      await new Promise(resolve => setTimeout(resolve, CONFIG.TIMEOUTS.WAIT_MEDIUM));
      
      // 3. 성분 섹션으로 스크롤 + 개선된 추출
      // console.log('🧪 성분 섹션으로 스크롤 및 개선된 추출...');
      const ingredientsData = await page.evaluate(async () => {
        // 성분 섹션 찾기 (더 정확한 방법)
        const findIngredientSection = () => {
          const sections = document.querySelectorAll('section');
          for (const section of sections) {
            const text = section.textContent || '';
            if (text.includes('성분') && text.includes('전체 성분')) {
              return section;
            }
          }
          return null;
        };

        let ingredientSection = findIngredientSection();

        // 성분 섹션이 없으면 페이지를 더 스크롤해서 동적 로딩 대기
        if (!ingredientSection) {
          for (let i = 0; i < 3; i++) {
            window.scrollTo(0, document.body.scrollHeight * (i + 1) / 3);
            await new Promise(resolve => setTimeout(resolve, 2000));
            ingredientSection = findIngredientSection();
            if (ingredientSection) break;
          }
        }

        if (!ingredientSection) {
          // console.log('❌ 성분 섹션을 찾을 수 없음');
          return {};
        }

        // 섹션으로 스크롤
        ingredientSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // console.log('✅ 성분 섹션으로 스크롤 완료');

        // 동적 컨텐츠 로딩을 위한 추가 대기
        await new Promise(resolve => setTimeout(resolve, 3000));

        const result = {
          componentStats: {},
          fullIngredientsList: [],
          purposeBasedIngredients: {},
          skinTypeAnalysis: {}
        };

        try {
          // 1. 동적 버튼 기반 성분 정보 추출 (신규 방식)
          // console.log('🔘 동적 버튼에서 성분 정보 추출 시작...');

          // 전체 성분 개수 추출
          const totalIngredientText = ingredientSection.textContent;
          const totalMatch = totalIngredientText.match(/전체\s*성분[^0-9]*?(\d+)/);
          if (totalMatch) {
            result.componentStats.total = parseInt(totalMatch[1]) || 0;
            // console.log(`✅ 전체 성분: ${result.componentStats.total}개`);
          }

          // 버튼들에서 성분 정보 추출
          const buttons = ingredientSection.querySelectorAll('button[type="button"]');
          // console.log(`🔍 발견된 성분 관련 버튼: ${buttons.length}개`);

          buttons.forEach((button, index) => {
            const buttonText = button.textContent || '';
            const cleanText = buttonText.replace(/\s+/g, ' ').trim();
            // console.log(`버튼 ${index + 1}: ${cleanText.substring(0, 80)}...`);

            // 주의성분 추출 (20가지 주의성분 Free/0/숫자 형태 모두 포함)
            if (cleanText.includes('주의성분')) {
              let cautionProcessed = false;

              // 패턴 1: "X가지 주의성분 Free" 형태
              const cautionWithFreeMatch = cleanText.match(/(\d+)\s*가지\s*주의성분\s+Free/i);
              if (cautionWithFreeMatch) {
                const totalCaution = parseInt(cautionWithFreeMatch[1]) || 0;
                result.componentStats.mediumRisk = 0;
                result.componentStats.cautionIngredientsInfo = {
                  total: totalCaution,
                  present: 0
                };
                // console.log(`✅ 주의성분: ${totalCaution}가지 중 Free (0개)`);
                cautionProcessed = true;
              }

              // 패턴 2: "X가지 주의성분 Y" 형태 (Y는 숫자)
              if (!cautionProcessed) {
                const cautionWithCountMatch = cleanText.match(/(\d+)\s*가지\s*주의성분\s+(\d+)/);
                if (cautionWithCountMatch) {
                  const totalCaution = parseInt(cautionWithCountMatch[1]) || 0;
                  const presentCount = parseInt(cautionWithCountMatch[2]) || 0;
                  result.componentStats.mediumRisk = presentCount;
                  result.componentStats.cautionIngredientsInfo = {
                    total: totalCaution,
                    present: presentCount
                  };
                  // console.log(`✅ 주의성분: ${totalCaution}가지 중 ${presentCount}개 포함`);
                  cautionProcessed = true;
                }
              }

              // 패턴 3: 기존 방식으로 폴백 (단순한 형태)
              if (!cautionProcessed) {
                const cautionMatch = cleanText.match(/(\d+)(?:\s*가지)?\s*주의성분/);
                if (cautionMatch) {
                  const cautionCount = parseInt(cautionMatch[1]) || 0;
                  result.componentStats.mediumRisk = cautionCount;
                  // 기본값으로 20가지 설정 (가장 일반적인 경우)
                  result.componentStats.cautionIngredientsInfo = {
                    total: 20,
                    present: cautionCount
                  };
                  // console.log(`✅ 주의성분: ${cautionCount}개 (기본 패턴)`);
                }
              }
            }

            // 알레르기 주의성분 추출 (Free 포함)
            if (cleanText.includes('알레르기 주의성분')) {
              if (cleanText.includes('Free')) {
                result.componentStats.highRisk = 0;
                // console.log('✅ 알레르기 주의성분: Free (0개)');
              } else {
                const allergyMatch = cleanText.match(/알레르기\s*주의성분.*?(\d+)/);
                if (allergyMatch) {
                  result.componentStats.highRisk = parseInt(allergyMatch[1]) || 0;
                  // console.log(`✅ 알레르기 주의성분: ${result.componentStats.highRisk}개`);
                }
              }
            }

            // 기능성 성분 추출
            if (cleanText.includes('주름 개선')) {
              const wrinkleMatch = cleanText.match(/주름\s*개선.*?(\d+)/);
              if (wrinkleMatch) {
                result.purposeBasedIngredients['주름 개선'] = parseInt(wrinkleMatch[1]) || 0;
                // console.log(`✅ 주름 개선 성분: ${result.purposeBasedIngredients['주름 개선']}개`);
              }
            }

            if (cleanText.includes('미백')) {
              const whiteningMatch = cleanText.match(/미백.*?(\d+)/);
              if (whiteningMatch) {
                result.purposeBasedIngredients['피부 미백'] = parseInt(whiteningMatch[1]) || 0;
                // console.log(`✅ 피부 미백 성분: ${result.purposeBasedIngredients['피부 미백']}개`);
              }
            }

            // 추가 기능성 성분들
            if (cleanText.includes('자외선 차단')) {
              const sunscreenMatch = cleanText.match(/자외선\s*차단.*?(\d+)/);
              if (sunscreenMatch) {
                result.purposeBasedIngredients['자외선 차단'] = parseInt(sunscreenMatch[1]) || 0;
                // console.log(`✅ 자외선 차단 성분: ${result.purposeBasedIngredients['자외선 차단']}개`);
              }
            }

            if (cleanText.includes('보습')) {
              const moistureMatch = cleanText.match(/보습.*?(\d+)/);
              if (moistureMatch) {
                result.purposeBasedIngredients['피부 보습'] = parseInt(moistureMatch[1]) || 0;
                // console.log(`✅ 피부 보습 성분: ${result.purposeBasedIngredients['피부 보습']}개`);
              }
            }
          });

          // 저위험 성분 계산 (전체 - 중위험 - 고위험)
          const total = result.componentStats.total || 0;
          const medium = result.componentStats.mediumRisk || 0;
          const high = result.componentStats.highRisk || 0;
          result.componentStats.lowRisk = Math.max(0, total - medium - high);
          result.componentStats.undetermined = 0; // 기본값

          // console.log('🧮 동적 추출 완료된 성분 통계:', result.componentStats);
          // console.log('🎯 동적 추출 완료된 목적별 성분:', result.purposeBasedIngredients);

          // 2. 실제 존재하는 성분 분석 정보 추출 (화해 사이트 실제 구조 기반)
          // console.log('📋 실제 성분 분석 정보 추출...');

          // 실제 성분명 리스트 추출 (성분 펼치기 버튼 클릭)
          try {
            console.log('🧪 성분 리스트 추출 시도...');

            // 성분 펼치기 버튼 찾기 (여러 패턴 시도)
            const expandButtons = [
              ...Array.from(ingredientSection.querySelectorAll('button')).filter(btn =>
                btn.textContent.includes('성분') && (btn.textContent.includes('더보기') || btn.textContent.includes('펼치기') || btn.textContent.includes('전체'))
              ),
              ...Array.from(ingredientSection.querySelectorAll('button[aria-expanded="false"]')),
              ...Array.from(ingredientSection.querySelectorAll('.cursor-pointer, [role="button"]')).filter(el =>
                el.textContent.includes('성분')
              )
            ];

            console.log(`🔍 성분 펼치기 버튼 후보: ${expandButtons.length}개`);

            let extractedIngredients = [];

            if (expandButtons.length > 0) {
              const expandButton = expandButtons[0];
              console.log(`🖱️ 성분 펼치기 버튼 클릭: "${expandButton.textContent.trim().substring(0, 50)}"`);

              await expandButton.click();
              await page.waitForTimeout(CONFIG.TIMEOUTS.WAIT_MEDIUM);

              // 성분 리스트 요소들 추출
              const ingredientElements = ingredientSection.querySelectorAll(
                '.ingredient-item, .ingredient-name, .text-sm, .hds-text-body-medium, [class*="ingredient"]'
              );

              console.log(`🧪 추출된 성분 요소: ${ingredientElements.length}개`);

              for (const element of ingredientElements) {
                const text = element.textContent?.trim();
                if (text && text.length > 2 && text.length < 50 &&
                    !text.includes('위험') && !text.includes('성분') &&
                    !text.includes('개') && !/^\d+$/.test(text)) {
                  extractedIngredients.push({ name: text });
                }
              }

              // 추가 시도: 일반적인 텍스트 요소에서 성분 추출
              if (extractedIngredients.length === 0) {
                const allTextElements = ingredientSection.querySelectorAll('span, div, p');
                for (const element of allTextElements) {
                  const text = element.textContent?.trim();
                  if (text && text.length > 3 && text.length < 30 &&
                      /^[A-Z][a-z]+/.test(text) &&
                      !text.includes('위험') && !text.includes('성분')) {
                    extractedIngredients.push({ name: text });
                  }
                }
              }
            }

            // 중복 제거 및 정리
            const uniqueIngredients = [...new Set(extractedIngredients.map(ing => ing.name))]
              .map(name => ({ name }))
              .slice(0, 30);

            result.fullIngredientsList = uniqueIngredients;
            console.log(`✅ 성분 추출 완료: ${result.fullIngredientsList.length}개`);

          } catch (ingredientError) {
            console.log(`⚠️ 성분 추출 실패: ${ingredientError.message}`);
            result.fullIngredientsList = [];
          }

          // 성분 구성 정보 직접 추출 (HTML 구조 기반)
          // console.log('🧮 HTML 구조 기반 성분 구성 정보 추출...');

          // 성분 구성 div들 찾기 (.shrink-0 클래스 내부의 정보들)
          const componentDivs = ingredientSection.querySelectorAll('.shrink-0');
          // console.log(`성분 구성 div 수: ${componentDivs.length}개`);

          componentDivs.forEach((div, index) => {
            const text = div.textContent || '';
            const subtitleSpan = div.querySelector('.hds-text-subtitle-medium');

            if (subtitleSpan) {
              const value = subtitleSpan.textContent.trim();
              // console.log(`성분 구성 ${index + 1}: ${text.substring(0, 30)} = ${value}`);

              if (text.includes('전체 성분')) {
                result.componentStats.total = parseInt(value) || 0;
              } else if (text.includes('낮은 위험')) {
                result.componentStats.lowRisk = parseInt(value) || 0;
              } else if (text.includes('중간 위험')) {
                result.componentStats.mediumRisk = parseInt(value) || 0;
              } else if (text.includes('높은 위험')) {
                result.componentStats.highRisk = value === 'Free' ? 0 : (parseInt(value) || 0);
              } else if (text.includes('등급 미정')) {
                result.componentStats.undetermined = value === 'Free' ? 0 : (parseInt(value) || 0);
              }
            }
          });

          // console.log('📊 HTML 기반 성분 구성 결과:', result.componentStats);

          // 전체 성분 개수 추출
          const totalIngredientsElement = ingredientSection.querySelector('h3');
          if (totalIngredientsElement) {
            const totalMatch = totalIngredientsElement.textContent.match(/전체 성분.*?(\d+)/);
            if (totalMatch) {
              result.totalIngredientsCount = parseInt(totalMatch[1]);
              // console.log(`📊 전체 성분 개수: ${result.totalIngredientsCount}개`);
            }
          }

          // 성분 분석 정보 수집 (실제 HTML 구조 기반)
          result.ingredientAnalysis = {};

          // 모든 버튼에서 성분 분석 정보 추출
          const analysisButtons = ingredientSection.querySelectorAll('button');
          // console.log(`🔍 성분 분석 버튼 수: ${analysisButtons.length}개`);

          analysisButtons.forEach((button, index) => {
            const buttonText = button.textContent?.trim() || '';
            // console.log(`🔍 버튼 ${index + 1}: ${buttonText.substring(0, 100)}`);

            // 주의성분 정보 (개선된 패턴 매칭 - Free 포함)
            if (buttonText.includes('주의성분') && !buttonText.includes('알레르기')) {
              let cautionProcessed = false;

              // 패턴 1: "X가지 주의성분 Free" 형태
              const cautionWithFreeMatch = buttonText.match(/(\d+)\s*가지\s*주의성분\s+Free/i);
              if (cautionWithFreeMatch) {
                const totalCaution = parseInt(cautionWithFreeMatch[1]);
                result.ingredientAnalysis.cautionIngredients = {
                  total: totalCaution,
                  present: 0
                };
                // console.log(`⚠️ 주의성분: ${totalCaution}가지 중 Free (0개)`);
                cautionProcessed = true;
              }

              // 패턴 2: "X가지 주의성분 Y" 형태 (Y는 숫자)
              if (!cautionProcessed) {
                const cautionWithCountMatch = buttonText.match(/(\d+)\s*가지\s*주의성분\s+(\d+)/);
                if (cautionWithCountMatch) {
                  const totalCaution = parseInt(cautionWithCountMatch[1]);
                  const presentCount = parseInt(cautionWithCountMatch[2]);
                  result.ingredientAnalysis.cautionIngredients = {
                    total: totalCaution,
                    present: presentCount
                  };
                  // console.log(`⚠️ 주의성분: ${totalCaution}가지 중 ${presentCount}개`);
                  cautionProcessed = true;
                }
              }

              // 패턴 3: 기존 방식으로 폴백
              if (!cautionProcessed) {
                const cautionMatch = buttonText.match(/(\d+)가지\s*주의성분/);
                const countMatch = buttonText.match(/(\d+)$/);
                if (cautionMatch && countMatch) {
                  result.ingredientAnalysis.cautionIngredients = {
                    total: parseInt(cautionMatch[1]),
                    present: parseInt(countMatch[1])
                  };
                  // console.log(`⚠️ 주의성분: ${cautionMatch[1]}가지 중 ${countMatch[1]}개`);
                  cautionProcessed = true;
                } else if (cautionMatch) {
                  // 단순히 "X가지 주의성분"만 있는 경우
                  const totalCaution = parseInt(cautionMatch[1]);
                  result.ingredientAnalysis.cautionIngredients = {
                    total: totalCaution,
                    present: 0  // 개수가 명시되지 않으면 0으로 가정
                  };
                  // console.log(`⚠️ 주의성분: ${totalCaution}가지 (개수 미명시, 0으로 가정)`);
                }
              }
            }

            // 알레르기 주의성분 정보
            if (buttonText.includes('알레르기 주의성분')) {
              if (buttonText.includes('Free')) {
                result.ingredientAnalysis.allergyIngredients = 'Free';
                // console.log('🛡️ 알레르기 주의성분: Free');
              } else {
                const allergyMatch = buttonText.match(/(\d+)$/);
                if (allergyMatch) {
                  result.ingredientAnalysis.allergyIngredients = parseInt(allergyMatch[1]);
                  // console.log(`🛡️ 알레르기 주의성분: ${allergyMatch[1]}개`);
                }
              }
            }

            // 기능성 성분 정보
            if (buttonText.includes('주름 개선')) {
              const wrinkleMatch = buttonText.match(/(\d+)$/);
              if (wrinkleMatch) {
                result.ingredientAnalysis.antiAgingIngredients = parseInt(wrinkleMatch[1]);
                // console.log(`💆 주름 개선 성분: ${wrinkleMatch[1]}개`);
              }
            }

            if (buttonText.includes('미백')) {
              const brighteningMatch = buttonText.match(/(\d+)$/);
              if (brighteningMatch) {
                result.ingredientAnalysis.brighteningIngredients = parseInt(brighteningMatch[1]);
                // console.log(`✨ 미백 성분: ${brighteningMatch[1]}개`);
              }
            }
          });

          console.log('✅ 실제 성분 분석 정보 추출 완료:', {
            totalCount: result.totalIngredientsCount,
            analysis: result.ingredientAnalysis
          });

          // 3. 목적별 성분 정보 추출 (개선된 방법)
          console.log('🎯 목적별 성분 정보 추출...');

          // 목적별 성분 정보 직접 추출 (HTML 구조 기반)
          console.log('🎯 HTML 구조 기반 목적별 성분 정보 추출...');

          // 더 넓은 범위에서 목적별 성분 찾기
          const allPurposeElements = ingredientSection.querySelectorAll('div');
          const purposeItemsData = [];

          // w-[60px] h-[139px] 차트 요소들을 직접 찾기
          allPurposeElements.forEach((element, index) => {
            // 차트 컨테이너인지 확인 (w-[60px] h-[139px] 클래스 포함)
            const classList = element.className || '';
            const isChartContainer = classList.includes('w-[60px]') && classList.includes('h-[139px]');

            if (isChartContainer) {
              // 숫자 정보 찾기 (.hds-text-subtitle-medium)
              const countElement = element.querySelector('.hds-text-subtitle-medium');
              // 라벨 정보 찾기 (.hds-text-body-small.text-gray-secondary)
              const labelElement = element.querySelector('.hds-text-body-small.text-gray-secondary');

              if (countElement && labelElement) {
                const countText = countElement.textContent.trim();
                const count = parseInt(countText) || 0;
                const label = labelElement.textContent.trim();

                purposeItemsData.push({ label, count, countText });
                console.log(`목적별 성분 발견: ${label} = ${countText}`);
              }
            }
          });

          console.log(`차트 기반으로 발견된 목적별 성분: ${purposeItemsData.length}개`);

          // 차트 기반으로 찾지 못했다면 다른 방법 시도
          if (purposeItemsData.length < 5) {
            console.log('🔄 대안 방법으로 목적별 성분 찾기...');

            // 방법 1: flex flex-col items-center 패턴으로 찾기
            const flexContainers = ingredientSection.querySelectorAll('div.flex.flex-col.items-center');
            flexContainers.forEach(container => {
              const classList = container.className || '';
              if (classList.includes('w-[60px]') && classList.includes('h-[139px]')) {
                const countElement = container.querySelector('.hds-text-subtitle-medium');
                const labelElement = container.querySelector('.hds-text-body-small.text-gray-secondary');

                if (countElement && labelElement) {
                  const countText = countElement.textContent.trim();
                  const count = parseInt(countText) || 0;
                  const label = labelElement.textContent.trim();

                  if (!purposeItemsData.some(item => item.label === label)) {
                    purposeItemsData.push({ label, count, countText });
                    console.log(`대안 방법 1으로 발견: ${label} = ${countText}`);
                  }
                }
              }
            });

            // 방법 2: 모든 .hds-text-body-small.text-gray-secondary 라벨 찾기
            if (purposeItemsData.length < 5) {
              const allLabels = ingredientSection.querySelectorAll('.hds-text-body-small.text-gray-secondary');

              allLabels.forEach(labelElement => {
                const label = labelElement.textContent.trim();

                // 피부 관련 라벨인지 확인
                if (label.includes('피부') || label.includes('주름') || label.includes('미백') ||
                    label.includes('보습') || label.includes('보호') || label.includes('수분') ||
                    label.includes('증발') || label.includes('차단') || label.includes('수렴') ||
                    label.includes('진정') || label.includes('각질') || label.includes('여드름') ||
                    label.includes('자외선')) {

                  // 같은 부모 또는 형제 요소에서 숫자 찾기
                  const parent = labelElement.parentElement;
                  const countElement = parent?.querySelector('.hds-text-subtitle-medium');

                  if (countElement && !purposeItemsData.some(item => item.label === label)) {
                    const countText = countElement.textContent.trim();
                    const count = parseInt(countText) || 0;

                    purposeItemsData.push({ label, count, countText });
                    console.log(`대안 방법 2로 발견: ${label} = ${countText}`);
                  }
                }
              });
            }
          }

          // 최종 결과 저장
          purposeItemsData.forEach(item => {
            result.purposeBasedIngredients[item.label] = item.count;
          });

          console.log(`최종 목적별 성분 개수: ${purposeItemsData.length}개`);

          console.log('목적별 성분 최종 결과:', result.purposeBasedIngredients);

          // 4. 피부타입별 성분 분석 추출 (기존 로직 유지하되 개선)
          // console.log('🧴 피부타입별 성분 분석 추출...');

          result.skinTypeAnalysis = {
            oily: { good: 0, bad: 0 },
            dry: { good: 0, bad: 0 },
            sensitive: { good: 0, bad: 0 }
          };

          // 피부타입별 분석 섹션 찾기
          const skinTypeRows = ingredientSection.querySelectorAll('.flex.items-center.gap-x-24');

          skinTypeRows.forEach(row => {
            const text = row.textContent || '';
            const mintSpan = row.querySelector('.text-mint-primary');
            const redSpan = row.querySelector('.text-red-primary');

            if (mintSpan && redSpan) {
              const good = parseInt(mintSpan.textContent.trim()) || 0;
              const bad = parseInt(redSpan.textContent.trim()) || 0;

              if (text.includes('지성 피부')) {
                result.skinTypeAnalysis.oily = { good, bad };
              } else if (text.includes('건성 피부')) {
                result.skinTypeAnalysis.dry = { good, bad };
              } else if (text.includes('민감성 피부')) {
                result.skinTypeAnalysis.sensitive = { good, bad };
              }
            }
          });

          console.log('✅ 개선된 성분 정보 추출 완료:', result);
          console.log('🔍 ingredientAnalysis 확인:', result.ingredientAnalysis);
          return result;

        } catch (error) {
          console.log('❌ 성분 정보 추출 중 오류:', error);
          return result; // 부분적으로라도 추출된 데이터 반환
        }
      });
      
      console.log('🧪 성분 정보 즉시 추출 완료:', ingredientsData);
      console.log('🔍 성분 데이터 상세:', JSON.stringify(ingredientsData, null, 2));
      await new Promise(resolve => setTimeout(resolve, 2000)); // 추가 대기
      
      // 4. 피부타입별 성분 섹션으로 스크롤
      console.log('🧴 피부타입별 성분 섹션으로 스크롤...');
      await page.evaluate(() => {
        const skinTypeSection = Array.from(document.querySelectorAll('section')).find(section => 
          section.textContent.includes('피부 타입별 성분')
        );
        if (skinTypeSection) {
          skinTypeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // console.log('✅ 모든 섹션 순차 스크롤링 완료');
      
      // HTML 구조 상세 분석 및 데이터 추출
      // console.log('🔍 HTML 구조 상세 분석 시작...');
      
      // 간소화된 디버그 정보 수집
      await page.evaluate(() => {
        console.log('페이지 분석:', document.title, window.location.href);
      });
      
      console.log('✅ 페이지 로딩, 상호작용, 스크롤, API 호출 모두 완료');

      console.log('🚀 page.evaluate 함수 호출 직전!');

      // 스크린샷 촬영 (디버깅용 - 환경변수로 제어)
      if (process.env.CRAWLER_DEBUG === 'true') {
        try {
          const screenshotPath = `debug-korean-detail-${i+1}.png`;
          await page.screenshot({
            path: screenshotPath,
            fullPage: true,
            type: 'png'
          });
          console.log(`📸 스크린샷 저장: ${screenshotPath}`);
        } catch (e) {
          console.log('스크린샷 저장 실패:', e.message);
        }
      }

      // 한국 사이트에서 AI 분석 데이터 추출
      const detail = await page.evaluate((preExtractedIngredients) => {
        const result = {};

        // console.log('🔥 page.evaluate 함수 시작!');

        // 미리 추출된 개선된 성분 데이터 사용
        result.ingredients = preExtractedIngredients || {};
        console.log('📥 미리 추출된 개선된 성분 데이터:', result.ingredients);

        // 간소화된 페이지 분석
        // console.log('📊 페이지 분석 시작...');
        
        
        // 브랜드 로고 추출 - 개선된 버전
        result.brandLogo = '';
        try {
          // console.log('🏷️ 브랜드 로고 추출 시작...');
          
          // 여러 셀렉터로 브랜드 로고 찾기
          const brandSelectors = [
            'img[src*="brands/"]',
            'img[alt*="brand"]',
            'img[alt*="브랜드"]',
            '[class*="brand"] img',
            '[class*="Brand"] img',
            '.brand-logo img',
            '.brand img'
          ];
          
          for (const selector of brandSelectors) {
            const brandImg = document.querySelector(selector);
            if (brandImg && brandImg.src) {
              // 브랜드 이미지 URL 정리
              let logoUrl = brandImg.src;
              
              // 크기 파라미터 최적화
              if (logoUrl.includes('?size=')) {
                logoUrl = logoUrl.replace(/\?size=\d+x\d+/, '?size=100x100');
              } else if (logoUrl.includes('hwahae.co.kr') || logoUrl.includes('hwahae.com')) {
                logoUrl += '?size=100x100';
              }
              
              result.brandLogo = logoUrl;
              // console.log(`✅ 브랜드 로고 발견 (${selector}): ${logoUrl}`);
              break;
            }
          }
          
          // 추가 방법: 텍스트에서 브랜드 로고 URL 찾기
          if (!result.brandLogo) {
            const pageHTML = document.documentElement.innerHTML;
            const brandUrlMatch = pageHTML.match(/https:\/\/[^"']*brands\/[^"']*\.(png|jpg|jpeg|webp)/i);
            if (brandUrlMatch) {
              result.brandLogo = brandUrlMatch[0] + '?size=100x100';
              // console.log(`✅ 브랜드 로고 HTML에서 발견: ${result.brandLogo}`);
            }
          }
          
          if (!result.brandLogo) {
            // console.log('❌ 브랜드 로고를 찾을 수 없음');
          }
          
        } catch (e) {
          // console.log('❌ 브랜드 로고 추출 오류:', e.message);
        }
        
        // 카테고리 랭킹 추출 - 강화된 가격 정보 제거 방식
        result.categoryRanking = '';
        try {
          // console.log('🏆 카테고리 랭킹 추출 시작...');

          // 방법 1: "랭킹" 라벨을 찾고 인근 버튼에서 깨끗한 랭킹 정보 추출
          const rankingLabelElements = Array.from(document.querySelectorAll('span, div'))
            .filter(el => {
              const text = el.textContent?.trim() || '';
              return text === '랭킹';
            });

          let foundRanking = false;

          for (const labelElement of rankingLabelElements) {
            // 라벨 근처의 버튼들 검색
            const container = labelElement.closest('section, div');
            if (container) {
              const buttons = container.querySelectorAll('button');
              // console.log(`🔍 랭킹 라벨 근처에서 ${buttons.length}개 버튼 발견`);

              for (const button of buttons) {
                const buttonText = button.textContent?.trim() || '';
                // console.log(`버튼 텍스트 검사: "${buttonText}"`);

                // 가격 정보 없이 "X위"가 포함된 버튼 찾기
                if (buttonText.includes('위') &&
                    buttonText.length > 5 &&
                    buttonText.length < 50 &&
                    !buttonText.includes('원') &&
                    !buttonText.includes('랭킹') &&
                    !buttonText.match(/^\d+/) &&
                    !buttonText.includes('포인트')) {

                  result.categoryRanking = buttonText;
                  // console.log(`✅ HTML 구조에서 깨끗한 랭킹 발견: "${buttonText}"`);
                  foundRanking = true;
                  break;
                }
              }
              if (foundRanking) break;
            }
          }

          // 방법 2: 전체 페이지에서 가격 정보를 제거한 후 패턴 추출
          if (!foundRanking) {
            // console.log('HTML 구조에서 실패, 텍스트 정제 후 패턴으로 시도...');

            let pageText = document.body.textContent;

            // 1단계: 가격 관련 텍스트를 사전에 완전 제거
            // console.log('가격 정보 제거 전 샘플:', pageText.substring(pageText.indexOf('원랭킹'), pageText.indexOf('원랭킹') + 50));

            pageText = pageText.replace(/\d+원랭킹/g, '랭킹'); // "000원랭킹" → "랭킹"으로 변경
            pageText = pageText.replace(/\d+원\s*랭킹/g, '랭킹'); // "000원 랭킹" → "랭킹"으로 변경

            // console.log('가격 정보 제거 후 샘플:', pageText.substring(pageText.indexOf('랭킹'), pageText.indexOf('랭킹') + 50));

            // 2단계: 깨끗한 랭킹 패턴들로 추출
            const rankingPatterns = [
              // "랭킹카테고리 ・ 서브카테고리 X위" 형태에서 랭킹 제거
              /랭킹([가-힣A-Za-z\/\s]{2,20})\s*・\s*([가-힣A-Za-z\s]{2,15})\s+(\d{1,3})위/g,
              // "랭킹카테고리 서브카테고리 X위" 형태에서 랭킹 제거
              /랭킹([가-힣A-Za-z\/\s]{3,25}(?:스킨|토너|에센스|앰플|세럼|크림|립글로스|립스틱|클렌징|마스크)[\w가-힣\/\s]*?)\s+([가-힣A-Za-z\s]{2,15})\s+(\d{1,3})위/g,
              // "랭킹카테고리 X위" 형태에서 랭킹 제거
              /랭킹([가-힣A-Za-z\/\s]{3,30})\s+(\d{1,3})위/g
            ];

            for (const pattern of rankingPatterns) {
              const matches = [...pageText.matchAll(pattern)];
              // console.log(`패턴으로 ${matches.length}개 매치 발견`);

              for (const match of matches) {
                let rankingText = '';

                if (match.length === 4) {
                  // "카테고리 ・ 서브카테고리 X위" 형태
                  const category = match[1].trim();
                  const subcategory = match[2].trim();
                  const rank = match[3];
                  rankingText = `${category} ・ ${subcategory} ${rank}위`;
                } else if (match.length === 3) {
                  // "카테고리 X위" 형태
                  const category = match[1].trim();
                  const rank = match[2];
                  rankingText = `${category} ${rank}위`;
                }

                // console.log(`패턴 매치 후보: "${rankingText}"`);

                // 최종 유효성 검사
                if (rankingText &&
                    rankingText.length > 5 &&
                    rankingText.length < 50 &&
                    !rankingText.includes('원') &&
                    !rankingText.includes('랭킹') &&
                    !rankingText.includes('포인트') &&
                    !rankingText.match(/^\d/) &&
                    rankingText.match(/\d+위$/)) {

                  result.categoryRanking = rankingText;
                  // console.log(`✅ 텍스트 패턴에서 깨끗한 랭킹 발견: "${rankingText}"`);
                  foundRanking = true;
                  break;
                }
              }
              if (foundRanking) break;
            }
          }

          if (!result.categoryRanking) {
            // console.log('❌ 카테고리 랭킹을 찾을 수 없음');
          } else {
            // console.log(`🏆 최종 카테고리 랭킹: "${result.categoryRanking}"`);
          }

        } catch (e) {
          // console.log('❌ 카테고리 랭킹 추출 오류:', e.message);
        }

        // 범용적 수상 정보 추출 (HTML 패턴 기반)
        result.awards = [];
        try {
          // console.log('🏆 범용 수상 정보 추출 시작...');

          // 페이지에서 수상 정보 패턴을 광범위하게 찾기
          const pageText = document.body.textContent || document.documentElement.textContent || '';
          // console.log(`📝 페이지 전체 텍스트 길이: ${pageText.length}`);

          // 다양한 어워드 패턴들
          const awardPatterns = [
            // 1. 기존 패턴: 2023 하반기 트렌드 어워드 - 수분 부문
            /(20\d{2}\s*(?:상반기|하반기)?\s*트렌드\s*어워드\s*[-–]\s*[가-힣]+\s*부문).*?([가-힣\/]+\s*\d+위)/g,

            // 2. 연간 어워드 패턴: 2023년 올해의 제품
            /(20\d{2}년?\s*올해의?\s*[가-힣]+).*?([가-힣\/]+\s*\d+위)/g,

            // 3. 카테고리별 어워드: 에센스 부문 1위
            /([가-힣\/]+\s*부문\s*\d+위)/g,

            // 4. 베스트 제품 패턴: 베스트 수분 제품
            /(베스트\s*[가-힣]+\s*제품).*?(\d+위)/g,

            // 5. 어워드가 포함된 일반 패턴
            /([가-힣]*어워드[가-힣]*)\s*[-–]\s*([가-힣\/]+.*?\d+위)/g
          ];

          let foundAwards = 0;

          for (const pattern of awardPatterns) {
            let match;
            while ((match = pattern.exec(pageText)) !== null && foundAwards < 5) {
              const rawTitle = match[1]?.trim();
              const rawDescription = match[2]?.trim();

              if (rawTitle && rawDescription && rawTitle.length > 2 && rawDescription.length > 2) {
                // 텍스트 정리
                let title = rawTitle.replace(/\s+/g, ' ').trim();
                let description = rawDescription.replace(/\s+/g, ' ').trim();

                // 중복 체크
                const isDuplicate = result.awards.some(award =>
                  award.title === title || award.description === description
                );

                if (!isDuplicate) {
                  result.awards.push({
                    title: title,
                    description: description
                  });
                  foundAwards++;
                  // console.log(`✅ 수상 정보 추출: "${title}" - "${description}"`);
                }
              }

              // 무한 루프 방지
              if (pattern.lastIndex === match.index) {
                break;
              }
            }
          }

          // 추가 검색: 단순히 "위" 패턴이 있는 경우
          if (result.awards.length === 0 && pageText.includes('위')) {
            const simpleRankingPatterns = [
              /([가-힣\/]+)\s*(\d+위)/g,
              /(랭킹\s*\d+위)/g,
              /(순위\s*\d+위)/g
            ];

            for (const pattern of simpleRankingPatterns) {
              let match;
              while ((match = pattern.exec(pageText)) !== null && result.awards.length < 3) {
                const category = match[1]?.trim() || '카테고리';
                const ranking = match[2]?.trim();

                if (ranking && ranking.includes('위')) {
                  result.awards.push({
                    title: `${category} 랭킹`,
                    description: ranking
                  });
                  // console.log(`✅ 간단 랭킹 정보: "${category}" - "${ranking}"`);
                }

                if (pattern.lastIndex === match.index) {
                  break;
                }
              }
            }
          }

          // console.log(`🏆 범용 추출 결과: ${result.awards.length}개`);

        } catch (e) {
          console.log('❌ 범용 수상 정보 추출 오류:', e.message);
        }

        // AI 분석 데이터 추출 - 완전히 새로운 
        result.aiAnalysis = { pros: [], cons: [] };
        
        try {
          console.log('🤖 AI 분석 추출 시작 (실제 구조 기반)...');
          
          // 1. AI 분석 섹션 찾기 (실제 구조)
          const aiSections = document.querySelectorAll('section');
          let aiSection = null;
          
          for (const section of aiSections) {
            const text = section.textContent || '';
            if (text.includes('AI가 분석한 리뷰') || (text.includes('좋아요') && text.includes('아쉬워요'))) {
              aiSection = section;
              console.log('✅ AI 분석 섹션 발견');
              break;
            }
          }
          
          if (aiSection) {
            console.log('AI 섹션 HTML:', aiSection.innerHTML.substring(0, 500));
            
            // 2. 좋아요/아쉬워요 컨테이너들 찾기
            const containers = aiSection.querySelectorAll('.grow');
            console.log('컨테이너 수:', containers.length);
            
            containers.forEach((container, index) => {
              const headerText = container.querySelector('span')?.textContent || '';
              console.log(`컨테이너 ${index + 1} 헤더:`, headerText);
              
              if (headerText.includes('좋아요')) {
                // 좋아요 섹션
                const items = container.querySelectorAll('li');
                console.log('좋아요 항목 수:', items.length);
                
                items.forEach(item => {
                  const spans = item.querySelectorAll('span');
                  if (spans.length >= 2) {
                    const name = spans[0].textContent.trim();
                    const count = parseInt(spans[1].textContent.trim().replace(/,/g, ''));
                    
                    if (name && !isNaN(count) && count > 0) {
                      result.aiAnalysis.pros.push({ name, count });
                      console.log('✅ 장점 추가:', name, '(' + count + ')');
                    }
                  }
                });
              }
              
              if (headerText.includes('아쉬워요')) {
                // 아쉬워요 섹션
                const items = container.querySelectorAll('li');
                console.log('아쉬워요 항목 수:', items.length);
                
                items.forEach(item => {
                  const spans = item.querySelectorAll('span');
                  if (spans.length >= 2) {
                    const name = spans[0].textContent.trim();
                    const count = parseInt(spans[1].textContent.trim().replace(/,/g, ''));
                    
                    if (name && !isNaN(count) && count > 0) {
                      result.aiAnalysis.cons.push({ name, count });
                      console.log('✅ 단점 추가:', name, '(' + count + ')');
                    }
                  }
                });
              }
            });
            
            // 3. 대안 방법: 직접적인 li 요소 탐색
            if (result.aiAnalysis.pros.length === 0 && result.aiAnalysis.cons.length === 0) {
              console.log('대안 방법으로 AI 분석 추출...');
              
              const allLiElements = aiSection.querySelectorAll('li');
              console.log('전체 li 요소 수:', allLiElements.length);
              
              let isProsSection = false;
              let isConsSection = false;
              
              // 섹션 구분을 위해 부모 요소 확인
              allLiElements.forEach((li) => {
                const parentContainer = li.closest('.grow');
                if (parentContainer) {
                  const headerSpan = parentContainer.querySelector('span');
                  const headerText = headerSpan?.textContent || '';
                  
                  if (headerText.includes('좋아요')) {
                    isProsSection = true;
                    isConsSection = false;
                  } else if (headerText.includes('아쉬워요')) {
                    isProsSection = false;
                    isConsSection = true;
                  }
                }
                
                const spans = li.querySelectorAll('span');
                if (spans.length >= 2) {
                  const name = spans[0].textContent.trim();
                  const count = parseInt(spans[1].textContent.trim());
                  
                  if (name && !isNaN(count) && count > 0) {
                    if (isProsSection) {
                      result.aiAnalysis.pros.push({ name, count });
                      console.log('🔄 장점 추가 (대안):', name, '(' + count + ')');
                    } else if (isConsSection) {
                      result.aiAnalysis.cons.push({ name, count });
                      console.log('🔄 단점 추가 (대안):', name, '(' + count + ')');
                    }
                  }
                }
              });
            }
          }
          
          console.log(`✅ AI 분석 추출 완료 - 장점: ${result.aiAnalysis.pros.length}개, 단점: ${result.aiAnalysis.cons.length}개`);
          
          // 결과 로깅
          result.aiAnalysis.pros.forEach((p, i) => {
            console.log(`  장점 ${i+1}: ${p.name} (${p.count})`);
          });
          result.aiAnalysis.cons.forEach((c, i) => {
            console.log(`  단점 ${i+1}: ${c.name} (${c.count})`);
          });
          
        } catch (e) {
          console.log('❌ AI 분석 추출 오류:', e.message);
        }
        
        // 크롤링 실패 시 빈 데이터로 유지 (수동 편집 가능)
        if (result.aiAnalysis.pros.length === 0 && result.aiAnalysis.cons.length === 0) {
          console.log('AI 분석 크롤링 실패 - 빈 데이터로 유지 (어드민에서 수동 편집 가능)');
          result.aiAnalysis = {
            pros: [],
            cons: []
          };
        }
        
        // 영어 사이트 크롤링 코드 삭제됨 (한국 사이트 크롤링으로 대체)
        
        // 성분 정보 추출 - 이미 추출된 데이터 사용
        console.log('🧪 성분 정보 처리 (이미 추출된 데이터 사용)...');
        
        // 이미 추출된 데이터가 있으면 사용
        if (Object.keys(result.ingredients).length > 0) {
          console.log('✅ 이미 추출된 성분 데이터 사용:', result.ingredients);
        } else {
          console.log('❌ 성분 데이터 추출 실패 - 빈 객체로 유지');
          result.ingredients = {};
        }
        
        console.log('🧪 성분 정보 처리 완료:', result.ingredients);
        
        // 피부타입별 분석 초기화 (한국 사이트)
        result.skinTypeAnalysis = {
          oily: { good: 0, bad: 0 },
          dry: { good: 0, bad: 0 },
          sensitive: { good: 0, bad: 0 }
        };
        
        // 피부타입별 분석 추출 - 실제 HTML 구조 기반
        try {
          console.log('🧴 피부타입별 분석 추출 시작 (실제 구조 기반)...');
          
          // 1. 피부타입별 성분 섹션 찾기 (실제 구조)
          const sections = document.querySelectorAll('section');
          let skinTypeSection = null;
          
          for (const section of sections) {
            const text = section.textContent || '';
            if (text.includes('피부 타입별 성분')) {
              skinTypeSection = section;
              console.log('✅ 피부타입별 성분 섹션 발견');
              break;
            }
          }
          
          if (skinTypeSection) {
            console.log('피부타입 섹션 HTML:', skinTypeSection.innerHTML.substring(0, 1000));
            
            // 2. 다양한 방법으로 피부타입별 데이터 추출
            
            // 개선된 방식: 실제 HTML 구조에 맞춘 정확한 추출
            const skinTypeRows = skinTypeSection.querySelectorAll('.flex.items-center.gap-x-24.py-8');
            console.log('피부타입 행 수:', skinTypeRows.length);

            skinTypeRows.forEach((row, index) => {
              const text = row.textContent || '';
              console.log(`피부타입 행 ${index + 1}:`, text.substring(0, 100));

              // 실제 HTML 구조에 맞춘 정확한 셀렉터 사용
              // 좋아요 숫자: .text-mint-primary 클래스 (썸업 아이콘 옆)
              // 아쉬워요 숫자: .text-red-primary 클래스

              const mintSpans = row.querySelectorAll('.text-mint-primary');
              const redSpans = row.querySelectorAll('.text-red-primary');

              console.log(`행 ${index + 1} - 민트 span 수: ${mintSpans.length}, 레드 span 수: ${redSpans.length}`);

              let good = 0, bad = 0;

              // 좋아요 숫자 찾기 (SVG 아이콘 다음의 span)
              mintSpans.forEach(span => {
                const spanText = span.textContent.trim();
                console.log(`민트 span 텍스트: "${spanText}"`);
                if (/^\d+$/.test(spanText)) {
                  good = parseInt(spanText) || 0;
                }
              });

              // 아쉬워요 숫자 찾기
              redSpans.forEach(span => {
                const spanText = span.textContent.trim();
                console.log(`레드 span 텍스트: "${spanText}"`);
                if (/^\d+$/.test(spanText)) {
                  bad = parseInt(spanText) || 0;
                }
              });

              console.log(`행 ${index + 1} 추출된 값 - 좋아요: ${good}, 아쉬워요: ${bad}`);

              // 피부타입 구분
              if (text.includes('지성 피부')) {
                result.skinTypeAnalysis.oily = { good, bad };
                console.log('✅ 지성 피부:', result.skinTypeAnalysis.oily);
              }
              else if (text.includes('건성 피부')) {
                result.skinTypeAnalysis.dry = { good, bad };
                console.log('✅ 건성 피부:', result.skinTypeAnalysis.dry);
              }
              else if (text.includes('민감성 피부')) {
                result.skinTypeAnalysis.sensitive = { good, bad };
                console.log('✅ 민감성 피부:', result.skinTypeAnalysis.sensitive);
              }
            });
          }
          
          
          console.log('🧴 피부타입별 분석 추출 결과:', result.skinTypeAnalysis);
          
          // 성공 여부 확인
          const hasValidSkinType = Object.values(result.skinTypeAnalysis).some(type => 
            type.good > 0 || type.bad > 0
          );
          
          if (hasValidSkinType) {
            console.log('✅ 피부타입별 분석 추출 성공!');
          } else {
            console.log('❌ 피부타입별 분석 추출 실패 - 빈 데이터로 유지');
          }
          
        } catch (e) {
          console.log('❌ 피부타입 분석 추출 오류:', e.message);
        }
        
        console.log('한국 사이트 상세 데이터 추출 완료:', result);
        return result;
      }, ingredientsData);

      console.log(`📄 한국 사이트 상세 데이터 추출 결과 (${product.name}):`, JSON.stringify(detail, null, 2));

      return detail;

    } catch (error) {
      console.error(`❌ 한국 사이트 상세 페이지 크롤링 오류 (${product.name}):`, error.message);

      // 페이지 정리 (에러 발생 시에도 항상 실행)
      try {
        if (page && !page.isClosed()) {
          await page.close();
        }
      } catch (closeError) {
        console.log(`⚠️ 페이지 정리 실패 (${product.name}):`, closeError.message);
      }

      // "Execution context was destroyed" 오류 시 재시도
      if (error.message.includes('Execution context was destroyed') && attempts < maxRetries) {
        attempts++;
        console.log(`🔄 "Execution context destroyed" 감지, 재시도 실행 (${attempts}/${maxRetries})`);
        continue; // while 루프 계속
      }

      // 재시도 횟수 초과하거나 다른 오류면 기본값 반환
      attempts++;
      if (attempts > maxRetries) {
        console.log(`❌ 최대 재시도 횟수 초과 (${product.name})`);
      }
      break; // while 루프 종료
    } finally {
      // 정상 완료 시에도 페이지 정리 확인
      try {
        if (page && !page.isClosed()) {
          await page.close();
        }
      } catch (finallyError) {
        console.log(`⚠️ 최종 페이지 정리 실패 (${product.name}):`, finallyError.message);
      }
    }

    // 성공 시 루프 종료
    if (detail) {
      return detail;
    }

    attempts++;
  }

  // 모든 재시도 실패 시 기본값 반환
  console.log(`❌ 모든 재시도 실패, 기본값 반환: ${product.name}`);
  return getDefaultDetailData();
}

// 브라우저 준비 상태 확인 및 워밍업
async function warmupBrowser(browser) {
  console.log('🔥 브라우저 워밍업 시작...');
  let warmupPage = null;

  try {
    // 더미 페이지 생성 및 테스트
    warmupPage = await browser.newPage();

    // 기본 설정 적용
    await setupResourceBlocking(warmupPage);
    await setupBotBypass(warmupPage);

    // 간단한 페이지로 테스트
    await warmupPage.goto('about:blank', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 브라우저 상태 확인
    const isReady = await warmupPage.evaluate(() => {
      return document.readyState === 'complete';
    });

    if (isReady) {
      console.log('✅ 브라우저 워밍업 완료 - 준비 상태 확인됨');
    } else {
      console.log('⚠️ 브라우저 워밍업 완료 - 하지만 완전하지 않을 수 있음');
    }

  } catch (error) {
    console.log('⚠️ 브라우저 워밍업 중 오류:', error.message);
  } finally {
    if (warmupPage && !warmupPage.isClosed()) {
      try {
        await warmupPage.close();
      } catch (e) {
        console.log('⚠️ 워밍업 페이지 정리 실패:', e.message);
      }
    }
  }

  // 워밍업 후 추가 대기
  await new Promise(resolve => setTimeout(resolve, 2000));
}

// 동시 처리로 성능 향상된 상세 페이지 크롤링 함수
async function crawlKoreanDetailPages(browser, products) {
  console.log(`📄 한국 사이트 상세 페이지 크롤링 시작: 총 ${products.length}개 제품`);

  // 첫 번째 배치 전 브라우저 워밍업
  await warmupBrowser(browser);

  const results = [];
  const batchSize = CONFIG.LIMITS.CONCURRENT_PAGES;

  // 제품들을 배치로 나누어 점진적 처리 (안정성 향상)
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    console.log(`📦 배치 처리 중: ${i + 1}-${Math.min(i + batchSize, products.length)}/${products.length}`);

    const batchResults = [];

    // 배치 내에서도 점진적 생성 (동시 생성 충돌 방지)
    for (let j = 0; j < batch.length; j++) {
      const product = batch[j];
      const productIndex = i + j;

      // 첫 번째 제품이 아니면 약간의 지연 (리소스 경합 방지)
      if (j > 0) {
        await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      }

      try {
        console.log(`📄 개별 처리 시작: ${productIndex + 1}/${products.length} - ${product.name}`);
        const result = await crawlSingleProductDetail(browser, product, productIndex, products.length);
        batchResults.push(result);
        console.log(`✅ 개별 처리 완료: ${productIndex + 1}/${products.length} - ${product.name}`);
      } catch (error) {
        console.error(`❌ 개별 처리 실패 (${product.name}):`, error.message);
        // 개별 실패 시 기본값으로 처리
        batchResults.push(getDefaultDetailData());
      }
    }

    results.push(...batchResults);
    console.log(`✅ 배치 완료: ${i + 1}-${Math.min(i + batchSize, products.length)}/${products.length} (성공: ${batchResults.length}개)`);

    // 배치 간 간격 (서버 부하 방지)
    if (i + batchSize < products.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`📄 한국 사이트 상세 페이지 크롤링 완료: ${results.length}개`);
  return results;
}

