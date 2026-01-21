"use client";

import { useState } from "react";

// 카테고리 데이터 (영문)
const categories = [
  {
    id: "all",
    name: "All",
    subcategories: []
  },
  {
    id: "skincare",
    name: "Skincare",
    subcategories: [
      { id: "skincare_all", name: "All" },
      { id: "skincare_toner", name: "Toners" },
      { id: "skincare_lotion", name: "Emulsions" },
      { id: "skincare_essence", name: "Essenses/Ampoules/Serums" },
      { id: "skincare_face_oil", name: "Facial Oils" },
      { id: "skincare_cream", name: "Face Moisturizers" },
      { id: "skincare_eye_care", name: "Eye Treatments" },
      { id: "skincare_mist", name: "Face Mists" },
      { id: "skincare_gel", name: "Gel" },
      { id: "skincare_toner_pad", name: "Toner Pads" },
      { id: "skincare_balm", name: "Balms/Multi-balms" },
    ]
  },
  {
    id: "cleansing",
    name: "Cleansers/Exfoliators",
    subcategories: [
      { id: "cleansing_all", name: "All" },
      { id: "cleansing_foam", name: "Foams" },
      { id: "cleansing_oil", name: "Oils" },
      { id: "cleansing_balm", name: "Balms" },
      { id: "cleansing_water", name: "Waters" },
      { id: "cleansing_gel", name: "Gels" },
    ]
  },
  {
    id: "mask",
    name: "Facial Masks",
    subcategories: [
      { id: "mask_all", name: "All" },
      { id: "mask_sheet", name: "Sheet" },
      { id: "mask_wash_off", name: "Wash-off" },
      { id: "mask_sleeping", name: "Sleeping" },
    ]
  },
  {
    id: "suncare",
    name: "Suncare",
    subcategories: [
      { id: "suncare_all", name: "All" },
      { id: "suncare_cream", name: "Sunscreens" },
      { id: "suncare_stick", name: "Sticks" },
    ]
  },
  {
    id: "base_makeup",
    name: "Face Makeup",
    subcategories: [
      { id: "base_all", name: "All" },
      { id: "base_foundation", name: "Foundations" },
      { id: "base_cushion", name: "Cushions" },
      { id: "base_concealer", name: "Concealers" },
    ]
  },
  {
    id: "eye_makeup",
    name: "Eye Makeup",
    subcategories: [
      { id: "eye_all", name: "All" },
      { id: "eye_shadow", name: "Shadows" },
      { id: "eye_liner", name: "Liners" },
      { id: "eye_mascara", name: "Mascaras" },
    ]
  },
  {
    id: "lip_makeup",
    name: "Lip Makeup",
    subcategories: [
      { id: "lip_all", name: "All" },
      { id: "lip_stick", name: "Lipsticks" },
      { id: "lip_tint", name: "Tints" },
    ]
  },
  {
    id: "body",
    name: "Body",
    subcategories: [
      { id: "body_all", name: "All" },
      { id: "body_wash", name: "Body Wash" },
      { id: "body_lotion", name: "Body Lotion" },
    ]
  },
  {
    id: "hair",
    name: "Hair",
    subcategories: [
      { id: "hair_all", name: "All" },
      { id: "hair_shampoo", name: "Shampoo" },
      { id: "hair_conditioner", name: "Conditioner" },
    ]
  },
  {
    id: "nail",
    name: "Nail",
    subcategories: [
      { id: "nail_all", name: "All" },
      { id: "nail_color", name: "Nail Color" },
    ]
  },
  {
    id: "fragrance",
    name: "Fragrance",
    subcategories: [
      { id: "fragrance_all", name: "All" },
      { id: "fragrance_women", name: "Women" },
      { id: "fragrance_men", name: "Men" },
    ]
  },
  {
    id: "etc",
    name: "Others",
    subcategories: [
      { id: "etc_all", name: "All" },
    ]
  },
  {
    id: "inner_beauty",
    name: "Supplements",
    subcategories: [
      { id: "inner_all", name: "All" },
    ]
  },
];

const CategoryFilter = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState("all");

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
    onCategoryChange?.(selectedCategory, subcategoryId);
  };

  const handleCategorySelect = (categoryId, subcategoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId || `${categoryId}_all`);
    onCategoryChange?.(categoryId, subcategoryId || `${categoryId}_all`);
    setIsModalOpen(false);
  };

  const toggleAccordion = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const currentSubcategories = currentCategory?.subcategories || [];

  return (
    <>
      <div className="flex flex-col">
        {/* 대메뉴 + 소메뉴 한 줄 */}
        <div className="flex items-center gap-[8px] tablet:mx-[-24px] mx-[-16px] tablet:px-[24px] px-[16px] overflow-x-auto scrollbar-hide">
          {/* 대메뉴 버튼 */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex flex-none items-center gap-[4px] border-[1.5px] rounded-[8px] h-[32px] px-[8px] transition-colors flex-shrink-0 text-label-plasticSurgery_2 border-outline-plasticSurgery_2 bg-container-plasticSurgery_1"
          >
            <span
              translate="no"
              className="material-symbols-rounded !text-[18px]"
              aria-hidden="true"
              style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
            >
              check
            </span>
            <span className="flex items-center !leading-[100%] gap-[4px] leading-[150%] text-inherit text-sm font-semibold">
              {currentCategory?.name}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14.721 9c1.02 0 1.628 1.028 1.062 1.795l-2.72 3.69c-.506.686-1.62.686-2.125 0l-2.721-3.69C7.65 10.028 8.259 9 9.279 9z"></path>
            </svg>
          </button>

          {/* 소메뉴 가로 스크롤 */}
          {currentSubcategories.map((sub) => (
            <button
              key={sub.id}
              className={`inline-flex items-center rounded-[8px] h-[32px] px-[10px] text-[13px] cursor-pointer select-none border-[1.5px] transition-colors flex-shrink-0 ${
                selectedSubcategory === sub.id
                  ? 'text-label-plasticSurgery_2 border-outline-plasticSurgery_2 bg-container-plasticSurgery_1 font-semibold'
                  : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
              }`}
              onClick={() => handleSubcategoryClick(sub.id)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>

      {/* 바텀시트 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* 바텀시트 */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[16px] animate-slideUp max-h-[80vh] flex flex-col">
            {/* 핸들바 */}
            <div className="flex flex-col flex-shrink-0 items-center justify-center touch-none cursor-grab">
              <div className="pt-[12px] pb-[16px]">
                <div className="h-[4px] w-[40px] rounded-full bg-gray-400"></div>
              </div>
            </div>

            {/* 카테고리 리스트 */}
            <div className="overflow-y-auto flex-1 pb-[100px]">
              <ul className="px-[20px]">
                {categories.map((category) => (
                  <li key={category.id}>
                    {category.subcategories.length === 0 ? (
                      // All 카테고리 (서브카테고리 없음)
                      <button
                        className="w-full py-[14px] flex justify-between items-center cursor-pointer select-none text-gray-900"
                        onClick={() => handleCategorySelect(category.id, null)}
                      >
                        <span className="flex items-center gap-[8px] text-[16px]">
                          {category.name}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="text-gray-700">
                          <path fill="currentColor" d="M4.192 8.26A.728.728 0 0 1 5.25 8.2l6.582 6.166a.242.242 0 0 0 .334 0L18.749 8.2a.728.728 0 0 1 1.06.06.808.808 0 0 1-.058 1.107l-6.583 6.166a1.695 1.695 0 0 1-2.336 0L4.249 9.367a.808.808 0 0 1-.057-1.106Z"></path>
                        </svg>
                      </button>
                    ) : (
                      // 아코디언 카테고리
                      <div>
                        <button
                          className="w-full py-[14px] flex justify-between items-center cursor-pointer select-none"
                          onClick={() => toggleAccordion(category.id)}
                        >
                          <span className={`flex items-center gap-[8px] ${expandedCategory === category.id ? 'text-[16px] font-semibold text-gray-900' : 'text-[16px] text-gray-900'}`}>
                            {category.name}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            className={`transition-transform duration-200 ${expandedCategory === category.id ? 'rotate-180 text-gray-900' : 'text-gray-700'}`}
                          >
                            <path fill="currentColor" d="M4.192 8.26A.728.728 0 0 1 5.25 8.2l6.582 6.166a.242.242 0 0 0 .334 0L18.749 8.2a.728.728 0 0 1 1.06.06.808.808 0 0 1-.058 1.107l-6.583 6.166a1.695 1.695 0 0 1-2.336 0L4.249 9.367a.808.808 0 0 1-.057-1.106Z"></path>
                          </svg>
                        </button>

                        {/* 서브카테고리 (확장 시) */}
                        {expandedCategory === category.id && (
                          <div className="pb-[20px] flex flex-wrap gap-[8px]">
                            {category.subcategories.map((sub) => (
                              <button
                                key={sub.id}
                                className={`inline-flex items-center rounded-[8px] h-[32px] px-[10px] text-[14px] cursor-pointer select-none border-[1.5px] transition-colors ${
                                  selectedCategory === category.id && selectedSubcategory === sub.id
                                    ? 'text-label-plasticSurgery_2 border-outline-plasticSurgery_2 bg-container-plasticSurgery_1 font-semibold'
                                    : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'
                                }`}
                                onClick={() => handleCategorySelect(category.id, sub.id)}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CategoryFilter;
