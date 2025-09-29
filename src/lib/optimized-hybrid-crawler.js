// 🚀 최적화된 하이브리드 크롤링 시스템
// 성능 개선: 병렬 처리, 조건부 로깅, 스마트 대기

const puppeteer = require('puppeteer');

// ===========================================
// 1. 로깅 시스템 (조건부 로깅으로 성능 향상)
// ===========================================
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;

const logger = {
  error: (...args) => CURRENT_LOG_LEVEL >= LOG_LEVELS.ERROR && console.error('[ERROR]', ...args),
  warn: (...args) => CURRENT_LOG_LEVEL >= LOG_LEVELS.WARN && console.warn('[WARN]', ...args),
  info: (...args) => CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO && console.log('[INFO]', ...args),
  debug: (...args) => CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG && console.log('[DEBUG]', ...args)
};

// ===========================================
// 2. 최적화된 설정 (불필요한 옵션 제거)
// ===========================================
const CONFIG = {
  TIMEOUTS: {
    PAGE_LOAD: 15000,      // 15초로 단축
    ELEMENT_WAIT: 5000,    // 5초로 단축
    SMART_WAIT: 3000       // 조건부 대기 최대 시간
  },
  URLS: {
    ENGLISH_BASE: 'https://www.hwahae.com/en/rankings',
    KOREAN_DETAIL: 'https://www.hwahae.co.kr/goods'
  },
  LIMITS: {
    MAX_ITEMS: 50,
    CONCURRENT_CRAWLS: 5,  // 병렬 처리 수
    MAX_RETRIES: 2         // 재시도 횟수
  },
  BROWSER_ARGS: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
};

// ===========================================
// 3. 스마트 대기 함수 (조건부 대기로 속도 향상)
// ===========================================
async function smartWait(page, selector, maxWait = CONFIG.TIMEOUTS.SMART_WAIT) {
  try {
    await page.waitForSelector(selector, {
      timeout: maxWait,
      visible: true
    });
    return true;
  } catch {
    return false;
  }
}

async function waitForContentChange(page, checkFn, maxWait = CONFIG.TIMEOUTS.SMART_WAIT) {
  const startTime = Date.now();
  let lastContent = await page.evaluate(checkFn);

  while (Date.now() - startTime < maxWait) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const currentContent = await page.evaluate(checkFn);

    if (currentContent !== lastContent) {
      return true;
    }
    lastContent = currentContent;
  }

  return false;
}

// ===========================================
// 4. 최적화된 스크롤 함수
// ===========================================
async function optimizedScroll(page, maxItems = CONFIG.LIMITS.MAX_ITEMS) {
  logger.debug('스크롤 시작');

  let previousHeight = 0;
  let currentItemCount = 0;
  let noChangeCount = 0;
  const maxNoChange = 3;

  while (currentItemCount < maxItems && noChangeCount < maxNoChange) {
    // 현재 아이템 수 체크
    currentItemCount = await page.evaluate(() =>
      document.querySelectorAll('[data-testid*="product"], .product-item, [class*="ProductCard"]').length
    );

    if (currentItemCount >= maxItems) {
      logger.info(`목표 아이템 수 도달: ${currentItemCount}/${maxItems}`);
      break;
    }

    // 스크롤
    const currentHeight = await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
      return document.body.scrollHeight;
    });

    // 높이 변화 체크
    if (currentHeight === previousHeight) {
      noChangeCount++;
      logger.debug(`스크롤 변화 없음 (${noChangeCount}/${maxNoChange})`);
    } else {
      noChangeCount = 0;
      previousHeight = currentHeight;
    }

    // 동적 대기 (콘텐츠 로딩 감지)
    await waitForContentChange(page,
      () => document.querySelectorAll('[data-testid*="product"], .product-item, [class*="ProductCard"]').length,
      1000
    );
  }

  logger.info(`스크롤 완료: ${currentItemCount}개 아이템 로드됨`);
  return currentItemCount;
}

// ===========================================
// 5. 병렬 크롤링 시스템
// ===========================================
async function crawlInBatches(items, crawlFunction, batchSize = CONFIG.LIMITS.CONCURRENT_CRAWLS) {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    logger.info(`크롤링 배치 ${Math.floor(i/batchSize) + 1}/${Math.ceil(items.length/batchSize)}`);

    const batchResults = await Promise.allSettled(
      batch.map((item, index) => crawlFunction(item, i + index))
    );

    // 결과 처리 및 실패 항목 재시도
    for (let j = 0; j < batchResults.length; j++) {
      if (batchResults[j].status === 'fulfilled') {
        results.push(batchResults[j].value);
      } else {
        logger.warn(`크롤링 실패 (인덱스 ${i + j}):`, batchResults[j].reason);

        // 재시도
        for (let retry = 0; retry < CONFIG.LIMITS.MAX_RETRIES; retry++) {
          try {
            logger.debug(`재시도 ${retry + 1}/${CONFIG.LIMITS.MAX_RETRIES}`);
            const result = await crawlFunction(batch[j], i + j);
            results.push(result);
            break;
          } catch (error) {
            if (retry === CONFIG.LIMITS.MAX_RETRIES - 1) {
              logger.error(`최종 실패 (인덱스 ${i + j})`);
              results.push(null);
            }
          }
        }
      }
    }
  }

  return results.filter(r => r !== null);
}

// ===========================================
// 6. 메인 크롤링 함수 (영어 사이트)
// ===========================================
async function crawlEnglishSite(category = 'trending', themeId = '5102') {
  const browser = await puppeteer.launch({
    headless: process.env.NODE_ENV === 'production',
    args: CONFIG.BROWSER_ARGS
  });

  let page;

  try {
    page = await browser.newPage();

    // User-Agent 설정
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

    // 불필요한 리소스 차단
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['font', 'media'].includes(resourceType) ||
          req.url().includes('analytics') ||
          req.url().includes('tracking')) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const url = `${CONFIG.URLS.ENGLISH_BASE}?theme_id=${themeId}`;
    logger.info(`영어 사이트 크롤링 시작: ${url}`);

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.TIMEOUTS.PAGE_LOAD
    });

    // 스크롤하여 제품 로드
    await optimizedScroll(page);

    // 제품 정보 추출
    const products = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid*="product"], .product-item, [class*="ProductCard"]');

      return Array.from(items).slice(0, 50).map((item, index) => {
        const getText = (selectors) => {
          for (const selector of selectors) {
            const elem = item.querySelector(selector);
            if (elem) return elem.textContent?.trim() || '';
          }
          return '';
        };

        const getImage = (selectors) => {
          for (const selector of selectors) {
            const elem = item.querySelector(selector);
            if (elem) {
              return elem.src || elem.getAttribute('data-src') || '';
            }
          }
          return '';
        };

        return {
          rank: index + 1,
          brand: getText(['[class*="brand"]', '.brand-name', '[data-testid*="brand"]']),
          name: getText(['[class*="product-name"]', '.product-title', 'h3', 'h2']),
          price: getText(['[class*="price"]', '.price', '[data-testid*="price"]']),
          volume: getText(['[class*="volume"]', '.size', '[data-testid*="size"]']),
          image: getImage(['img[class*="product"]', 'img[alt*="product"]', 'img']),
          productUrl: item.querySelector('a')?.href || ''
        };
      });
    });

    logger.info(`영어 사이트에서 ${products.length}개 제품 추출 완료`);
    return products;

  } catch (error) {
    logger.error('영어 사이트 크롤링 실패:', error.message);
    throw error;
  } finally {
    if (page) await page.close();
    await browser.close();
  }
}

// ===========================================
// 7. 상세 페이지 크롤링 (병렬 처리)
// ===========================================
async function crawlProductDetail(product, index) {
  const browser = await puppeteer.launch({
    headless: true,
    args: CONFIG.BROWSER_ARGS
  });

  let page;

  try {
    page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');

    // 한국어 상세 페이지 URL 구성
    const koreanUrl = product.productUrl.replace('/en/', '/').replace('hwahae.com', 'hwahae.co.kr');

    logger.debug(`상세 크롤링 ${index + 1}: ${product.name}`);

    await page.goto(koreanUrl, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.TIMEOUTS.PAGE_LOAD
    });

    // 필요한 섹션만 대기
    await smartWait(page, '[class*="ingredient"], [class*="award"], [class*="analysis"]', 3000);

    // 상세 정보 추출
    const detailInfo = await page.evaluate(() => {
      // 수상 정보 추출 (개선된 로직)
      const extractAwards = () => {
        const awards = [];
        const awardLabel = Array.from(document.querySelectorAll('span, div'))
          .find(el => el.textContent?.trim() === '수상');

        if (awardLabel) {
          const container = awardLabel.closest('div.flex');
          if (container) {
            const spans = container.querySelectorAll('span');
            if (spans.length >= 2) {
              awards.push({
                title: spans[0].textContent?.trim() || '',
                description: spans[1].textContent?.trim() || ''
              });
            }
          }
        }
        return awards;
      };

      // 성분 정보 추출 (간소화)
      const extractIngredients = () => {
        const result = {
          total: 0,
          lowRisk: 0,
          mediumRisk: 0,
          highRisk: 0
        };

        const ingredientSection = document.querySelector('[class*="ingredient"]');
        if (ingredientSection) {
          const numbers = ingredientSection.textContent.match(/\d+/g);
          if (numbers && numbers.length >= 4) {
            result.total = parseInt(numbers[0]) || 0;
            result.lowRisk = parseInt(numbers[1]) || 0;
            result.mediumRisk = parseInt(numbers[2]) || 0;
            result.highRisk = parseInt(numbers[3]) || 0;
          }
        }

        return result;
      };

      return {
        awards: extractAwards(),
        ingredients: extractIngredients(),
        brandLogo: document.querySelector('img[src*="brands/"], img[alt*="brand"]')?.src || ''
      };
    });

    return { ...product, ...detailInfo };

  } catch (error) {
    logger.error(`상세 크롤링 실패 (${product.name}):`, error.message);
    return product; // 기본 정보라도 반환
  } finally {
    if (page) await page.close();
    await browser.close();
  }
}

// ===========================================
// 8. 메인 크롤링 함수
// ===========================================
async function crawlHwahaeOptimized(category = 'trending', themeId = '5102', maxDetails = 10) {
  try {
    logger.info('🚀 최적화된 크롤링 시작');
    const startTime = Date.now();

    // 1단계: 영어 사이트에서 기본 정보 크롤링
    const products = await crawlEnglishSite(category, themeId);

    // 2단계: 상세 정보 병렬 크롤링 (상위 N개만)
    const productsForDetail = products.slice(0, maxDetails);
    logger.info(`상세 크롤링 시작: ${productsForDetail.length}개 제품`);

    const detailedProducts = await crawlInBatches(
      productsForDetail,
      crawlProductDetail,
      CONFIG.LIMITS.CONCURRENT_CRAWLS
    );

    // 3단계: 결과 병합
    const finalProducts = [
      ...detailedProducts,
      ...products.slice(maxDetails)
    ];

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    logger.info(`✅ 크롤링 완료: ${finalProducts.length}개 제품, 소요 시간: ${duration}초`);

    return finalProducts;

  } catch (error) {
    logger.error('크롤링 실패:', error);
    throw error;
  }
}

// ===========================================
// 9. 익스포트
// ===========================================
module.exports = {
  crawlHwahaeRealData: crawlHwahaeOptimized,
  crawlEnglishSite,
  crawlProductDetail,
  logger
};