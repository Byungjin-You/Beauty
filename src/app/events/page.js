"use client";

import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../../components/sections/BottomNavigation';
import BeautyFilterModal from '../../components/common/BeautyFilterModal';
import { popularEvents } from '../../data/events';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('surgery'); // surgery, skin
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('인기순');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showBeautyFilter, setShowBeautyFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('recommendation'); // 선택된 카테고리
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

  // 드롭다운 토글 함수
  const handleDropdownToggle = () => {
    if (!isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 정렬 옵션 선택 함수
  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption);
    setIsDropdownOpen(false);
  };

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      {/* 헤더 영역 */}
      <Header />
      
      <div className="flex-1 flex flex-col">
        {/* 탭 영역 - sticky */}
        <div className="pt-20 desktop:px-[32px] tablet:px-[24px] px-[16px] sticky top-0 z-20 bg-background-common_1">
          <div className="relative h-[40px] flex justify-start border-b-[1px] border-outline-common_2">
            
            {/* 성형 탭 */}
            <button 
              className={`w-[120px] border-b-[3px] ${
                activeTab === 'surgery' 
                  ? 'border-label-plasticSurgery_2' 
                  : 'border-transparent'
              }`}
              onClick={() => {
                setActiveTab('surgery');
                setSelectedCategory('recommendation');
              }}
            >
              <h2 className={`h-full leading-[150%] text-inherit text-xl font-semibold ${
                activeTab === 'surgery' 
                  ? 'text-label-plasticSurgery_2' 
                  : 'text-label-common_3'
              }`}>
                성형
              </h2>
            </button>

            {/* 쁘띠/피부 탭 */}
            <button 
              className={`w-[120px] border-b-[3px] ${
                activeTab === 'skin' 
                  ? 'border-[#FF528D]' 
                  : 'border-transparent'
              }`}
              onClick={() => {
                setActiveTab('skin');
                setSelectedCategory('recommendation');
              }}
            >
              <h2 
                className={`h-full leading-[150%] text-inherit text-xl font-semibold ${
                  activeTab === 'skin' 
                    ? '' 
                    : 'text-label-common_3'
                }`}
                style={{
                  color: activeTab === 'skin' ? '#FF528D' : undefined
                }}
              >
                쁘띠/피부
              </h2>
            </button>

          </div>
        </div>

        {/* 카테고리 아이콘 섹션 - 바비톡 HTML과 동일한 구조 */}
        <div className="pt-[16px] overflow-x-scroll scrollbar-hide select-none desktop:px-[32px] tablet:px-[24px] px-[16px]" style={{ cursor: 'auto' }}>
          <div className="flex flex-row w-full justify-between desktop:gap-0 tablet:gap-[4.5px] gap-1.5" style={{ cursor: 'auto' }}>
            {(() => {
              // 탭에 따른 카테고리 데이터
              const categories = activeTab === 'surgery' 
                ? [
                    { id: 'recommendation', label: '추천', value: 'recommendation', imgName: 'recommendation' },
                    { id: '3000_1', label: '눈', value: '3000', imgName: 'eyes' },
                    { id: '3100_2', label: '코', value: '3100', imgName: 'nose' },
                    { id: '3200_3', label: '지방흡입/이식', value: '3200', imgName: 'fat' },
                    { id: '3300_4', label: '안면윤곽/양악', value: '3300', imgName: 'outline' },
                    { id: '3400_5', label: '가슴', value: '3400', imgName: 'breast' },
                    { id: '3500_6', label: '남자성형', value: '3500', imgName: 'mens' },
                    { id: '3600_7', label: '기타', value: '3600', imgName: 'etc' }
                  ]
                : [
                    { id: 'recommendation', label: '쁘띠/피부추천', value: 'recommendation', imgName: 'recommendation' },
                    { id: '4000_1', label: '얼굴', value: '4000', imgName: 'face' },
                    { id: '4100_2', label: '체형', value: '4100', imgName: 'body' },
                    { id: '4300_3', label: '피부', value: '4300', imgName: 'skin' },
                    { id: '4500_4', label: '치아', value: '4500', imgName: 'teeth' },
                    { id: '4600_5', label: '두피/탈모/제모', value: '4600', imgName: 'scalp' }
                  ];

              const imgPath = activeTab === 'surgery' ? 'surgery' : 'treatments';
              const borderColor = activeTab === 'surgery' ? '#604AFF' : '#FF528D';
              const textColor = activeTab === 'surgery' ? '#7264FF' : '#FF528D';

              return categories.map((category) => {
                const isSelected = selectedCategory === category.value;
                return (
                  <div 
                    key={category.id}
                    className="shrink-0 tablet:w-[76px] w-[60px] flex flex-col items-center hover:cursor-pointer"
                    onClick={() => handleCategorySelect(category.value)}
                  >
                    <img 
                      src={`https://images.babitalk.com/reviews/categories/v6_5_0/${imgPath}/${category.imgName}.png`}
                      className={`border-solid w-[54px] h-[54px] rounded-[20px] select-none overflow-hidden transition`}
                      style={{
                        border: isSelected 
                          ? `3px solid ${borderColor}` 
                          : '2px solid #ECECEF'
                      }}
                      draggable="false"
                      alt={category.label}
                    />
                    <div 
                      className={`${
                        isSelected 
                          ? 'font-semibold' 
                          : 'font-medium text-label-common_4'
                      } text-[11px] leading-[16.5px] tracking-[-0.77px] w-full text-center mt-[6px]`}
                      style={{
                        color: isSelected ? textColor : undefined
                      }}
                    >
                      {category.label}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* 인기 키워드 섹션 - 바비톡 HTML과 동일한 구조 */}
        <div className="flex items-center max-w-[1024px] overflow-auto scrollbar-hide desktop:px-[32px] tablet:px-[24px] px-[16px] gap-[10px] pt-[16px]">
          <span className="text-label-common_4 flex-none leading-[150%] text-inherit text-xs font-semibold">
            인기 키워드
          </span>
          <div className="flex gap-[6px] flex-none">
            {(() => {
              const keywords = activeTab === 'surgery' 
                ? [
                    { text: '자연유착 쌍커풀', isSpecial: true },
                    { text: '가슴확대(보형물)', isSpecial: true },
                    { text: '쌍꺼풀 눈재수술', isSpecial: true },
                    { text: '콧대(자가조직)', isSpecial: false },
                    { text: '코끝(자가조직)', isSpecial: false },
                    { text: '팔 바디지방흡입', isSpecial: false },
                    { text: '광대축소', isSpecial: false },
                    { text: '콧대(보형물)', isSpecial: false }
                  ]
                : [
                    { text: '보톡스', isSpecial: true },
                    { text: '필러', isSpecial: true },
                    { text: '레이저토닝', isSpecial: true },
                    { text: '실리프팅', isSpecial: false },
                    { text: '피코레이저', isSpecial: false },
                    { text: '써마지', isSpecial: false },
                    { text: '울쎄라', isSpecial: false },
                    { text: '인모드', isSpecial: false }
                  ];

              return keywords.map((keyword, index) => (
                <button 
                  key={index}
                  className={`min-w-[42px] flex flex-none justify-center items-center font-semibold rounded-[200px] px-[10px] text-[12px] gap-[2px] bg-container-common_2 border border-outline-common_2 ${
                    keyword.isSpecial ? '' : 'text-label-common_5'
                  }`}
                  style={{ 
                    height: '32px',
                    color: keyword.isSpecial ? (activeTab === 'surgery' ? '#7264FF' : '#FF528D') : undefined
                  }}
                >
                  {keyword.text}
                </button>
              ));
            })()}
          </div>
        </div>

        {/* 필터 및 정렬 영역 - 바비톡 HTML과 동일한 구조 */}
        <div className="desktop:px-[32px] tablet:px-[24px] px-[16px] tablet:pt-[24px] pt-[20px] tablet:pb-[16px] pb-[12px] z-10">
          <div className="flex items-center gap-[8px]">
            
            {/* 인기순 드롭다운 */}
            <div className="relative flex flex-none">
              <button 
                ref={buttonRef}
                onClick={handleDropdownToggle}
                className="text-label-common_5 border-outline-common_2 h-[32px] px-[8px] inline-flex items-center gap-[2.5px] bg-background-common_1 border-[1.5px] rounded-lg"
                type="button"
              >
                <span 
                  className="material-symbols-rounded text-inherit" 
                  aria-hidden="true" 
                  style={{
                    fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                    color: 'rgb(49, 49, 66)',
                    fontSize: '16px'
                  }}
                >
                  swap_vert
                </span>
                <span className="leading-[150%] text-inherit text-sm font-semibold">{selectedSort}</span>
              </button>
            </div>

            {/* 구분선 */}
            <div className="flex-none w-[2px] h-[24px] bg-[#ececef] mx-[4px]"></div>

            {/* 뷰티고민 버튼 */}
            <div className="flex flex-none gap-[8px]">
              <button 
                className="text-label-common_5 border-outline-common_2 h-[32px] px-[8px] inline-flex items-center gap-[2.5px] bg-background-common_1 border-[1.5px] rounded-lg"
                type="button"
                onClick={() => setShowBeautyFilter(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                  <path 
                    fill="currentColor" 
                    fillRule="evenodd" 
                    d="M15.333 8A7.333 7.333 0 0 1 3.961 14.12l-2.624.373a.376.376 0 0 1-.42-.454l.59-2.627A7.333 7.333 0 1 1 15.333 8m-6.67.917c-.088.393-.317.621-.733.621-.498 0-.79-.34-.79-.82v-.082c0-.691.357-1.148 1.048-1.553.756-.45.985-.744.985-1.283 0-.574-.446-.973-1.09-.973-.575 0-.961.282-1.149.803-.146.375-.41.54-.767.54-.463 0-.75-.288-.75-.733 0-.252.058-.475.175-.697.375-.774 1.313-1.272 2.573-1.272 1.664 0 2.783.914 2.783 2.28 0 .884-.428 1.488-1.254 1.974-.78.451-.955.703-1.031 1.195m.24 2.309c0 .515-.428.92-.961.92-.527 0-.955-.405-.955-.92 0-.516.428-.92.955-.92.533 0 .961.404.961.92" 
                    clipRule="evenodd"
                  />
                </svg>
                <span className="leading-[150%] text-inherit text-sm font-semibold">뷰티고민</span>
              </button>
            </div>

            {/* 카톡상담 버튼 */}
            <button className="flex flex-none items-center gap-[4px] border-[1.5px] rounded-[8px] border-outline-common_2 bg-white h-[32px] px-[8px]">
              <span className="flex items-center !leading-[100%] gap-[4px] leading-[150%] text-inherit text-sm font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[16px] h-[16px]">
                  <path 
                    fill="currentColor" 
                    fillRule="evenodd" 
                    d="M10 1.667C4.937 1.667.833 4.902.833 8.894c0 2.581 1.716 4.848 4.297 6.124l-.006.02c-.154.534-.897 3.098-.926 3.302 0 0-.019.155.082.215a.28.28 0 0 0 .218.013c.277-.04 3.091-2.006 3.796-2.5l.082-.056q.808.111 1.624.11c5.063 0 9.167-3.236 9.167-7.228S15.063 1.667 10 1.667" 
                    clipRule="evenodd" 
                    opacity="0.9"
                  />
                </svg>
                카톡상담
              </span>
            </button>

          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 desktop:px-[32px] tablet:px-[24px] px-[16px] desktop:pb-8 tablet:pb-20 pb-20">
          {/* 이벤트 리스트 */}
          <div className="grid desktop:grid-cols-2 tablet:grid-cols-1 grid-cols-1 desktop:gap-x-[16px] desktop:gap-y-[16px] tablet:gap-y-[16px] gap-y-[12px]">
            {popularEvents.map((event) => (
              <div key={event.id} className="relative w-full flex justify-start items-start gap-[12px] cursor-pointer py-[12px] border-b border-outline-common_2 last:border-b-0">
                <img 
                  alt="banner_image" 
                  loading="lazy" 
                  width="300" 
                  height="300" 
                  className="bg-container-common_3 border border-outline-thumbnail rounded-[16px] flex-none w-[90px] h-[90px]" 
                  src={event.image} 
                  style={{ color: "transparent" }}
                />
                
                <div className="flex self-stretch flex-col justify-start items-start gap-[2px] w-full">
                  <div className="flex self-stretch flex-col justify-start items-start gap-[2px]">
                    <div className="w-full flex gap-[2px] items-center">
                      <h4 className="text-label-common_5 line-clamp-1 leading-[150%] text-inherit text-base font-semibold">
                        {event.title}
                      </h4>
                    </div>
                    <p className="text-label-common_3 line-clamp-1 leading-[150%] text-inherit text-[13px] font-medium">
                      {event.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-start items-center gap-[6px]">
                    <p className="text-label-common_3 flex-none leading-[150%] text-inherit text-[13px] font-medium">
                      {event.location}
                    </p>
                    <div className="w-px h-[12px] flex-none" style={{ background: "rgb(217, 217, 217)" }}></div>
                    <p className="text-label-common_3 line-clamp-1 leading-[150%] text-inherit text-[13px] font-medium">
                      {event.hospital}
                    </p>
                  </div>
                  
                  <div className="flex justify-start items-center gap-[4px] flex-wrap">
                    <h3 className="text-label-common_5 leading-[150%] text-inherit text-lg font-semibold">
                      {event.price}
                    </h3>
                    <h3 className={`leading-[150%] text-inherit text-lg font-semibold ${event.discountType === 'plasticSurgery' ? 'text-label-plasticSurgery_2' : 'text-label-skinTreatment_2'}`}>
                      {event.discount}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-[4px]">
                    <span 
                      className="material-symbols-rounded" 
                      aria-hidden="true" 
                      style={{
                        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                        fontSize: '14px',
                        color: 'rgb(255, 188, 51)'
                      }}
                    >
                      star
                    </span>
                    <h5 className="text-label-common_5 leading-[150%] text-inherit text-[13px] font-semibold">
                      {event.rating}
                    </h5>
                    <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">
                      ({event.reviewCount})
                    </p>
                  </div>
                  
                  {event.hasKakaoConsult && (
                    <div className="flex">
                      <div className="flex items-center gap-[4px] px-[4px] py-[2px] bg-[#FEE500] rounded-[4px]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[12px] h-[12px] flex-shrink-0">
                          <path fill="currentColor" fillRule="evenodd" d="M10 1.667C4.937 1.667.833 4.902.833 8.894c0 2.581 1.716 4.848 4.297 6.124l-.006.02c-.154.534-.897 3.098-.926 3.302 0 0-.019.155.082.215a.28.28 0 0 0 .218.013c.277-.04 3.091-2.006 3.796-2.5l.082-.056q.808.111 1.624.11c5.063 0 9.167-3.236 9.167-7.228S15.063 1.667 10 1.667" clipRule="evenodd" opacity="0.9"></path>
                        </svg>
                        <p className="text-black leading-[15px] leading-[150%] text-inherit text-[10px] font-medium">카톡상담</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 드롭다운 메뉴 - 바비톡 HTML과 동일한 구조 */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          className="fixed z-20 rounded-lg p-1 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.12)] w-[132px] bg-background-common_1 cursor-pointer"
          style={{ 
            top: `${dropdownPosition.top}px`, 
            left: `${dropdownPosition.left}px` 
          }}
        >
          <ul className="bg-white" aria-labelledby="filterDefaultButton">
            {[
              '인기순',
              '후기 많은순', 
              '저가순',
              '고가순',
              '별점 높은순',
              '최신순'
            ].map((sortOption) => {
              const isSelected = sortOption === selectedSort;
              return (
                <li 
                  key={sortOption}
                  onClick={() => handleSortSelect(sortOption)}
                  className={`${
                    isSelected 
                      ? 'bg-background-common_2 text-label-common_5' 
                      : 'false'
                  } flex flex-column items-center justify-between ju px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4`}
                >
                  <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">
                    {sortOption}
                  </h6>
                  {isSelected && (
                    <span 
                      className="material-symbols-rounded text-inherit" 
                      aria-hidden="true" 
                      style={{
                        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                        fontSize: '16px'
                      }}
                    >
                      check
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 하단 내비게이션 */}
      <BottomNavigation />

      {/* 뷰티고민 필터 모달 */}
      {showBeautyFilter && (
        <BeautyFilterModal 
          isOpen={showBeautyFilter}
          onClose={() => setShowBeautyFilter(false)}
        />
      )}
    </div>
  );
} 