"use client";

import React, { useState, useEffect, useRef } from "react";
import { customerRanking } from "../../data/customer-ranking";

const CustomerRankingSection = ({ onOpenBeautyFilter }) => {
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

  // 랭킹 배지 렌더링 (1-3등만 메달, 4등 이하는 숫자)
  const renderRankBadge = (rank) => {
    if (rank === 1) {
      // 1등: 금메달
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="37" fill="none" viewBox="0 0 30 36" className="mb-2">
          <path fill="#FFD700" d="m23.34 10.75-8 2.94c-.22.08-.47.08-.69 0l-7.99-2.94c-.39-.14-.66-.52-.66-.94V4.75c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v5.06c0 .42-.26.79-.66.94"/>
          <path fill="#FFA500" d="M15 32.25c6.351 0 11.5-5.149 11.5-11.5S21.351 9.25 15 9.25 3.5 14.399 3.5 20.75s5.149 11.5 11.5 11.5"/>
          <path fill="#FF961E" d="m15.34 13.68 6.3-2.31a11.464 11.464 0 0 0-13.28 0l6.3 2.31c.22.08.47.08.69 0z"/>
          <text x="15" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{rank}</text>
        </svg>
      );
    } else if (rank === 2) {
      // 2등: 은메달
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="37" fill="none" viewBox="0 0 30 36" className="mb-2">
          <path fill="#C0C0C0" d="m23.34 10.75-8 2.94c-.22.08-.47.08-.69 0l-7.99-2.94c-.39-.14-.66-.52-.66-.94V4.75c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v5.06c0 .42-.26.79-.66.94"/>
          <path fill="#E6E6E6" d="M15 32.25c6.351 0 11.5-5.149 11.5-11.5S21.351 9.25 15 9.25 3.5 14.399 3.5 20.75s5.149 11.5 11.5 11.5"/>
          <path fill="#A8A8A8" d="m15.34 13.68 6.3-2.31a11.464 11.464 0 0 0-13.28 0l6.3 2.31c.22.08.47.08.69 0z"/>
          <text x="15" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{rank}</text>
        </svg>
      );
    } else if (rank === 3) {
      // 3등: 동메달
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="37" fill="none" viewBox="0 0 30 36" className="mb-2">
          <path fill="#CD7F32" d="m23.34 10.75-8 2.94c-.22.08-.47.08-.69 0l-7.99-2.94c-.39-.14-.66-.52-.66-.94V4.75c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v5.06c0 .42-.26.79-.66.94"/>
          <path fill="#D2B48C" d="M15 32.25c6.351 0 11.5-5.149 11.5-11.5S21.351 9.25 15 9.25 3.5 14.399 3.5 20.75s5.149 11.5 11.5 11.5"/>
          <path fill="#B8860B" d="m15.34 13.68 6.3-2.31a11.464 11.464 0 0 0-13.28 0l6.3 2.31c.22.08.47.08.69 0z"/>
          <text x="15" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{rank}</text>
        </svg>
      );
    } else {
      // 4등 이하: 숫자만
      return (
        <div className="text-[18px] font-semibold text-label-common_5">
          {rank}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col mt-[24px] tablet:mt-[32px] desktop:mt-[40px]">
      {/* 섹션 헤더 */}
      <div className="h-[56px] w-full flex justify-start items-center gap-[8px] undefined">
        <h3 className="text-label-common_5 flex items-center gap-[4px] leading-[150%] text-inherit text-lg font-semibold">
          고객들이 직접&nbsp;
          <span className="text-lg font-semibold text-label-plasticSurgery_2">선택한 랭킹</span>
        </h3>
        <button className="flex ml-auto items-center gap-[8px]">
          <h5 className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-semibold">전체보기</h5>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-label-common_4">
            <path fill="currentColor" d="M8.26 4.192a.808.808 0 0 1 1.107.057l6.166 6.583a1.695 1.695 0 0 1 0 2.336l-6.166 6.583a.808.808 0 0 1-1.106.057.728.728 0 0 1-.06-1.059l6.165-6.582a.242.242 0 0 0 0-.334L8.2 5.251a.728.728 0 0 1 .06-1.06Z"></path>
          </svg>
        </button>
      </div>

      {/* 카테고리 필터 - 후기페이지 뷰티고민 필터와 동일한 디자인 */}
      <div className="tablet:mx-[-24px] mx-[-16px] tablet:px-[24px] px-[16px] tablet:pt-[24px] pt-[20px] tablet:pb-[16px] pb-[12px] z-10">
        <div className="flex items-center gap-[8px]">
          {/* 카테고리 필터 버튼 */}
          <div className="flex flex-none gap-[8px]">
            <button 
              className="text-label-common_5 border-outline-common_2 h-[32px] px-[8px] inline-flex items-center gap-[2.5px] bg-background-common_1 border-[1.5px] rounded-lg"
              type="button"
              onClick={onOpenBeautyFilter}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                <path 
                  fill="currentColor" 
                  fillRule="evenodd" 
                  d="M15.333 8A7.333 7.333 0 0 1 3.961 14.12l-2.624.373a.376.376 0 0 1-.42-.454l.59-2.627A7.333 7.333 0 1 1 15.333 8m-6.67.917c-.088.393-.317.621-.733.621-.498 0-.79-.34-.79-.82v-.082c0-.691.357-1.148 1.048-1.553.756-.45.985-.744.985-1.283 0-.574-.446-.973-1.09-.973-.575 0-.961.282-1.149.803-.146.375-.41.54-.767.54-.463 0-.75-.288-.75-.733 0-.252.058-.475.175-.697.375-.774 1.313-1.272 2.573-1.272 1.664 0 2.783.914 2.783 2.28 0 .884-.428 1.488-1.254 1.974-.78.451-.955.703-1.031 1.195m.24 2.309c0 .515-.428.92-.961.92-.527 0-.955-.405-.955-.92 0-.516.428-.92.955-.92.533 0 .961.404.961.92" 
                  clipRule="evenodd"
                />
              </svg>
              <span className="leading-[150%] text-inherit text-sm font-semibold">카테고리 전체</span>
            </button>
          </div>
        </div>
      </div>

      {/* 제품 리스트 (3위씩 3열 배치) */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide tablet:mx-[-24px] mx-[-16px] tablet:px-[24px] px-[16px]"
      >
        <ol className="flex flex-col flex-wrap h-[258px] gap-x-[16px]">
          {customerRanking.slice(0, 9).map((item, index) => (
            <li key={item.id} className="bg-white w-[320px] first:ml-0 h-[86px]">
              <a className="flex items-center py-[8px] h-full" href={item.link}>
                {/* 랭킹 배지 */}
                <div className="flex-shrink-0 space-y-[4px]">
                  <div className="flex items-center text-[18px] shrink-0 w-[30px] flex-col mr-[4px] leading-[15px] h-[72px] justify-center">
                    {renderRankBadge(item.rank)}
                  </div>
                </div>

                {/* 제품 이미지 */}
                <div className="flex-shrink-0">
                  <div className="relative overflow-hidden rounded-[8px] bg-white w-[80px] h-[80px]">
                    <img 
                      className="touch-action-none pointer-events-none h-auto w-full align-top transition-opacity duration-75 opacity-100 absolute left-0 top-0 h-full w-full object-contain scale-[0.8]"
                      alt="제품 이미지"
                      src={item.image}
                      style={{ clipPath: 'inherit' }}
                    />
                  </div>
                </div>

                {/* 제품 정보 */}
                <div className="space-y-[4px] ml-[12px] flex-1">
                  <div>
                    <div className="leading-normal text-ellipsis block line-clamp-2">
                      <span className="text-[14px] text-label-common_4 font-medium">
                        {item.brand}
                      </span>
                      <span className="text-[14px] text-label-common_5 font-medium ml-[8px]">
                        {item.name}
                      </span>
                    </div>
                    
                    {/* 별점 및 리뷰 수 */}
                    <div className="flex items-center gap-[2px] mt-[4px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" className="text-yellow-400">
                        <path fill="currentColor" d="M17.712 21.992c-.12 0-.25-.03-.36-.09l-5.347-2.958-5.347 2.959a.75.75 0 0 1-.79-.04.761.761 0 0 1-.31-.74l1.03-6.328-4.378-4.478c-.2-.2-.26-.5-.17-.76.09-.27.32-.46.6-.5l5.997-.92L11.315 2.4c.25-.53 1.11-.53 1.36 0l2.688 5.738 5.997.92c.28.04.51.24.6.5.09.269.02.559-.17.759l-4.358 4.478 1.03 6.328a.76.76 0 0 1-.74.88z"></path>
                      </svg>
                      <span className="text-[12px] text-label-common_4">
                        {item.rating}
                      </span>
                      <span className="text-[11px] text-label-common_3">
                        ({item.reviewCount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ol>
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
          onClick={() => window.location.href = '/rankings'}
        >
          카테고리 전체보기
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="ml-[8px]">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

    </div>
  );
};

export default CustomerRankingSection;

