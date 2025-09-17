"use client";

import React from "react";
import { trendingRanking } from "../../data/trending-ranking";

const TrendingRankingSection = () => {
  // 현재 날짜 가져오기
  const getCurrentDate = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const day = days[now.getDay()];
    return `${month}월 ${date}일 ${day}`;
  };

  // 랭킹 변동 아이콘 렌더링
  const renderRankChange = (rankChange) => {
    if (!rankChange) return null;
    
    const isUp = rankChange.type === 'up';
    const color = isUp ? 'text-red-500' : 'text-blue-600';
    
    return (
      <span className={`flex items-center justify-start ${color} text-[10px] font-medium leading-[10px] mt-1`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" className={color}>
          <path 
            fill="currentColor" 
            d={isUp 
              ? "M9.279 15c-1.02 0-1.628-1.028-1.062-1.795l2.72-3.69c.506-.686 1.62-.686 2.125 0l2.721 3.69c.566.767-.042 1.795-1.062 1.795z"
              : "M14.721 9c1.02 0 1.628 1.028 1.062 1.795l-2.72 3.69c-.506.686-1.62.686-2.125 0l-2.721-3.69C7.65 10.028 8.259 9 9.279 9z"
            }
          />
        </svg>
        {rankChange.value}
      </span>
    );
  };



  return (
    <div className="flex flex-col">
      {/* 섹션 헤더 - 다른 섹션들과 동일한 구조 */}
      <div className="h-[56px] w-full flex justify-start items-center gap-[8px] undefined">
        <div className="flex flex-col">
          <p className="text-[12px] text-label-common_3 leading-normal mb-[2px]">
            {getCurrentDate()}
          </p>
          <h3 className="text-label-common_5 flex items-center gap-[4px] leading-[150%] text-inherit text-lg font-semibold">
                                    <span className="text-lg font-semibold text-label-plasticSurgery_2">급상승&nbsp;</span>
            랭킹
          </h3>
        </div>
        <button className="flex ml-auto items-center gap-[8px]">
          <h5 className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-semibold">전체보기</h5>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-label-common_4">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      {/* 급상승 랭킹 슬라이더 - 다른 섹션과 동일한 정렬 */}
      <div className="relative py-[20px] tablet:mx-[-24px] mx-[-16px] tablet:px-[24px] px-[16px]">
        <div className="flex overflow-x-scroll scrollbar-hide">
          <div className="flex gap-[12px]">
            {trendingRanking.map((item, index) => (
              <div 
                key={item.id} 
                className="flex-shrink-0 w-[280px]"
              >
                <a 
                  className="block h-[300px] relative overflow-hidden rounded-[16px] border border-outline-common_2 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)] transition-all duration-200 cursor-pointer"
                  href={item.link}
                >
                {/* 랭킹 배지 */}
                <div className="flex items-center text-[18px] shrink-0 w-[30px] flex-col mr-[4px] leading-[15px] h-[72px] justify-start absolute z-[1] top-[16px] left-[16px]">
                  {item.rank === 1 ? (
                    // 1등: 금메달
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="37" fill="none" viewBox="0 0 30 36" className="mb-[2px]">
                      <path fill="#FFD700" d="m23.34 10.75-8 2.94c-.22.08-.47.08-.69 0l-7.99-2.94c-.39-.14-.66-.52-.66-.94V4.75c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v5.06c0 .42-.26.79-.66.94"/>
                      <path fill="#FFA500" d="M15 32.25c6.351 0 11.5-5.149 11.5-11.5S21.351 9.25 15 9.25 3.5 14.399 3.5 20.75s5.149 11.5 11.5 11.5"/>
                      <path fill="#FF8C00" d="m15.34 13.68 6.3-2.31a11.464 11.464 0 0 0-13.28 0l6.3 2.31c.22.08.47.08.69 0z"/>
                      <text x="15" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{item.rank}</text>
                    </svg>
                  ) : item.rank === 2 ? (
                    // 2등: 은메달
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="37" fill="none" viewBox="0 0 30 36" className="mb-[2px]">
                      <path fill="#C0C0C0" d="m23.34 10.75-8 2.94c-.22.08-.47.08-.69 0l-7.99-2.94c-.39-.14-.66-.52-.66-.94V4.75c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v5.06c0 .42-.26.79-.66.94"/>
                      <path fill="#E6E6E6" d="M15 32.25c6.351 0 11.5-5.149 11.5-11.5S21.351 9.25 15 9.25 3.5 14.399 3.5 20.75s5.149 11.5 11.5 11.5"/>
                      <path fill="#A8A8A8" d="m15.34 13.68 6.3-2.31a11.464 11.464 0 0 0-13.28 0l6.3 2.31c.22.08.47.08.69 0z"/>
                      <text x="15" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{item.rank}</text>
                    </svg>
                  ) : item.rank === 3 ? (
                    // 3등: 동메달
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="37" fill="none" viewBox="0 0 30 36" className="mb-[2px]">
                      <path fill="#CD7F32" d="m23.34 10.75-8 2.94c-.22.08-.47.08-.69 0l-7.99-2.94c-.39-.14-.66-.52-.66-.94V4.75c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v5.06c0 .42-.26.79-.66.94"/>
                      <path fill="#D2B48C" d="M15 32.25c6.351 0 11.5-5.149 11.5-11.5S21.351 9.25 15 9.25 3.5 14.399 3.5 20.75s5.149 11.5 11.5 11.5"/>
                      <path fill="#B8860B" d="m15.34 13.68 6.3-2.31a11.464 11.464 0 0 0-13.28 0l6.3 2.31c.22.08.47.08.69 0z"/>
                      <text x="15" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{item.rank}</text>
                    </svg>
                  ) : (
                    // 4등 이하: 숫자만 표시 (메달과 완전히 동일한 크기)
                    <div className="flex items-center justify-center w-[30px] h-[37px] mb-[2px] bg-transparent">
                      <span className="text-[18px] font-semibold text-label-common_5">
                        {item.rank}
                      </span>
                    </div>
                  )}
                  <div className="h-[20px] flex items-center justify-center">
                    {renderRankChange(item.rankChange)}
                  </div>
                </div>

                {/* 제품 이미지 - 화해와 동일한 구조 */}
                <div className="relative w-full pt-[300px]">
                  <picture className="m-0 p-0">
                    <img 
                      className="touch-action-none pointer-events-none h-auto w-full align-top transition-opacity duration-75 opacity-100 absolute left-0 top-0 h-full w-full object-contain object-center"
                      alt="제품 이미지"
                      src={item.image}
                      style={{ clipPath: 'inherit' }}
                    />
                  </picture>
                </div>

                {/* 하단 정보 영역 - 화해와 동일한 글라스모피즘 */}
                <div className="absolute z-[10] bottom-0 w-full py-[20px] pl-[24px] pr-[100px] pointer-events-none rounded-b-[16px]">
                  {/* 글라스모피즘 배경 */}
                  <div className="absolute left-0 right-0 bottom-0 h-[120px] backdrop-blur-[3px] bg-gradient-to-b from-white/0 from-0% via-white/70 via-50% to-white/10 to-100%"/>
                  
                  {/* 제품 정보 */}
                  <div className="relative will-change-transform">
                    <span className="text-[13px] text-label-common_4 font-medium">
                      {item.brand}
                    </span>
                    <span className="text-[18px] font-semibold line-clamp-2 mt-[8px] text-label-common_5 break-all block">
                      {item.name}
                    </span>
                    <div className="flex mt-[8px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" color="#FFAA3C" className="mt-[3px]">
                        <path fill="currentColor" d="M17.712 21.992c-.12 0-.25-.03-.36-.09l-5.347-2.958-5.347 2.959a.75.75 0 0 1-.79-.04.761.761 0 0 1-.31-.74l1.03-6.328-4.378-4.478c-.2-.2-.26-.5-.17-.76.09-.27.32-.46.6-.5l5.997-.92L11.315 2.4c.25-.53 1.11-.53 1.36 0l2.688 5.738 5.997.92c.28.04.51.24.6.5.09.269.02.559-.17.759l-4.358 4.478 1.03 6.328a.76.76 0 0 1-.74.88z"></path>
                      </svg>
                      <span className="text-[13px] text-label-common_4 ml-[2px]">
                        {item.rating}
                      </span>
                      <span className="text-[12px] text-label-common_3 ml-[2px]">
                        ({item.reviewCount > 1000 ? `${Math.floor(item.reviewCount/1000).toLocaleString()}` : item.reviewCount})
                      </span>
                    </div>
                  </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingRankingSection;
