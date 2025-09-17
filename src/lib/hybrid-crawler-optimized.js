// 최적화된 하이브리드 크롤링: 영어 사이트(가격/용량) + 한국어 사이트(이미지/변동정보)

// 스마트 대기 함수: 네트워크 활동 + DOM 변화 감지
async function waitForNetworkIdle(page, maxWait = 3000, idleTime = 300) {
  let networkIdleTimer;
  let requestCount = 0;
  let isResolved = false;

  const requestHandler = (req) => {
    // 이미지나 폰트 등 불필요한 리소스는 카운트하지 않음
    if (!['xhr', 'fetch', 'document'].includes(req.resourceType())) return;
    requestCount++;
  };

  const responseHandler = (res) => {
    if (!['xhr', 'fetch', 'document'].includes(res.request().resourceType())) return;
    requestCount--;

    if (requestCount <= 0 && !isResolved) {
      clearTimeout(networkIdleTimer);
      networkIdleTimer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          resolve();
        }
      }, idleTime);
    }
  };

  const cleanup = () => {
    page.off('request', requestHandler);
    page.off('response', responseHandler);
    clearTimeout(networkIdleTimer);
  };

  let resolve;
  const promise = new Promise((res) => { resolve = res; });

  page.on('request', requestHandler);
  page.on('response', responseHandler);

  // 최대 대기 시간 타임아웃
  setTimeout(() => {
    if (!isResolved) {
      isResolved = true;
      cleanup();
      resolve();
    }
  }, maxWait);

  // 초기 아이들 타이머 설정
  networkIdleTimer = setTimeout(() => {
    if (!isResolved) {
      isResolved = true;
      cleanup();
      resolve();
    }
  }, idleTime);

  return promise;
}

// 빠른 인간 시뮬레이션 (100-200ms)
async function fastHumanDelay() {
  const delay = Math.random() * 100 + 100; // 100-200ms
  await new Promise(resolve => setTimeout(resolve, delay));
}

export async function crawlHwahaeRealData(category = 'trending', themeId = '5102') {
  if (typeof window !== 'undefined') {
    throw new Error('이 함수는 서버사이드에서만 실행 가능합니다.');
  }

  try {
    const puppeteer = await import('puppeteer');
    
    const startTime = Date.now();
    console.log(`🔄 최적화된 하이브리드 크롤링 시작: themeId=${themeId}`);

    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-images',
        '--disable-javascript',
        '--disable-plugins',
        '--disable-extensions',
        '--disable-gpu',
        '--max_old_space_size=1024', // 메모리 최적화
        '--max_active_workers=6' // 병렬 처리 증가
      ]
    });

    // 병렬로 두 사이트 크롤링
    console.log('🚀 영어/한국어 사이트 병렬 크롤링 시작...');
    const [englishData, koreanData] = await Promise.all([
      crawlEnglishSite(browser, themeId),
      crawlKoreanSite(browser, themeId)
    ]);

    // 데이터 병합
    console.log('🔗 데이터 병합...');
    const mergedData = mergeData(englishData, koreanData);

    // 상위 10개 제품에 대해 상세페이지 크롤링 추가
    console.log('🧪 상세페이지 크롤링 시작 (상위 10개)...');
    const detailedData = await crawlProductDetails(browser, mergedData.slice(0, 10));

    // 상세 정보가 있는 제품은 업데이트, 없는 제품은 기본 정보 유지
    const finalData = mergedData.map((item, index) => {
      if (index < 10 && detailedData[index]) {
        return { ...item, ...detailedData[index] };
      }
      return item;
    });

    await browser.close();

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    console.log(`✅ 최적화된 하이브리드 크롤링 완료: ${finalData.length}개 아이템 (${duration}초)`);
    console.log(`📊 성능: 영어 ${englishData.length}개, 한국어 이미지 ${koreanData.filter(item => item?.image).length}개`);
    console.log(`🧪 상세정보: 상위 ${Math.min(10, finalData.length)}개 제품 완료`);

    return finalData;

  } catch (error) {
    console.error('❌ 하이브리드 크롤링 오류:', error);
    throw error;
  }
}

// 영어 사이트에서 가격/용량 정보만 크롤링 (최적화)
async function crawlEnglishSite(browser, themeId) {
  const page = await browser.newPage();
  
  // 성능 최적화 설정
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setRequestInterception(true);
  
  // 불필요한 리소스 차단
  page.on('request', (request) => {
    const resourceType = request.resourceType();
    if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });
  
  const englishUrl = `https://www.hwahae.com/en/rankings?theme_id=${themeId}`;
  await page.goto(englishUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
  
  // 스마트 대기: 네트워크 활동 기반 (최대 2초)
  await waitForNetworkIdle(page, 2000, 500);

  // 최적화된 연속 스크롤링 + 인간 시뮬레이션
  await page.evaluate(() => {
    const totalHeight = document.body.scrollHeight;
    // 빠른 연속 스크롤로 모든 구간 활성화
    for(let i = 1; i <= 3; i++) {
      window.scrollTo(0, totalHeight * i / 3);
    }
  });
  await fastHumanDelay(); // 100-200ms 빠른 인간 시뮬레이션

  // 스크롤 후 스마트 대기 (최대 800ms)
  await waitForNetworkIdle(page, 800, 200);

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
        console.error(`❌ 영어 사이트 아이템 ${index + 1} 파싱 오류:`, error);
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
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const koreanUrl = `https://www.hwahae.co.kr/rankings?english_name=trending&theme_id=${themeId}`;
  await page.goto(koreanUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

  // 스마트 초기 대기: 네트워크 활동 기반 (최대 1.5초)
  await waitForNetworkIdle(page, 1500, 300);

  // 최적화된 연속 스크롤링 + 인간 시뮬레이션
  await page.evaluate(() => {
    const totalHeight = document.body.scrollHeight;
    // 빠른 연속 스크롤로 모든 구간 활성화
    for(let i = 1; i <= 3; i++) {
      window.scrollTo(0, totalHeight * i / 3);
    }
  });
  await fastHumanDelay(); // 100-200ms 빠른 인간 시뮬레이션

  // 동적 로딩 완료 스마트 대기 (최대 1.5초)
  await waitForNetworkIdle(page, 1500, 300);

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
        
        // 데이터가 있는 경우만 저장
        if (image || rankChange) {
          results[index] = { image, rankChange };
          if (image && brand && name) {
            console.log(`✓ ${index + 1}위: ${brand} - ${name.substring(0, 20)}...`);
          }
        }
        
      } catch (error) {
        console.error(`한국어 사이트 아이템 ${index} 처리 중 오류:`, error);
      }
    });

    const imageCount = results.filter(item => item?.image).length;
    const changeCount = results.filter(item => item?.rankChange).length;
    console.log(`한국어 사이트에서 이미지 ${imageCount}개, 변동정보 ${changeCount}개 추출`);

    return results;
  });

  await page.close();
  return koreanData;
}

// 상세페이지 크롤링 함수 (최적화된 버전)
async function crawlProductDetails(browser, products) {
  const detailedData = [];

  console.log(`🔍 ${products.length}개 제품의 상세정보 크롤링 시작...`);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    try {
      console.log(`🧪 ${i + 1}/${products.length}: ${product.brand} - ${product.name.substring(0, 30)}...`);

      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // 상세페이지 URL로 이동
      const detailUrl = product.link || `https://www.hwahae.co.kr/products/${product.productId}`;
      await page.goto(detailUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });

      // 스마트 대기: 페이지 로딩 완료
      await waitForNetworkIdle(page, 2000, 400);

      // 상세정보 크롤링
      const details = await page.evaluate(() => {
        try {
          // 성분 정보 추출
          const ingredientsSection = document.querySelector('[class*="ingredient"], [data-testid*="ingredient"], section:has([class*="ingredient"])');
          let ingredients = {
            componentStats: { total: 0, lowRisk: 0, mediumRisk: 0, highRisk: 0 },
            fullIngredientsList: [],
            purposeBasedIngredients: {}
          };

          if (ingredientsSection) {
            // 성분 통계 추출
            const riskElements = ingredientsSection.querySelectorAll('[class*="risk"], [class*="component"]');
            riskElements.forEach(el => {
              const text = el.textContent || '';
              const numbers = text.match(/\d+/g);
              if (numbers) {
                if (text.includes('전체') || text.includes('total')) {
                  ingredients.componentStats.total = parseInt(numbers[0]) || 0;
                } else if (text.includes('낮은') || text.includes('low')) {
                  ingredients.componentStats.lowRisk = parseInt(numbers[0]) || 0;
                } else if (text.includes('중간') || text.includes('medium')) {
                  ingredients.componentStats.mediumRisk = parseInt(numbers[0]) || 0;
                } else if (text.includes('높은') || text.includes('high')) {
                  ingredients.componentStats.highRisk = parseInt(numbers[0]) || 0;
                }
              }
            });

            // 전체 성분 리스트 추출
            const ingredientItems = ingredientsSection.querySelectorAll('button, div, span');
            const ingredientNames = new Set();

            ingredientItems.forEach(item => {
              const text = item.textContent?.trim();
              if (text && text.length > 2 && text.length < 50 &&
                  /^[A-Za-z]/.test(text) && !text.includes('위험') &&
                  !text.includes('성분') && !text.includes('전체')) {
                ingredientNames.add(text);
              }
            });

            ingredients.fullIngredientsList = Array.from(ingredientNames).slice(0, 20).map(name => ({ name }));
          }

          // AI 분석 정보 추출
          let aiAnalysis = { pros: [], cons: [] };
          const aiSection = document.querySelector('[class*="ai"], [class*="analysis"], [data-testid*="ai"]');
          if (aiSection) {
            const proElements = aiSection.querySelectorAll('[class*="pros"], [class*="장점"], [class*="positive"]');
            const conElements = aiSection.querySelectorAll('[class*="cons"], [class*="단점"], [class*="negative"]');

            proElements.forEach(el => {
              const text = el.textContent?.trim();
              if (text) aiAnalysis.pros.push({ name: text });
            });

            conElements.forEach(el => {
              const text = el.textContent?.trim();
              if (text) aiAnalysis.cons.push({ name: text });
            });
          }

          // 수상 내역 추출
          let awards = [];
          const awardElements = document.querySelectorAll('[class*="award"], [class*="수상"], [class*="베스트"]');
          awardElements.forEach(el => {
            const text = el.textContent?.trim();
            if (text && text.includes('베스트') || text.includes('수상') || text.includes('1위')) {
              awards.push({ title: text, year: new Date().getFullYear() });
            }
          });

          return {
            ingredients,
            aiAnalysis,
            awards: awards.slice(0, 5) // 최대 5개까지
          };

        } catch (error) {
          console.error('상세정보 추출 오류:', error);
          return {
            ingredients: {
              componentStats: { total: 0, lowRisk: 0, mediumRisk: 0, highRisk: 0 },
              fullIngredientsList: [],
              purposeBasedIngredients: {}
            },
            aiAnalysis: { pros: [], cons: [] },
            awards: []
          };
        }
      });

      await page.close();
      detailedData.push(details);

      // 빠른 인간 시뮬레이션
      await fastHumanDelay();

    } catch (error) {
      console.error(`❌ 제품 ${i + 1} 상세정보 크롤링 실패:`, error.message);
      detailedData.push({
        ingredients: {
          componentStats: { total: 0, lowRisk: 0, mediumRisk: 0, highRisk: 0 },
          fullIngredientsList: [],
          purposeBasedIngredients: {}
        },
        aiAnalysis: { pros: [], cons: [] },
        awards: []
      });
    }
  }

  console.log(`✅ 상세정보 크롤링 완료: ${detailedData.length}개`);
  return detailedData;
}

// 데이터 병합 (최적화)
function mergeData(englishData, koreanData) {
  return englishData.map((item, index) => {
    const koreanItem = koreanData[index] || {};
    
    return {
      ...item,
      image: koreanItem.image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(item.name)}`,
      rankChange: koreanItem.rankChange || null
    };
  });
}
