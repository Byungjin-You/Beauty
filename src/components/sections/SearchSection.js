"use client";

import { useState, useEffect } from "react";

const SearchSection = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  // 인기 검색어 목록
  const hotKeywords = [
    { rank: 1, keyword: "Oliveyoung Ranking", link: "/ranking" },
    { rank: 2, keyword: "Best Korean Moisturizer", link: "/ranking?category=skincare_cream" },
    { rank: 3, keyword: "Sunscreen SPF50+", link: "/ranking?category=suncare" },
    { rank: 4, keyword: "Vitamin C Serum", link: "/ranking?category=skincare_essence" },
    { rank: 5, keyword: "Korean Toner", link: "/ranking?category=skincare_toner" },
  ];

  // 자동 롤링 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hotKeywords.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hotKeywords.length]);

  const currentKeyword = hotKeywords[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center gap-[12px] desktop:py-[32px] tablet:pt-0 tablet:pb-[24px] pb-[16px]">
      {/* 검색바 */}
      <div className="flex gap-[10px] w-full max-w-[680px] rounded-[30px] border border-outline-common_2 pl-[16px] pr-[8px] py-[7px] transition">
        <input
          className="text-sm font-medium w-full placeholder-[#7e7e8f] text-label-common_5 outline-none"
          placeholder="궁금한 제품을 검색해 보세요"
          readOnly
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className="flex-none tablet:w-[36px] tablet:h-[36px] w-[32px] h-[32px] bg-background-common_3 rounded-[50px] shadow justify-center items-center flex text-white p-[8px]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-full h-full">
            <path fill="currentColor" fillRule="evenodd" d="M14.167 8.75a5.417 5.417 0 1 1-10.833 0 5.417 5.417 0 0 1 10.833 0m-1.032 5.563a7.083 7.083 0 1 1 1.178-1.178l3.194 3.193a.833.833 0 1 1-1.178 1.179z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>

      {/* 인기 검색어 섹션 */}
      <div className="w-full py-1">
        <div className="flex gap-[8px] items-center">
          {/* HOT NOW 배지 */}
          <span className="inline-block rounded-full font-bold h-[22px] px-[6px] text-[11px] leading-[22px] bg-red-400 text-white flex-shrink-0">
            HOT NOW
          </span>

          {/* 롤링 인기 검색어 */}
          <a
            href={currentKeyword.link}
            className="relative h-[24px] flex items-center flex-1 min-w-0 overflow-hidden"
          >
            <div
              key={currentIndex}
              className="flex items-center gap-[8px] min-w-0 animate-slideUp"
            >
              <span className="text-[16px] font-bold flex-shrink-0" style={{ color: '#f87171' }}>
                {currentKeyword.rank}
              </span>
              <h2 className="text-[16px] font-bold text-gray-900 truncate min-w-0">
                {currentKeyword.keyword}
              </h2>
            </div>
          </a>
        </div>
      </div>

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchSection;
