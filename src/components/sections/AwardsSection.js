"use client";

import { awards } from "../../data/awards";

const AwardsSection = () => {
  return (
    <div className="flex flex-col mt-[24px] tablet:mt-[32px] desktop:mt-[40px]">
      {/* 섹션 헤더 */}
      <div className="h-[56px] w-full flex justify-start items-center gap-[8px] undefined">
        <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">
          뷰티 어워드
        </h3>
        <button className="flex ml-auto items-center gap-[8px]">
          <h5 className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-semibold">전체보기</h5>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-label-common_4">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      {/* 화해 스타일 어워드 리스트 - 우리 CSS로 변환 */}
      <ul className="flex flex-row tablet:mx-[-24px] mx-[-16px] tablet:px-[24px] px-[16px] pb-[60px] overflow-x-scroll scrollbar-hide">
        {awards.map((award, index) => (
          <li 
            key={award.id} 
            className={`flex flex-shrink-0 relative w-[134px] h-[134px] mt-[10px] bg-white rounded-[16px] border border-outline-common_2 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.12)] transition-all duration-200 ${index === 0 ? 'ml-0' : 'ml-[16px]'}`}
          >
            <a 
              className="flex flex-col w-full h-full justify-between pt-[8px] pl-[16px] pb-[16px]" 
              href={award.link}
            >
              {/* 아이콘 영역 */}
              <div className="relative w-[60px] h-[60px]">
                <picture className="m-0 p-0">
                  <img 
                    className="touch-action-none pointer-events-none h-auto w-full align-top transition-opacity duration-75 opacity-100"
                    alt="award icon"
                    src={award.icon}
                    style={{ clipPath: 'inherit' }}
                  />
                </picture>
              </div>

              {/* 텍스트 영역 */}
              <div className="flex flex-col items-start">
                {/* 배지 */}
                <span className="inline-block rounded-[4px] h-[16px] px-[4px] text-[10px] font-medium leading-[16px] bg-container-plasticSurgery_1 text-label-plasticSurgery_2">
                  {award.badge}
                </span>
                
                {/* 제목 */}
                <span className="text-[14px] font-medium text-label-common_5 mt-[2px] whitespace-pre-line overflow-y-hidden line-clamp-1 px-[2px]">
                  {award.name}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AwardsSection;
