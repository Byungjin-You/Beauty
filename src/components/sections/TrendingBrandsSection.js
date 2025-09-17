"use client";

import React, { useState, useEffect, useRef } from "react";
import { trendingBrands } from "../../data/trending-brands";

const TrendingBrandsSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);

  // 스크롤 진행도 계산
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScroll = scrollWidth - clientWidth;
      
      if (maxScroll > 0) {
        const progress = (scrollLeft / maxScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 랭킹 변동 아이콘 렌더링
  const renderRankChange = (rankChange) => {
    if (!rankChange) return null;
    
    if (rankChange.type === 'up') {
      return (
        <span className="flex items-center justify-start text-red-600 text-[12px] leading-[10px] font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-red-600 -mr-4">
            <path fill="currentColor" d="M9.279 15c-1.02 0-1.628-1.028-1.062-1.795l2.72-3.69c.506-.686 1.62-.686 2.125 0l2.721 3.69c.566.767-.042 1.795-1.062 1.795z"/>
          </svg>
          {rankChange.value}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col mt-[24px] tablet:mt-[32px] desktop:mt-[40px]">
      {/* 섹션 헤더 */}
      <div className="h-[56px] w-full flex justify-start items-center gap-[8px] undefined">
        <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">
          요즘 뜨는 브랜드
        </h3>
        <button className="flex ml-auto items-center gap-[8px]">
          <h5 className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-semibold">전체보기</h5>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-label-common_4">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      {/* 브랜드 리스트 컨테이너 - HTML 구조와 정확히 동일 */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide tablet:mx-[-24px] mx-[-16px] tablet:px-[24px] px-[16px]"
      >
        <div className="flex flex-col flex-wrap">
          <ol className="flex flex-row">
            {trendingBrands.map((brand) => (
              <li key={brand.id}>
                {/* 브랜드 헤더 */}
                <div className="flex items-center w-[320px] py-2">
                  {/* 랭킹 번호와 변동 표시 */}
                  <div className="flex items-center text-[18px] shrink-0 w-[30px] flex-col mr-2 leading-[15px] h-[32px] justify-center">
                    <div className="text-[18px] font-semibold text-label-common_5">{brand.rank}</div>
                    {brand.rankChange && (
                      <span className="flex items-center justify-center text-red-600 text-[10px] leading-[10px] mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" className="text-red-600">
                          <path fill="currentColor" d="M9.279 15c-1.02 0-1.628-1.028-1.062-1.795l2.72-3.69c.506-.686 1.62-.686 2.125 0l2.721 3.69c.566.767-.042 1.795-1.062 1.795z"/>
                        </svg>
                        <span className="ml-[2px]">{brand.rankChange.value}</span>
                      </span>
                    )}
                  </div>
                  
                  {/* 브랜드 로고 */}
                  <span className="ml-2 isolate">
                    <div className="relative w-[32px] h-[32px] rounded-full overflow-hidden bg-white border border-outline-common_2 flex items-center justify-center">
                      <picture className="m-0 p-0">
                        <img 
                          className="w-[24px] h-[24px] object-contain"
                          width="24" 
                          height="24" 
                          alt={brand.brandName}
                          src={brand.brandImage}
                        />
                      </picture>
                    </div>
                  </span>
                  
                  {/* 브랜드 이름 */}
                  <div className="ml-4">
                    <span className="text-[16px] font-semibold text-label-common_5">
                      {brand.brandName}
                    </span>
                  </div>
                </div>
                
                {/* 브랜드 제품 리스트 */}
                <ul>
                  {brand.products.map((product) => (
                    <li key={product.id} className="bg-white w-[320px]">
                      <a className="flex items-center" href={product.link}>
                        {/* 제품 이미지 */}
                        <div className="flex-shrink-0">
                          <div className="relative overflow-hidden rounded-[8px] bg-white w-[96px] pt-[96px]">
                            <picture className="m-0 p-0">
                              <img 
                                className="touch-action-none pointer-events-none h-auto w-full align-top transition-opacity duration-75 opacity-100 absolute left-0 top-0 h-full w-full scale-[0.8] object-contain"
                                width="1" 
                                height="1" 
                                alt="thumbnail" 
                                src={product.image}
                                style={{ clipPath: 'inherit' }}
                              />
                            </picture>
                          </div>
                        </div>
                        
                        {/* 제품 정보 */}
                        <div className="space-y-4 ml-6">
                          <div>
                            <div className="leading-normal text-ellipsis space-x-2 block" style={{overflow:'hidden',display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:2}}>
                              <span className="text-[14px] text-label-common_4">{product.brand}</span>
                              <span className="text-[14px] text-label-common_5">{product.name}</span>
                            </div>
                            <div className="flex items-center gap-[2px] mt-[4px]">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" className="text-yellow-400">
                                <path fill="currentColor" d="M17.712 21.992c-.12 0-.25-.03-.36-.09l-5.347-2.958-5.347 2.959a.75.75 0 0 1-.79-.04.761.761 0 0 1-.31-.74l1.03-6.328-4.378-4.478c-.2-.2-.26-.5-.17-.76.09-.27.32-.46.6-.5l5.997-.92L11.315 2.4c.25-.53 1.11-.53 1.36 0l2.688 5.738 5.997.92c.28.04.51.24.6.5.09.269.02.559-.17.759l-4.358 4.478 1.03 6.328a.76.76 0 0 1-.74.88z"/>
                              </svg>
                              <span className="text-[12px] text-label-common_4">
                                {product.rating.toFixed(2)}
                              </span>
                              <span className="text-[11px] text-label-common_3">
                                ({product.reviewCount.toLocaleString()})
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="flex justify-center py-[8px]">
        <div className="h-[4px] w-[32px] rounded-[4px] bg-container-common_2">
          <div className="relative h-[4px] w-[32px]">
            <div 
              className="absolute h-[4px] w-[15px] rounded-[4px] bg-label-common_5 transition-all duration-300" 
              style={{
                left: `${(scrollProgress / 100) * 17}px`
              }}
            />
          </div>
        </div>
      </div>

      {/* 전체보기 버튼 */}
      <div className="tablet:mx-[-24px] mx-[-16px] tablet:px-[24px] px-[16px] mt-[16px]">
        <button 
          className="inline-flex justify-center items-center appearance-none px-[16px] h-[44px] rounded-[8px] text-[14px] font-medium border border-outline-common_2 bg-white hover:bg-container-common_2 active:bg-container-common_2 text-label-common_5 w-full transition-colors duration-200"
          onClick={() => window.location.href = '/rankings?type=brand'}
        >
          브랜드 전체보기
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="ml-[8px]">
            <path fill="currentColor" d="M8.26 4.192a.808.808 0 0 1 1.107.057l6.166 6.583a1.695 1.695 0 0 1 0 2.336l-6.166 6.583a.808.808 0 0 1-1.106.057.728.728 0 0 1-.06-1.059l6.165-6.582a.242.242 0 0 0 0-.334L8.2 5.251a.728.728 0 0 1 .06-1.06Z"/>
          </svg>
        </button>
      </div>

    </div>
  );
};

export default TrendingBrandsSection;