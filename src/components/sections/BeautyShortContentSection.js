"use client";

import React, { useState, useEffect } from "react";

const BeautyShortContentSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // 샘플 데이터
  const contents = [
    {
      id: 1,
      rank: 1,
      brand: "AESTURA",
      name: "ATOBARRIER365 CREAM",
      rating: 4.68,
      reviewCount: "13,640",
      description: "Rich, ceramide-based cream excels at hydration and barrier repair. Best for dry/sensitive skin in cold weather, can be heavy for oily types.",
      image: "https://img.hwahae.co.kr/products/2078467/2078467_20231121171749.jpg?size=80x80",
      link: "/products/2078467"
    },
    {
      id: 2,
      rank: 2,
      brand: "Anua",
      name: "PDRN HYALURONIC ACID CAPSULE 100 SERUM",
      rating: 4.62,
      reviewCount: "9,811",
      description: "Fast-absorbing hyaluronic acid serum provides deep hydration and natural glow, works under makeup, but runny texture needs careful application.",
      image: "https://img.hwahae.co.kr/products/2113285/2113285_20250225174010.jpg?size=80x80",
      link: "/products/2113285"
    },
    {
      id: 3,
      rank: 3,
      brand: "beplain",
      name: "MUNG BEAN pH-BALANCED CLEANSING FOAM",
      rating: 4.62,
      reviewCount: "45,113",
      description: "Gentle yet effective low-pH cleanser with mung bean exfoliants - great for sensitive skin but may need double cleansing for makeup removal",
      image: "https://img.hwahae.co.kr/products/1918760/1918760_20230628115919.jpg?size=80x80",
      link: "/products/1918760"
    }
  ];

  // 자동 롤링
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % contents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [contents.length]);

  // 각 아이템의 높이 (카드 66px + 설명 영역 약 112px + 간격 12px)
  const CARD_HEIGHT = 66;
  const EXPANDED_HEIGHT = 112;
  const GAP = 12;

  return (
    <div className="flex flex-col">
      {/* 섹션 헤더 */}
      <a href="/ranking" className="block">
        <div className="h-[56px] w-full flex justify-between items-center">
          <h3 className="text-label-common_5 leading-[150%] text-lg font-semibold">
            Beauty Content to Watch Together
          </h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-label-common_4">
            <path fill="currentColor" d="M8.26 4.192a.808.808 0 0 1 1.107.057l6.166 6.583a1.695 1.695 0 0 1 0 2.336l-6.166 6.583a.808.808 0 0 1-1.106.057.728.728 0 0 1-.06-1.059l6.165-6.582a.242.242 0 0 0 0-.334L8.2 5.251a.728.728 0 0 1 .06-1.06Z"></path>
          </svg>
        </div>
      </a>

      {/* 롤링 컨텐츠 - 고정 높이 컨테이너 */}
      <div
        className="overflow-hidden relative pt-[20px]"
        style={{ height: `${CARD_HEIGHT + EXPANDED_HEIGHT + (contents.length - 1) * (CARD_HEIGHT + GAP)}px` }}
      >
        {contents.map((item, index) => {
          const isActive = index === activeIndex;

          // 아이템 위치 계산
          let topPosition = 0;
          for (let i = 0; i < index; i++) {
            if (i === activeIndex) {
              topPosition += CARD_HEIGHT + EXPANDED_HEIGHT + GAP;
            } else {
              topPosition += CARD_HEIGHT + GAP;
            }
          }

          return (
            <div
              key={item.id}
              className="absolute left-0 right-0 transition-all duration-500 ease-in-out"
              style={{ top: `${topPosition}px` }}
            >
              <a href={item.link} className="block">
                {/* 카드 영역 */}
                <div className="relative h-[66px] w-full">
                  {/* 활성화된 상태 (펼쳐진 카드) */}
                  <div
                    className="absolute left-0 right-0 h-full pl-[8px] pr-[20px] flex rounded-[8px] border bg-white transition-all duration-500"
                    style={{
                      borderColor: isActive ? '#a78bfa' : '#F2F2F2',
                      boxShadow: isActive ? '0 2px 8px 0 rgba(0,0,0,0.08)' : 'none',
                      opacity: isActive ? 1 : 0,
                      pointerEvents: isActive ? 'auto' : 'none'
                    }}
                  >
                    <div className="flex items-center overflow-hidden w-full">
                      <span className="text-[16px] font-semibold mr-[8px] w-[28px] h-[24px] text-center flex-shrink-0" style={{ color: '#a78bfa' }}>
                        {item.rank}
                      </span>
                      <div className="flex flex-col my-[4px] overflow-hidden">
                        <div className="flex items-center gap-[2px]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" className="text-yellow-400">
                            <path fill="currentColor" d="M17.712 21.992c-.12 0-.25-.03-.36-.09l-5.347-2.958-5.347 2.959a.75.75 0 0 1-.79-.04.761.761 0 0 1-.31-.74l1.03-6.328-4.378-4.478c-.2-.2-.26-.5-.17-.76.09-.27.32-.46.6-.5l5.997-.92L11.315 2.4c.25-.53 1.11-.53 1.36 0l2.688 5.738 5.997.92c.28.04.51.24.6.5.09.269.02.559-.17.759l-4.358 4.478 1.03 6.328a.76.76 0 0 1-.74.88z"></path>
                          </svg>
                          <span className="text-[12px] font-bold text-label-common_5">{item.rating}</span>
                          <span className="text-[12px] text-label-common_4">({item.reviewCount})</span>
                        </div>
                        <div className="flex">
                          <span className="text-[14px] text-label-common_4 flex-shrink-0">{item.brand}</span>
                          <span className="text-[14px] text-label-common_5 ml-[4px] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 비활성화된 상태 (접힌 카드) */}
                  <div
                    className="absolute flex items-center left-0 right-0 h-full pl-[8px] pr-[8px] rounded-[8px] border border-[#F2F2F2] bg-[#FAFAFA] transition-all duration-500"
                    style={{
                      opacity: isActive ? 0 : 1,
                      pointerEvents: isActive ? 'none' : 'auto'
                    }}
                  >
                    <div className="flex items-center overflow-hidden w-full">
                      <span className="text-[16px] font-semibold mr-[8px] w-[28px] h-[24px] text-center flex-shrink-0" style={{ color: '#a78bfa' }}>
                        {item.rank}
                      </span>
                      <div className="flex flex-col overflow-hidden flex-1">
                        <div className="flex items-center gap-[2px]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" className="text-yellow-400">
                            <path fill="currentColor" d="M17.712 21.992c-.12 0-.25-.03-.36-.09l-5.347-2.958-5.347 2.959a.75.75 0 0 1-.79-.04.761.761 0 0 1-.31-.74l1.03-6.328-4.378-4.478c-.2-.2-.26-.5-.17-.76.09-.27.32-.46.6-.5l5.997-.92L11.315 2.4c.25-.53 1.11-.53 1.36 0l2.688 5.738 5.997.92c.28.04.51.24.6.5.09.269.02.559-.17.759l-4.358 4.478 1.03 6.328a.76.76 0 0 1-.74.88z"></path>
                          </svg>
                          <span className="text-[12px] font-bold text-label-common_5">{item.rating}</span>
                          <span className="text-[12px] text-label-common_4">({item.reviewCount})</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-[14px] text-label-common_4 flex-shrink-0">{item.brand}</span>
                          <span className="text-[14px] text-label-common_3 ml-[4px] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</span>
                        </div>
                      </div>
                      <div className="w-[50px] h-[50px] flex-shrink-0 ml-[8px]">
                        <div className="relative overflow-hidden rounded-[8px] bg-white w-full h-full">
                          <img
                            className="w-full h-full object-contain scale-[0.8]"
                            alt={item.name}
                            src={item.image}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 설명 영역 (활성화 시에만 표시) */}
                <div
                  className="flex justify-between items-center p-[16px] transition-all duration-500 overflow-hidden"
                  style={{
                    backgroundColor: '#f7ebff',
                    borderRadius: '0 0 8px 8px',
                    height: isActive ? `${EXPANDED_HEIGHT}px` : '0px',
                    padding: isActive ? '16px' : '0px 16px',
                    opacity: isActive ? 1 : 0
                  }}
                >
                  <span className="text-[14px] inline-block max-h-[64px] line-clamp-3 text-label-common_4">
                    <span>&quot;</span>
                    <span className="overflow-hidden text-ellipsis">{item.description}</span>
                    <span>&quot;</span>
                  </span>
                  <div className="ml-[8px] rounded-[8px] overflow-hidden flex-shrink-0">
                    <div className="relative overflow-hidden rounded-[8px] bg-white w-[80px] h-[80px]">
                      <img
                        className="w-full h-full object-contain scale-[0.8]"
                        alt={item.name}
                        src={item.image}
                      />
                    </div>
                  </div>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BeautyShortContentSection;
