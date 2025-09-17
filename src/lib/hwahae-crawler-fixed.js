// 영어 사이트 크롤링 (완전 재작성)

export async function crawlHwahaeRealData(category = 'trending', themeId = '5102') {
  if (typeof window !== 'undefined') {
    throw new Error('이 함수는 서버사이드에서만 실행 가능합니다.');
  }

  try {
    const puppeteer = await import('puppeteer');
    
    // 영어 사이트 사용 (가격/용량 정보 포함)
    const targetUrl = `https://www.hwahae.com/en/rankings?theme_id=${themeId}`;
    console.log(`🔄 영어 사이트 크롤링 시작: ${targetUrl}`);

    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // SPA 로딩 대기 (이미지 로딩을 위해 더 오래)
    console.log('📄 SPA 앱 및 이미지 로딩 대기...');
    await new Promise(resolve => setTimeout(resolve, 15000));

    // 스크롤하여 더 많은 데이터 로드
    console.log('📜 무한 스크롤 시작...');
    let totalScrolled = 0;
    const maxScrolls = 5;
    
    while (totalScrolled < maxScrolls) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 3000));
      totalScrolled++;
      console.log(`📜 스크롤 ${totalScrolled}/${maxScrolls} 완료`);
    }
    
    // 이미지 로딩 강제 트리거 (Intersection Observer 방식)
    console.log('🖼️ 각 이미지를 개별적으로 뷰포트에 노출시켜 로딩 트리거...');
    
    // 각 이미지를 개별적으로 뷰포트에 노출 (동기 방식으로 변경)
    const listItemCount = await page.evaluate(() => {
      return document.querySelectorAll('ul.overflow-auto li').length;
    });
    
    console.log(`🖼️ ${Math.min(listItemCount, 50)}개 아이템의 이미지를 순차적으로 로딩...`);
    
    for (let i = 0; i < Math.min(listItemCount, 50); i++) {
      await page.evaluate((index) => {
        const listItems = document.querySelectorAll('ul.overflow-auto li');
        const item = listItems[index];
        if (item) {
          // 뷰포트로 스크롤
          item.scrollIntoView({ block: 'center', behavior: 'auto' });
          
          // 이미지 강제 로딩
          const images = item.querySelectorAll('img');
          images.forEach(img => {
            if (img.loading) img.loading = 'eager';
            if (img.getAttribute('status') === 'idle') {
              img.setAttribute('status', 'loading');
            }
          });
        }
      }, i);
      
      // 각 아이템마다 로딩 대기
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if ((i + 1) % 10 === 0) {
        console.log(`🖼️ ${i + 1}개 아이템 이미지 로딩 완료`);
      }
    }
    
    // 최종 이미지 로딩 완료 대기
    console.log('🖼️ 최종 이미지 로딩 완료 대기...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 최종 데이터 추출 (텍스트 기반 파싱)
    const rankings = await page.evaluate(() => {
      const items = [];
      const listItems = document.querySelectorAll('ul.overflow-auto li');
      
      console.log(`🔍 총 ${listItems.length}개 li 요소 발견`);

      listItems.forEach((item, index) => {
        try {
          // 제품 링크 확인
          const link = item.querySelector('a[href*="/products/"]');
          if (!link) return;

          const text = item.textContent || '';
          const href = link.getAttribute('href');
          
          // 순위 추출 (인덱스 기반으로 안정적 할당)
          let rank = index + 1;
          
          // 텍스트에서 순위 찾기 시도
          const rankMatch = text.match(/^(\d+)/);
          if (rankMatch) {
            const extractedRank = parseInt(rankMatch[1]);
            // 1-50 범위 내에서만 사용
            if (extractedRank >= 1 && extractedRank <= 50) {
              rank = extractedRank;
            }
          } else if (text.startsWith('NEW')) {
            // NEW 다음 숫자 확인
            const afterNew = text.substring(3);
            const rankAfterNew = afterNew.match(/^(\d+)/);
            if (rankAfterNew) {
              const extractedRank = parseInt(rankAfterNew[1]);
              if (extractedRank >= 1 && extractedRank <= 50) {
                rank = extractedRank;
              }
            }
          }
          
          // 안전장치: 50 초과시 인덱스 기반으로 할당
          if (rank > 50) {
            rank = index + 1;
          }

          // 브랜드와 제품명 추출 (HTML 요소 기반으로 정확하게)
          let brand = '';
          let name = '';
          
          // HTML 요소에서 직접 추출
          const brandElement = item.querySelector('span.hds-text-body-medium.hds-text-gray-tertiary');
          const nameElement = item.querySelector('span.hds-text-body-medium.hds-text-gray-primary');
          
          if (brandElement && nameElement) {
            brand = brandElement.textContent.trim();
            name = nameElement.textContent.trim();
          } else {
            // 백업: 텍스트 파싱
            let cleanText = text.replace(/^NEW/, '').replace(/^\d+/, '');
            const ratingIndex = cleanText.search(/\d\.\d/);
            if (ratingIndex > 0) {
              const brandNamePart = cleanText.substring(0, ratingIndex);
              
              // 개선된 브랜드/제품명 분리 로직
              // 패턴: BrandName + ProductName (대문자로 구분)
              const match = brandNamePart.match(/^([A-Za-z0-9.&-]+)([A-Z][A-Za-z0-9\s\-™®&.()]+)/);
              if (match) {
                brand = match[1].trim();
                name = match[2].trim();
              } else {
                // 공백으로 구분
                const parts = brandNamePart.trim().split(/\s+/);
                if (parts.length >= 2) {
                  brand = parts[0];
                  name = parts.slice(1).join(' ');
                } else {
                  brand = parts[0] || 'Unknown';
                  name = parts[0] || 'Unknown Product';
                }
              }
            }
          }

          // 별점 추출
          let rating = 0;
          const ratingMatch = text.match(/(\d\.\d+)/);
          if (ratingMatch) {
            rating = parseFloat(ratingMatch[1]);
          }

          // 리뷰 수 추출 (개선된 로직)
          let reviewCount = 0;
          
          // 방법 1: HTML 요소에서 직접 추출
          const reviewElement = item.querySelector('span[class*="before:hds-content"]');
          if (reviewElement) {
            const reviewText = reviewElement.textContent.trim();
            const reviewNum = parseInt(reviewText.replace(/,/g, ''));
            if (!isNaN(reviewNum)) {
              reviewCount = reviewNum;
            }
          }
          
          // 방법 2: 텍스트 패턴 매칭 (별점 다음에 오는 숫자)
          if (reviewCount === 0) {
            // 패턴: 4.66 다음에 오는 숫자 (1,189 형태)
            const reviewMatch = text.match(/\d\.\d+([,\d]+)/);
            if (reviewMatch) {
              const numberStr = reviewMatch[1].replace(/,/g, '');
              const num = parseInt(numberStr);
              if (!isNaN(num) && num > 0) {
                reviewCount = num;
              }
            }
          }
          
          // 방법 3: 괄호 안의 숫자나 쉼표가 포함된 숫자 찾기
          if (reviewCount === 0) {
            const allNumbers = text.match(/[\d,]+/g);
            if (allNumbers) {
              // 가장 큰 숫자를 리뷰 수로 간주 (일반적으로 리뷰 수가 가장 큼)
              allNumbers.forEach(numStr => {
                const num = parseInt(numStr.replace(/,/g, ''));
                if (!isNaN(num) && num > reviewCount && num < 1000000) { // 100만 이하
                  reviewCount = num;
                }
              });
            }
          }

          // 가격 추출 (달러)
          let price = '';
          const priceMatch = text.match(/\$(\d+\.?\d*)/);
          if (priceMatch) {
            price = `$${priceMatch[1]}`;
          }

          // 용량 추출
          let volume = '';
          const volumeMatch = text.match(/\/([\d.]+\s*[a-zA-Z]+)/);
          if (volumeMatch) {
            volume = volumeMatch[1].trim();
          }

          // 이미지 추출 (더 강화된 방법)
          let image = '';
          
          // 방법 1: 상태가 "loaded"인 이미지 우선 추출
          const loadedImages = item.querySelectorAll('img[status="loaded"]');
          loadedImages.forEach(img => {
            if (img.src && img.src.includes('hwahae.co.kr') && !image) {
              image = img.src.replace('?size=240x240', '?size=200x200');
            }
          });
          
          // 방법 1-2: 모든 img 태그 확인 (로딩 상태 무관)
          if (!image) {
            const allImages = item.querySelectorAll('img');
            allImages.forEach(img => {
              if (img.src && img.src.includes('hwahae.co.kr') && !img.src.includes('data:') && !image) {
                image = img.src.replace('?size=240x240', '?size=200x200');
              }
            });
          }
          
          // 방법 2: srcset에서 추출
          if (!image) {
            const sources = item.querySelectorAll('source[srcset]');
            sources.forEach(source => {
              const srcset = source.getAttribute('srcset');
              if (srcset && srcset.includes('hwahae.co.kr') && !image) {
                const urlMatch = srcset.match(/(https:\/\/img\.hwahae\.co\.kr[^\s]+)/);
                if (urlMatch) {
                  image = urlMatch[1].replace('?format=webp&size=240x240', '?size=200x200');
                }
              }
            });
          }
          
          // 방법 3: picture 요소 내부 확인
          if (!image) {
            const picture = item.querySelector('picture');
            if (picture) {
              const imgs = picture.querySelectorAll('img');
              imgs.forEach(img => {
                if (img.src && img.src.includes('hwahae.co.kr') && !image) {
                  image = img.src.replace('?size=240x240', '?size=200x200');
                }
              });
            }
          }
          
          // 방법 4: innerHTML에서 이미지 URL 직접 추출 (모든 패턴 시도)
          if (!image) {
            const innerHTML = item.innerHTML || '';
            
            // 다양한 이미지 URL 패턴 시도
            const patterns = [
              /https:\/\/img\.hwahae\.co\.kr\/products\/\d+\/\d+_\d+\.jpg[^"'\s]*/,
              /https:\/\/img\.hwahae\.co\.kr\/products\/[^"'\s]+/,
              /"(https:\/\/img\.hwahae\.co\.kr[^"]+)"/,
              /src="([^"]*hwahae\.co\.kr[^"]*)"/
            ];
            
            for (const pattern of patterns) {
              const match = innerHTML.match(pattern);
              if (match) {
                image = match[1] || match[0];
                if (image.includes('?format=webp')) {
                  image = image.replace('?format=webp&size=240x240', '?size=200x200');
                } else {
                  image = image.replace('?size=240x240', '?size=200x200');
                }
                break;
              }
            }
          }
          
          // 방법 5: 제품 ID로 다양한 이미지 URL 패턴 시도
          if (!image) {
            const productIdMatch = href.match(/\/(\d+)$/);
            if (productIdMatch) {
              const productId = productIdMatch[1];
              
              // 알려진 다양한 날짜 패턴들 시도
              const datePatterns = [
                '20240723160851', // 디버깅에서 확인된 패턴
                '20241107111647', // 2위 제품 패턴
                '20250225174010', // 3위 제품 패턴
                '20250221173047', // 4위 제품 패턴
                '20240426113159', // 5위 제품 패턴
                '20250822104108', // 6위 제품 패턴
                '20231114110247', // 7위 제품 패턴
                '20220801000000'  // 기본 패턴
              ];
              
              // 각 제품의 실제 이미지 URL을 HTML에서 찾기 시도
              const itemHTML = item.innerHTML;
              const realImageMatch = itemHTML.match(new RegExp(`https://img\\.hwahae\\.co\\.kr/products/${productId}/${productId}_\\d+\\.jpg`));
              
              if (realImageMatch) {
                image = realImageMatch[0] + '?size=200x200';
              } else {
                // 백업: 기본 패턴 사용
                image = `https://img.hwahae.co.kr/products/${productId}/${productId}_${datePatterns[0]}.jpg?size=200x200`;
              }
            }
          }

          // 변동 정보 (NEW 체크)
          let rankChange = null;
          if (text.includes('NEW')) {
            rankChange = { type: 'new', value: null };
          }

          // 이미지 디버깅 강화 (처음 3개만)
          if (index < 3) {
            const allImgElements = item.querySelectorAll('img');
            const allSources = item.querySelectorAll('source');
            const imgDebugInfo = {
              images: Array.from(allImgElements).map(img => ({
                src: img.src,
                alt: img.alt,
                status: img.getAttribute('status'),
                hasHwahae: img.src.includes('hwahae.co.kr')
              })),
              sources: Array.from(allSources).map(source => ({
                srcset: source.getAttribute('srcset'),
                type: source.getAttribute('type'),
                hasHwahae: source.getAttribute('srcset')?.includes('hwahae.co.kr')
              })),
              innerHTML: item.innerHTML.substring(0, 500)
            };
            console.log(`🖼️ 아이템 ${rank} 상세 디버깅:`, imgDebugInfo);
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
              link: `https://www.hwahae.com${href}`,
              price,
              volume
            });
            
            console.log(`✅ ${rank}위: ${brand} - ${name} (${price}, ${volume}) [이미지: ${image ? '✅' : '❌'}]`);
          }
          
        } catch (error) {
          console.error(`❌ 아이템 ${index + 1} 파싱 오류:`, error);
        }
      });

      return items.sort((a, b) => a.rank - b.rank);
    });

    await browser.close();

    console.log(`✅ 크롤링 완료: ${rankings.length}개 아이템 수집`);
    return rankings;

  } catch (error) {
    console.error('❌ 크롤링 오류:', error);
    throw error;
  }
}
