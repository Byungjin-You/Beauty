// 실제 화해 사이트 크롤링 (서버사이드 전용)

export async function crawlHwahaeRealData(category = 'trending', themeId = '5102') {
  // 서버 환경에서만 실행
  if (typeof window !== 'undefined') {
    throw new Error('이 함수는 서버사이드에서만 실행 가능합니다.');
  }

  try {
    const puppeteer = await import('puppeteer');
    
    // 영어 사이트 사용 (가격/용량 정보 포함)
    const targetUrl = `https://www.hwahae.com/en/rankings?theme_id=${themeId}`;
    console.log(`🔄 실제 크롤링 시작: ${targetUrl}`);

    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080'
      ]
    });

    const page = await browser.newPage();
    
    // User Agent 설정
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // 뷰포트 설정
    await page.setViewport({ width: 1920, height: 1080 });

    // 페이지 이동
    await page.goto(targetUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // console.log('📄 페이지 로딩 완료, SPA 앱 로딩 대기 중...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 영어 사이트도 무한 스크롤 구조 - 스크롤하여 더 많은 데이터 로드
    let scrollCount = 0;
    const maxScrolls = 10; // 50개 제품 로드를 위해 충분한 스크롤
    
    while (scrollCount < maxScrolls) {
      const currentItemCount = await page.evaluate(() => {
        return document.querySelectorAll('ul.overflow-auto li').length;
      });

      // console.log(`📜 스크롤 ${scrollCount + 1}/${maxScrolls}, 현재 아이템: ${currentItemCount}개`);

      // 페이지 하단으로 여러 번 스크롤 (무한 스크롤 트리거)
      await page.evaluate(() => {
        // 점진적 스크롤
        const scrollStep = document.body.scrollHeight / 3;
        window.scrollTo(0, scrollStep);
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await page.evaluate(() => {
        const scrollStep = document.body.scrollHeight / 2;
        window.scrollTo(0, scrollStep);
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // 새로운 콘텐츠 로딩 대기 (더 오래)
      await new Promise(resolve => setTimeout(resolve, 6000));

      // 새로운 아이템 수 확인
      const newItemCount = await page.evaluate(() => {
        return document.querySelectorAll('ul.overflow-auto li').length;
      });

      // console.log(`📊 스크롤 후 아이템: ${newItemCount}개`);

      // 더 이상 새로운 아이템이 로드되지 않으면 중단
      if (newItemCount === currentItemCount) {
        // console.log(`🛑 더 이상 새로운 아이템이 로드되지 않음 (${newItemCount}개)`);
        break;
      }

      scrollCount++;
    }
    
    // 최종 스크롤 후 이미지 로딩 대기
    // console.log('🖼️ 모든 이미지 로딩 완료 대기 중...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 최종 데이터 추출 (영어 사이트 구조)
    const rankings = await page.evaluate(() => {
      const items = [];
      const itemElements = Array.from(document.querySelectorAll('ul.overflow-auto li'));
      
      // console.log(`🔍 총 ${itemElements.length}개 아이템 파싱 시작`);

      itemElements.forEach((item, index) => {
        try {
          // 제품 링크가 있는 아이템만 처리 (더 포괄적 검사)
          const linkElement = item.querySelector('a[href]');
          if (!linkElement || !linkElement.href.includes('/products/')) {
            return; // 제품이 아닌 아이템 건너뛰기
          }

          // 순위 추출 개선 (더 포괄적 접근)
          let rank = index + 1;
          
          // 방법 1: SVG 메달에서 순위 추출 (1-3위)
          const medalSvg = item.querySelector('svg[aria-label*="등"]');
          if (medalSvg) {
            const ariaLabel = medalSvg.getAttribute('aria-label') || '';
            if (ariaLabel.includes('1등')) rank = 1;
            else if (ariaLabel.includes('2등')) rank = 2;  
            else if (ariaLabel.includes('3등')) rank = 3;
          }
          
          // 방법 2: div 안의 숫자 (4위부터)
          if (rank === index + 1) { // 아직 순위를 찾지 못한 경우
            const rankDivs = item.querySelectorAll('div');
            rankDivs.forEach(div => {
              const text = div.textContent.trim();
              const rankNum = parseInt(text);
              if (!isNaN(rankNum) && rankNum >= 1 && rankNum <= 100 && rank === index + 1) {
                rank = rankNum;
              }
            });
          }
          
          // 방법 3: 순서대로 1부터 할당 (최후 수단)
          if (rank === index + 1) {
            // 실제 제품 순서를 기준으로 순위 재계산
            const validItems = Array.from(document.querySelectorAll('ul.overflow-auto li')).filter(li => 
              li.querySelector('a[href*="/en/products/"]')
            );
            const itemIndex = validItems.indexOf(item);
            if (itemIndex !== -1) {
              rank = itemIndex + 1;
            }
          }

          // 변동 정보 추출
          let rankChange = null;
          
          // NEW 체크
          const newSpan = item.querySelector('span');
          if (newSpan && newSpan.textContent.trim().toLowerCase() === 'new') {
            rankChange = { type: 'new', value: null };
          } else {
            // 상승/하락 화살표 체크
            const redArrow = item.querySelector('svg[class*="text-red-primary"]');
            const blueArrow = item.querySelector('svg[class*="text-blue"]');
            
            if (redArrow) {
              const valueSpan = redArrow.parentElement;
              const value = parseInt(valueSpan.textContent.trim()) || 1;
              rankChange = { type: 'up', value };
            } else if (blueArrow) {
              const valueSpan = blueArrow.parentElement;
              const value = parseInt(valueSpan.textContent.trim()) || 1;
              rankChange = { type: 'down', value };
            }
          }

          // 이미지 추출 (다양한 방법으로 시도)
          let image = '';
          
          // 방법 1: 로딩된 이미지 (src 속성)
          const imageElement = item.querySelector('img[alt][src]');
          if (imageElement && imageElement.src && !imageElement.src.includes('data:')) {
            image = imageElement.src.replace('?size=240x240', '?size=200x200');
          }
          
          // 방법 2: srcset에서 추출
          if (!image) {
            const sourceElement = item.querySelector('source[srcset]');
            if (sourceElement) {
              const srcset = sourceElement.getAttribute('srcset');
              const srcMatch = srcset.match(/(https:\/\/[^\s]+)/);
              if (srcMatch) {
                image = srcMatch[1].replace('?format=webp&size=240x240', '?size=200x200');
              }
            }
          }
          
          // 방법 3: picture > img 조합
          if (!image) {
            const pictureImg = item.querySelector('picture img');
            if (pictureImg && pictureImg.src && !pictureImg.src.includes('data:')) {
              image = pictureImg.src.replace('?size=240x240', '?size=200x200');
            }
          }
          
          // 방법 4: alt 속성에서 제품명 추출해서 이미지 URL 구성
          if (!image) {
            const imgWithAlt = item.querySelector('img[alt]');
            if (imgWithAlt) {
              const alt = imgWithAlt.getAttribute('alt');
              // URL에서 제품 ID 추출 시도
              const productIdMatch = href.match(/\/(\d+)$/);
              if (productIdMatch) {
                const productId = productIdMatch[1];
                image = `https://img.hwahae.co.kr/products/${productId}/${productId}_20240101000000.jpg?size=200x200`;
              }
            }
          }

          // 브랜드명과 제품명 추출
          const brandElement = item.querySelector('span.hds-text-body-medium.hds-text-gray-tertiary');
          const nameElement = item.querySelector('span.hds-text-body-medium.hds-text-gray-primary');
          
          const brand = brandElement ? brandElement.textContent.trim() : '';
          const name = nameElement ? nameElement.textContent.trim() : '';

          // 별점 추출
          const ratingElement = item.querySelector('span.hds-text-body-small.hds-text-gray-secondary');
          let rating = 0;
          if (ratingElement) {
            rating = parseFloat(ratingElement.textContent.trim()) || 0;
          }

          // 리뷰 수 추출
          let reviewCount = 0;
          const reviewElement = item.querySelector('span[class*="before:hds-content"]');
          if (reviewElement) {
            const text = reviewElement.textContent.trim();
            const numberMatch = text.match(/[\d,]+/);
            if (numberMatch) {
              reviewCount = parseInt(numberMatch[0].replace(/,/g, '')) || 0;
            }
          }

          // 제품 링크
          const href = linkElement.getAttribute('href');
          const link = href ? `https://www.hwahae.com${href}` : '';

          // 가격 추출 (영어 사이트 구조 - 정확한 클래스 조합)
          let price = '';
          
          // 정확한 클래스 조합으로 가격 찾기
          const priceElement1 = item.querySelector('span.hds-text-body-large.text-gray-secondary');
          if (priceElement1 && priceElement1.textContent.includes('₩')) {
            price = priceElement1.textContent.trim();
          }
          
          // 대안: !ml-[0] 클래스가 포함된 요소
          if (!price) {
            const priceElements = item.querySelectorAll('span[class*="!ml-[0]"]');
            priceElements.forEach(element => {
              const text = element.textContent.trim();
              if (text.includes('₩')) {
                price = text;
              }
            });
          }
          
          // 가격이 여전히 없으면 모든 span에서 찾기
          if (!price) {
            const allSpans = item.querySelectorAll('span');
            allSpans.forEach(span => {
              const text = span.textContent.trim();
              if (text.match(/^₩[\d,]+$/) && !price) { // 정확히 ₩숫자 형태만
                price = text;
              }
            });
          }
          
          // 그래도 없으면 전체 텍스트에서 찾기
          if (!price) {
            const allText = item.textContent || '';
            const priceMatch = allText.match(/₩([\d,]+)/);
            if (priceMatch) {
              price = `₩${priceMatch[1]}`;
            }
          }

          // 용량 추출 (영어 사이트 구조 - 더 포괄적 선택자)
          let volume = '';
          const volumeElements = item.querySelectorAll('span[class*="hds-text-smalltext-large"], span[class*="text-gray-tertiary"]');
          volumeElements.forEach(element => {
            const text = element.textContent.trim();
            if (text.includes('/') && (text.includes('mL') || text.includes('g') || text.includes('oz')) && !volume) {
              const volumeMatch = text.match(/\/([\d.]+\s*[a-zA-Z]+)/);
              if (volumeMatch) {
                volume = volumeMatch[1].trim();
              }
            }
          });

          // 디버깅: 가격 정보 확인
          if (index < 3) { // 처음 3개만 디버깅 로그
            // console.log(`🔍 아이템 ${rank} 디버깅:`, {
            //   brand,
            //   name,
            //   price,
            //   volume,
            //   allText: item.textContent.substring(0, 200) // 처음 200자만
            // });
          }

          // 유효한 데이터만 추가
          if (brand && name && rating > 0) {
            items.push({
              rank,
              brand,
              name,
              image: image || `https://via.placeholder.com/200x200?text=${encodeURIComponent(name)}`,
              rating,
              reviewCount,
              rankChange,
              link,
              price,
              volume
            });
          }
        } catch (error) {
          // console.error(`❌ 아이템 ${index + 1} 파싱 오류:`, error);
        }
      });

      // 순위별 정렬
      return items.sort((a, b) => a.rank - b.rank);
    });

    await browser.close();

    console.log(`✅ 실제 크롤링 완료: ${rankings.length}개 아이템 수집`);
    
    // 수집된 데이터 샘플 로그 (처음 3개)
    // if (rankings.length > 0) {
    //   console.log('📊 수집된 데이터 샘플:');
    //   rankings.slice(0, 3).forEach(item => {
    //     console.log(`${item.rank}위: ${item.brand} - ${item.name} (${item.price}, ${item.volume})`);
    //   });
    // }

    return rankings;

  } catch (error) {
    console.error('❌ 크롤링 중 오류 발생:', error);
    throw error;
  }
}