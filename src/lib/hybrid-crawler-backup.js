// 하이브리드 크롤링: 영어 사이트(가격/용량) + 한국어 사이트(이미지)

export async function crawlHwahaeRealData(category = 'trending', themeId = '5102') {
  if (typeof window !== 'undefined') {
    throw new Error('이 함수는 서버사이드에서만 실행 가능합니다.');
  }

  try {
    const puppeteer = await import('puppeteer');
    
    console.log(`🔄 하이브리드 크롤링 시작: themeId=${themeId}`);

    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    // 1단계: 영어 사이트에서 가격/용량 정보 크롤링
    console.log('🌍 1단계: 영어 사이트에서 가격/용량 정보 수집...');
    const englishData = await crawlEnglishSite(browser, themeId);
    
    // 2단계: 한국어 사이트에서 이미지 정보 크롤링
    console.log('🇰🇷 2단계: 한국어 사이트에서 이미지 정보 수집...');
    const koreanImages = await crawlKoreanImages(browser, themeId);
    
    // 3단계: 데이터 병합
    console.log('🔗 3단계: 데이터 병합...');
    const mergedData = mergeData(englishData, koreanImages);

    await browser.close();

    console.log(`✅ 하이브리드 크롤링 완료: ${mergedData.length}개 아이템`);
    return mergedData;

  } catch (error) {
    console.error('❌ 하이브리드 크롤링 오류:', error);
    throw error;
  }
}

// 영어 사이트에서 가격/용량 정보 크롤링
async function crawlEnglishSite(browser, themeId) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const englishUrl = `https://www.hwahae.com/en/rankings?theme_id=${themeId}`;
  await page.goto(englishUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  
  // SPA 로딩 대기
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  // 스크롤하여 더 많은 데이터 로드
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 3000));
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

        // 순위 추출
        let rank = index + 1;
        const rankMatch = text.match(/^(\d+)/);
        if (rankMatch && parseInt(rankMatch[1]) <= 50) {
          rank = parseInt(rankMatch[1]);
        } else if (text.startsWith('NEW')) {
          const afterNew = text.substring(3);
          const rankAfterNew = afterNew.match(/^(\d+)/);
          if (rankAfterNew && parseInt(rankAfterNew[1]) <= 50) {
            rank = parseInt(rankAfterNew[1]);
          }
        }

        // 브랜드명과 제품명 추출
        const brandElement = item.querySelector('span.hds-text-body-medium.hds-text-gray-tertiary');
        const nameElement = item.querySelector('span.hds-text-body-medium.hds-text-gray-primary');
        
        const brand = brandElement ? brandElement.textContent.trim() : '';
        const name = nameElement ? nameElement.textContent.trim() : '';

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

        // 변동 정보 (NEW, 상승, 하락)
        let rankChange = null;
        
        // NEW 체크
        if (text.includes('NEW')) {
          rankChange = { type: 'new', value: null };
        } else {
          // 상승/하락 화살표와 숫자 찾기
          const upArrowMatch = text.match(/▲\s*(\d+)|↑\s*(\d+)|UP\s*(\d+)/i);
          const downArrowMatch = text.match(/▼\s*(\d+)|↓\s*(\d+)|DOWN\s*(\d+)/i);
          
          if (upArrowMatch) {
            const value = parseInt(upArrowMatch[1] || upArrowMatch[2] || upArrowMatch[3]);
            rankChange = { type: 'up', value };
          } else if (downArrowMatch) {
            const value = parseInt(downArrowMatch[1] || downArrowMatch[2] || downArrowMatch[3]);
            rankChange = { type: 'down', value };
          }
          
          // HTML에서 SVG 화살표나 클래스명으로도 찾기
          if (!rankChange) {
            const upElement = item.querySelector('[class*="up"], [class*="rise"], [class*="increase"], svg[class*="up"]');
            const downElement = item.querySelector('[class*="down"], [class*="fall"], [class*="decrease"], svg[class*="down"]');
            
            if (upElement) {
              // 숫자 찾기
              const numberText = upElement.textContent || upElement.parentElement?.textContent || '';
              const numberMatch = numberText.match(/(\d+)/);
              const value = numberMatch ? parseInt(numberMatch[1]) : 1;
              rankChange = { type: 'up', value };
            } else if (downElement) {
              // 숫자 찾기
              const numberText = downElement.textContent || downElement.parentElement?.textContent || '';
              const numberMatch = numberText.match(/(\d+)/);
              const value = numberMatch ? parseInt(numberMatch[1]) : 1;
              rankChange = { type: 'down', value };
            }
          }
        }

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
            rankChange,
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

// 한국어 사이트에서 이미지만 크롤링
async function crawlKoreanImages(browser, themeId) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const koreanUrl = `https://www.hwahae.co.kr/rankings?english_name=trending&theme_id=${themeId}`;
  await page.goto(koreanUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  
  // 로딩 대기
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 스크롤하여 더 많은 데이터 로드
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const imageData = await page.evaluate(() => {
    const images = [];
    // 실제 HTML 구조에 맞게 li 요소들을 선택
    const itemElements = document.querySelectorAll('li');
    console.log(`한국어 사이트에서 발견된 li 요소: ${itemElements.length}개`);

    itemElements.forEach((item, index) => {
      try {
        const link = item.querySelector('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // URL에서 제품 ID 추출 (더 정확한 매칭을 위해)
        let productId = '';
        if (href) {
          const idMatch = href.match(/\/(\d+)(?:\?|$)/);
          if (idMatch) {
            productId = idMatch[1];
          }
        }
        
        // 실제 HTML 구조에 맞게 브랜드와 제품명 추출
        const brandSpan = item.querySelector('span.hds-text-body-medium.hds-text-gray-tertiary');
        const nameSpan = item.querySelector('span.hds-text-body-medium.hds-text-gray-primary');
        
        const brand = brandSpan?.textContent?.trim() || '';
        const name = nameSpan?.textContent?.trim() || '';
        
        // 랭킹 변동 정보 추출 (한국어 사이트)
        let rankChange = null;
        
        // NEW 체크
        const newSpan = item.querySelector('span.hds-text-red-primary');
        if (newSpan && newSpan.textContent.includes('NEW')) {
          rankChange = { type: 'new', value: null };
        } else {
          // 상승 화살표 (빨간색) - 정확한 선택자 사용
          const upSpan = item.querySelector('span.hds-text-red-primary[class*="smalltext-medium"]');
          if (upSpan && upSpan.querySelector('svg')) {
            const numberText = upSpan.textContent.replace(/[^\d]/g, ''); // 숫자만 추출
            const value = numberText ? parseInt(numberText) : 1;
            if (!isNaN(value)) {
              rankChange = { type: 'up', value };
            }
          }
          
          // 하락 화살표 (파란색) - 정확한 선택자 사용
          const downSpan = item.querySelector('span.hds-text-blue-600[class*="smalltext-medium"]');
          if (downSpan && downSpan.querySelector('svg')) {
            const numberText = downSpan.textContent.replace(/[^\d]/g, ''); // 숫자만 추출
            const value = numberText ? parseInt(numberText) : 1;
            if (!isNaN(value)) {
              rankChange = { type: 'down', value };
            }
          }
        }

        // 이미지 추출 (한국어 사이트에서 정확한 URL 추출)
        let image = '';
        
        // 방법 1: picture > source srcset에서 추출
        const pictureElement = item.querySelector('picture');
        if (pictureElement) {
          const sourceElement = pictureElement.querySelector('source[srcset]');
          if (sourceElement) {
            const srcset = sourceElement.getAttribute('srcset');
            // srcset에서 첫 번째 URL 추출 (1x 이미지)
            const urlMatch = srcset.match(/(https:\/\/img\.hwahae\.co\.kr\/products\/\d+\/\d+_\d+\.jpg)/);
            if (urlMatch) {
              image = urlMatch[1] + '?size=200x200';
            }
          }
        }
        
        // 방법 2: img[alt="thumbnail"] 직접 추출
        if (!image) {
          const thumbnailImg = item.querySelector('img[alt="thumbnail"]');
          if (thumbnailImg && thumbnailImg.src && thumbnailImg.src.includes('hwahae.co.kr')) {
            image = thumbnailImg.src.replace(/\?size=\d+x\d+/, '?size=200x200');
          }
        }
        
        // 방법 3: 모든 img 태그 확인
        if (!image) {
          const allImages = item.querySelectorAll('img');
          for (const img of allImages) {
            if (img.src && img.src.includes('hwahae.co.kr/products/') && !img.src.includes('data:')) {
              image = img.src.replace(/\?size=\d+x\d+/, '?size=200x200');
              break;
            }
          }
        }
        
        // 방법 4: innerHTML에서 직접 정규식으로 추출
        if (!image) {
          const itemHTML = item.innerHTML;
          const imageMatch = itemHTML.match(/https:\/\/img\.hwahae\.co\.kr\/products\/\d+\/\d+_\d+\.jpg/);
          if (imageMatch) {
            image = imageMatch[0] + '?size=200x200';
          }
        }
        
        // 랭킹 순서대로 배열에 추가 (인덱스가 랭킹-1)
        const itemData = { image, rankChange };
        
        if (image) {
          images[index] = itemData;
          console.log(`✓ 데이터 추출 성공 ${index + 1}위: ${brand} - ${name} -> 이미지: ${image}, 변동: ${rankChange ? `${rankChange.type}(${rankChange.value})` : 'null'}`);
        } else {
          images[index] = itemData; // 변동 정보라도 저장
          console.log(`✗ 이미지 추출 실패 ${index + 1}위: ${brand} - ${name}, 변동: ${rankChange ? `${rankChange.type}(${rankChange.value})` : 'null'}`);
        }
        
      } catch (error) {
        console.error(`한국어 사이트 아이템 ${index} 처리 중 오류:`, error);
      }
    });

    console.log(`한국어 사이트에서 총 ${images.filter(item => item && item.image).length}개 이미지 추출`);

    return images;
  });

  await page.close();
  return imageData;
}

// 영어 사이트 데이터와 한국어 사이트 데이터 병합 (랭킹 기반)
function mergeData(englishData, koreanData) {
  return englishData.map((item, index) => {
    // 랭킹 순서로 매칭 (index = rank - 1)
    const koreanItem = koreanData[index] || {};
    const image = koreanItem.image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(item.name)}`;
    
    // 한국어 사이트에서 랭킹 변동 정보가 있으면 우선 사용, 없으면 영어 사이트 것 사용
    const rankChange = koreanItem.rankChange || item.rankChange;
    
    return {
      ...item,
      image,
      rankChange
    };
  });
}