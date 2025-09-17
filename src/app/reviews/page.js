"use client";

import { useState } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../../components/sections/BottomNavigation';
import BeautyFilterModal from '../../components/common/BeautyFilterModal';
import { reviews } from '../../data/reviews';

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState('surgery'); // surgery, skin
  const [showBeautyFilter, setShowBeautyFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('recommendation'); // 선택된 카테고리

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
  };



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



        {/* 필터 영역 - 뷰티고민만 */}
        <div className="desktop:px-[32px] tablet:px-[24px] px-[16px] tablet:pt-[24px] pt-[20px] tablet:pb-[16px] pb-[12px] z-10">
          <div className="flex items-center gap-[8px]">
            
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

          </div>
        </div>

        {/* 컨텐츠 영역 - 후기 리스트 */}
        <div className="flex-1 desktop:px-[32px] tablet:px-[24px] px-[16px] desktop:pb-8 tablet:pb-20 pb-20">
          {/* 후기 리스트 */}
          <div className="grid desktop:grid-cols-2 tablet:grid-cols-1 grid-cols-1 desktop:gap-x-[16px] desktop:gap-y-[16px] tablet:gap-y-[16px] gap-y-[12px]">
            {reviews.map((review) => (
              <article 
                key={review.id}
                className="w-full desktop:min-h-[362px] tablet:min-h-[390px] min-h-[384px] overflow-hidden" 
                data-review-id={review.id}
              >
                <div className="flex flex-col gap-[12px]">
                  {/* 이미지 그리드 */}
                  <div className="max-h-[234px] min-h-[206px] border border-outline-common_2 rounded-[16px] box-content">
                    <div className="desktop:h-[206px] tablet:h-[218px] h-[234px] rounded-[16px] overflow-hidden grid grid-cols-3 grid-rows-2 gap-[2px]">
                      {/* 첫 번째 이미지 (대형 - 2x2) */}
                      <figure className="col-span-2 row-span-2 relative w-full cursor-pointer h-full">
                        <img 
                          src={review.images[0]?.src} 
                          alt={`review_thumbnail_0`} 
                          className="object-cover h-full w-full"
                        />
                        <figcaption 
                          className="rounded-[16px_0px_16px_0px] absolute inset-0 w-full h-full flex justify-center items-center bg-container-common_5/70" 
                          style={{ width: '36px', height: '36px' }}
                        >
                          <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">
                            {review.images[0]?.label}
                          </h6>
                        </figcaption>
                      </figure>

                      {/* 두 번째 이미지 (우측 상단) */}
                      <figure className="col-start-3 relative w-full cursor-pointer h-full">
                        <img 
                          src={review.images[1]?.src} 
                          alt={`review_thumbnail_1`} 
                          className="object-cover h-full w-full"
                        />
                        <figcaption 
                          className="rounded-[0px_0px_16px_0px] absolute inset-0 w-full h-full flex justify-center items-center bg-container-common_5/70" 
                          style={{ width: '28px', height: '28px' }}
                        >
                          <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">
                            {review.images[1]?.label}
                          </h6>
                        </figcaption>
                      </figure>

                      {/* 세 번째 이미지 (우측 하단) */}
                      <figure className="col-start-3 row-start-2 relative w-full cursor-pointer h-full">
                        <img 
                          src={review.images[2]?.src} 
                          alt={`review_thumbnail_2`} 
                          className="object-cover h-full w-full"
                        />
                        <figcaption 
                          className="rounded-[0px_0px_16px_0px] absolute inset-0 w-full h-full flex justify-center items-center bg-background-plasticSurgery_2" 
                          style={{ width: '28px', height: '28px' }}
                        >
                          <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">
                            {review.images[2]?.label}
                          </h6>
                        </figcaption>
                        {review.images[2]?.hasMore && (
                          <figcaption className="rounded-br-[12px] bg-[#000]/50 absolute inset-0 flex items-center justify-center">
                            <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">
                              +{review.images[2].hasMore}
                            </h6>
                          </figcaption>
                        )}
                      </figure>
                    </div>
                  </div>

                  {/* 시술 정보 카드 */}
                  <div className="flex items-center gap-[12px] p-[16px] bg-container-common_2 rounded-[16px] border border-outline-common_2 cursor-pointer">
                    <img 
                      className="w-[40px] h-[40px] object-cover rounded-[8px]" 
                      src={review.hospitalImage}
                      alt="hospital"
                    />
                    <div>
                      <h6 className="leading-[150%] text-inherit text-sm font-medium">
                        {review.procedure}
                      </h6>
                      <div className="flex items-center gap-[4px] flex-wrap">
                        <span className="leading-[150%] text-inherit text-base font-semibold">
                          {review.price}
                        </span>
                        <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">
                          VAT 포함
                        </p>
                      </div>
                    </div>
                    <span 
                      className="material-symbols-rounded text-label-common_3 !text-[16px] ml-auto" 
                      aria-hidden="true" 
                      style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                    >
                      arrow_forward_ios
                    </span>
                  </div>
                </div>

                {/* 후기 정보 */}
                <div className="px-1 mt-3 cursor-pointer">
                  <h4 className="text-label-common_6 line-clamp-1 leading-[150%] text-inherit text-base font-semibold">
                    {review.title}
                  </h4>
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">
                      시술시기 {review.date}
                    </p>
                    {review.isVerified && (
                      <div className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] bg-container-plasticSurgery_1 border-none text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-plasticSurgery_2">
                        <span 
                          className="material-symbols-rounded text-inherit" 
                          aria-hidden="true" 
                          style={{ 
                            fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', 
                            fontSize: '12px', 
                            color: 'rgb(96, 74, 255)', 
                            visibility: 'visible' 
                          }}
                        >
                          verified_user
                        </span>
                        <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">
                          실제 시술 인증
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="h-2"></div>

                  {/* 별점 */}
                  <div className="flex items-center justify-start gap-0.5">
                    {[...Array(5)].map((_, index) => (
                      <span 
                        key={index}
                        className="material-symbols-rounded" 
                        aria-hidden="true" 
                        style={{
                          fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                          fontSize: '16px',
                          color: index < review.rating ? 'rgb(255, 188, 51)' : '#E5E5E5'
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <div className="h-2"></div>

                  {/* 후기 내용 */}
                  <p className="line-clamp-2 text-label-common_5 break-all leading-[150%] text-inherit text-sm font-normal">
                    {review.shortContent}
                  </p>
                  <p className="text-label-common_3 mt-0.5 leading-[150%] text-inherit text-sm font-normal">
                    ..더보기
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>



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