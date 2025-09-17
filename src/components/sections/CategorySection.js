"use client";

import { surgeryCategories, treatmentCategories } from "../../data/categories";

const CategorySection = () => {
  return (
    <div className="flex flex-col mt-[16px] tablet:mb-[32px] mb-[24px]">
      {/* 섹션 헤더 */}
      <div className="h-[56px] w-full flex justify-start items-center gap-[8px] undefined">
        <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">
          성형 & 쁘띠/피부
        </h3>
        <button className="flex ml-auto items-center gap-[8px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-label-common_4">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      {/* 카테고리 그리드 */}
      <div className="flex flex-col tablet:gap-[16px] gap-[12px] overflow-x-scroll scrollbar-hide select-none tablet:mx-[-24px] mx-[-16px] tablet:px-[24px] px-[16px]">
        
        {/* 성형 카테고리 */}
        <div className="flex" style={{ cursor: "auto" }}>
          <div className="flex gap-[6px]" style={{ cursor: "auto" }}>
            {surgeryCategories.map((category, index) => (
              <label key={index} className="shrink-0 tablet:w-[76px] w-[60px] flex flex-col items-center hover:cursor-pointer">
                <input className="hidden" type="radio" name="SurgeryCategory" />
                <img 
                  src={category.img}
                  className="border-[#ECECEF] border-2 border-solid w-[54px] h-[54px] rounded-[20px] false select-none overflow-hidden transition"
                  draggable="false"
                  alt={category.name}
                />
                <div className="font-medium text-label-common_4 text-[11px] leading-[16.5px] tracking-[-0.77px] w-full text-center mt-[6px]">
                  {category.name}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 쁘띠/피부 카테고리 */}
        <div className="flex" style={{ cursor: "auto" }}>
          <div className="flex gap-[6px]" style={{ cursor: "auto" }}>
            {treatmentCategories.map((category, index) => (
              <label key={index} className="shrink-0 tablet:w-[76px] w-[60px] flex flex-col items-center hover:cursor-pointer">
                <input className="hidden" type="radio" name="TreatmentCategory" />
                <img 
                  src={category.img}
                  className="border-[#ECECEF] border-2 border-solid w-[54px] h-[54px] rounded-[20px] false select-none overflow-hidden transition"
                  draggable="false"
                  alt={category.name}
                />
                <div className="font-medium text-label-common_4 text-[11px] leading-[16.5px] tracking-[-0.77px] w-full text-center mt-[6px]">
                  {category.name}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySection; 