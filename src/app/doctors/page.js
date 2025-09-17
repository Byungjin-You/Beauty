"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import BottomNavigation from '../../components/sections/BottomNavigation';
import BeautyFilterModal from '../../components/common/BeautyFilterModal';
import { doctorsData } from '../../data/doctors';

export default function DoctorsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('surgery'); // surgery, skin
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('인기순');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showBeautyFilter, setShowBeautyFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('recommendation'); // 선택된 카테고리
  const [selectedConsultTypes, setSelectedConsultTypes] = useState({
    doctor: false,
    hospital: false
  }); // 상담 타입 선택 상태
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };

  // 상담 타입 토글 핸들러
  const handleConsultTypeToggle = (consultType) => {
    setSelectedConsultTypes(prev => ({
      ...prev,
      [consultType]: !prev[consultType]
    }));
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



        {/* 필터 및 정렬 영역 - 바비톡 HTML과 동일한 구조 */}
        <div className="desktop:px-[32px] tablet:px-[24px] px-[16px] tablet:pt-[24px] pt-[20px] tablet:pb-[16px] pb-[12px] z-10">
          <div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
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

            {/* 의사상담 버튼 */}
            <button 
              className={`flex flex-none items-center gap-[4px] border-[1.5px] rounded-[8px] h-[32px] px-[8px] ${
                selectedConsultTypes.doctor 
                  ? 'text-label-plasticSurgery_2 border-outline-plasticSurgery_2 bg-container-plasticSurgery_1'
                  : 'border-outline-common_2 bg-white'
              }`}
              onClick={() => handleConsultTypeToggle('doctor')}
            >
              <span 
                translate="no" 
                className="material-symbols-rounded !text-[18px]" 
                aria-hidden="true" 
                style={{ 
                  fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
                  color: selectedConsultTypes.doctor ? 'inherit' : 'rgb(49, 49, 66)'
                }}
              >
                check
              </span>
              <span className="flex items-center !leading-[100%] gap-[4px] leading-[150%] text-inherit text-sm font-semibold">
                의사상담
              </span>
            </button>

            {/* 병원상담 버튼 */}
            <button 
              className={`flex flex-none items-center gap-[4px] border-[1.5px] rounded-[8px] h-[32px] px-[8px] ${
                selectedConsultTypes.hospital 
                  ? 'text-label-plasticSurgery_2 border-outline-plasticSurgery_2 bg-container-plasticSurgery_1'
                  : 'border-outline-common_2 bg-white'
              }`}
              onClick={() => handleConsultTypeToggle('hospital')}
            >
              <span 
                translate="no" 
                className="material-symbols-rounded !text-[18px]" 
                aria-hidden="true" 
                style={{ 
                  fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
                  color: selectedConsultTypes.hospital ? 'inherit' : 'rgb(49, 49, 66)'
                }}
              >
                check
              </span>
              <span className="flex items-center !leading-[100%] gap-[4px] leading-[150%] text-inherit text-sm font-semibold">
                병원상담
              </span>
            </button>

          </div>
        </div>

        {/* 컨텐츠 영역 - 의사/병원 리스트 */}
        <div className="flex-1 desktop:px-[32px] tablet:px-[24px] px-[16px] desktop:pb-8 tablet:pb-20 pb-20">
          {/* 의사/병원 리스트 */}
          <div className="grid items-start justify-items-center desktop:grid-cols-3 tablet:grid-cols-2 gap-x-[12px] gap-y-[32px]">
            {doctorsData.map((doctor) => (
              <div 
                key={doctor.id} 
                className="w-full flex-col justify-center items-start gap-[12px] inline-flex cursor-pointer"
                onClick={() => window.open(`/hospital/${doctor.id}`, '_blank')}
              >
                {/* 병원 이미지 */}
                <img 
                  className="w-full rounded-[20px] bg-background-common_2" 
                  src={doctor.image}
                  alt={doctor.name}
                />
                
                <div className="self-stretch flex-col justify-start items-start gap-[6px] flex">
                  {/* 병원명과 주소 */}
                  <div className="flex flex-col gap-[2px]">
                    <h4 className="leading-[150%] text-inherit text-base font-semibold">
                      {doctor.name}
                    </h4>
                    <div className="flex items-center gap-[6px]">
                      <p className="flex-none leading-[150%] text-inherit text-[13px] font-medium">
                        {doctor.location}
                      </p>
                      <div className="w-[1px] h-[12px] bg-[#dadadf]"></div>
                      <p className="line-clamp-1 leading-[150%] text-inherit text-[13px] font-medium">
                        {doctor.address}
                      </p>
                    </div>
                  </div>

                  {/* 전문 분야 태그 */}
                  <div className="self-stretch justify-start items-start gap-[4px] inline-flex">
                    {doctor.specialties.map((specialty, index) => (
                      <div 
                        key={index}
                        className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] bg-container-common_2 border-none text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-common_5 !text-label-common_3"
                      >
                        <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">
                          {specialty}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* 평점 및 통계 정보 */}
                  <div className="flex items-center gap-[6px] flex-wrap">
                    <div className="flex items-center gap-[4px]">
                      <span 
                        translate="no" 
                        className="material-symbols-rounded text-inherit" 
                        aria-hidden="true" 
                        style={{
                          fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                          fontSize: '16px',
                          color: 'rgb(255, 199, 0)'
                        }}
                      >
                        star
                      </span>
                      <p className="leading-[150%] text-inherit text-[13px] font-medium">
                        {doctor.rating}
                      </p>
                      <p className="text-label-common_4 leading-none leading-[150%] text-inherit text-[11px] font-medium">
                        ({doctor.reviewCount.toLocaleString()})
                      </p>
                    </div>
                    <div className="w-[1px] h-[12px] bg-[#dadadf]"></div>
                    <div className="flex items-center gap-[4px]">
                      <p className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-medium">상담</p>
                      <p className="leading-none leading-[150%] text-inherit text-[11px] font-medium">
                        {doctor.consultCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-[1px] h-[12px] bg-[#dadadf]"></div>
                    <div className="flex items-center gap-[4px]">
                      <p className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-medium">이벤트</p>
                      <p className="leading-none leading-[150%] text-inherit text-[11px] font-medium">
                        {doctor.eventCount}
                      </p>
                    </div>
                    <div className="w-[1px] h-[12px] bg-[#dadadf]"></div>
                    <div className="flex items-center gap-[4px]">
                      <p className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-medium">의사</p>
                      <p className="leading-none leading-[150%] text-inherit text-[11px] font-medium">
                        {doctor.doctorCount}
                      </p>
                    </div>
                  </div>

                  {/* 배지 영역 */}
                  <div className="flex gap-[4px] flex-wrap">
                    {/* 대리수술안심존 배지 */}
                    {doctor.badges.safeZone && (
                      <div className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] bg-container-plasticSurgery_2 border-none text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-white undefined">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none">
                          <path 
                            fill="currentColor" 
                            fillRule="evenodd" 
                            d="M1.958 2.939a.625.625 0 0 0 0 1.25h8.75a.625.625 0 1 0 0-1.25zm8.125 2.083h-7.5V6.45c0 1.973 1.68 3.572 3.75 3.572s3.75-1.6 3.75-3.572zm-2.625 2.5c0 .592-.503 1.071-1.125 1.071-.621 0-1.125-.48-1.125-1.071 0-.592.504-1.072 1.125-1.072.622 0 1.125.48 1.125 1.072m.75 0c0 .986-.84 1.786-1.875 1.786s-1.875-.8-1.875-1.786.84-1.786 1.875-1.786 1.875.8 1.875 1.786" 
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">대리수술안심존</span>
                      </div>
                    )}

                    {/* 의사상담 배지 */}
                    {doctor.badges.doctorConsult && (
                      <div className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] border-outline-common_2 text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-common_5 undefined">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none">
                          <path 
                            fill="currentColor" 
                            d="M4.78 6.176a1.64 1.64 0 0 0 1.641-1.64c0-.904-.758-1.597-1.642-1.597-.888 0-1.65.704-1.645 1.604a1.64 1.64 0 0 0 1.645 1.633m4.252.236a.45.45 0 0 0 .362-.184l1.838-2.589a.5.5 0 0 0 .101-.25c0-.185-.183-.31-.374-.31-.123 0-.237.066-.322.188L9.016 5.612l-.754-.867a.38.38 0 0 0-.318-.155c-.2 0-.358.148-.358.329q.001.133.106.25l.961 1.059c.11.125.228.184.379.184M2.238 9.605h5.075c.672 0 .904-.184.904-.523 0-.948-1.328-2.253-3.442-2.253-2.11 0-3.442 1.305-3.442 2.253 0 .339.233.523.905.523"
                          />
                        </svg>
                        <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">의사상담</span>
                      </div>
                    )}

                    {/* 병원상담 배지 */}
                    {doctor.badges.hospitalConsult && (
                      <div className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] border-outline-common_2 text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-common_5 undefined">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none">
                          <path 
                            fill="currentColor" 
                            fillRule="evenodd" 
                            d="M3.183 1.939a1.35 1.35 0 0 0-1.35 1.35v6.3c0 .745.605 1.35 1.35 1.35h6.3a1.35 1.35 0 0 0 1.35-1.35v-6.3a1.35 1.35 0 0 0-1.35-1.35zm2.358 2.42c0-.218.178-.395.396-.395h.792c.22 0 .396.177.396.396v1.287h1.287c.22 0 .396.177.396.396v.792a.396.396 0 0 1-.396.396H7.125v1.287a.396.396 0 0 1-.396.396h-.792a.396.396 0 0 1-.396-.396V7.23H4.254a.396.396 0 0 1-.396-.396v-.792c0-.22.178-.396.396-.396h1.287z" 
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">병원상담</span>
                      </div>
                    )}
                  </div>
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
              '별점 높은 순',
              '신규 병원 순'
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