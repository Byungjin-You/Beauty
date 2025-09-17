"use client";

import { useRouter } from 'next/navigation';
import { reviews } from "../../data/reviews";

const ReviewsSection = () => {
  const router = useRouter();

  const renderStars = (rating) => {
    return Array(rating).fill(0).map((_, index) => (
      <span 
        key={index}
        className="material-symbols-rounded" 
        aria-hidden="true" 
        style={{
          fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
          fontSize: '20px',
          color: 'rgb(255, 188, 51)'
        }}
      >
        star
      </span>
    ));
  };

  return (
    <div>
      {/* 섹션 헤더 */}
      <div className="h-[56px] w-full flex justify-start items-center gap-[8px] undefined">
        <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">
          실제 인증된 인기 시술 후기
        </h3>
        <button 
          className="flex ml-auto items-center gap-[8px]"
          onClick={() => router.push('/reviews')}
        >
          <h5 className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-semibold">전체보기</h5>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-label-common_4">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      {/* 후기 그리드 */}
      <div className="grid desktop:grid-cols-3 tablet:grid-cols-2 gap-x-[12px] gap-y-[28px]">
        {reviews.slice(0, 3).map((review) => (
          <div key={review.id} className="flex gap-[12px] cursor-pointer">
            <div 
              className="relative flex-none w-[90px] h-[90px] rounded-2xl !bg-container-common_3"
              style={{
                background: `url("${review.images?.[0]?.src || '/images/placeholder.jpg'}") 0% 0% / cover`
              }}
            >
              <figcaption className="w-[28px] h-[28px] rounded-[16px_0px_16px_0px] absolute inset-0 flex justify-center items-center bg-container-common_5/70">
                <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">전</h6>
              </figcaption>
            </div>
            
            <div className="flex flex-col gap-[8px]">
              <h4 className="text-label-common_6 line-clamp-1 leading-[150%] text-inherit text-base font-semibold">
                {review.title}
              </h4>
              
              <div className="flex items-center justify-start gap-0">
                {renderStars(review.rating)}
              </div>
              
              <div>
                <p className="line-clamp-2 text-label-common_5 leading-[150%] text-inherit text-sm font-normal">
                  {review.shortContent || review.content}
                </p>
                <p className="text-label-common_3 mt-0.5 leading-[150%] text-inherit text-sm font-normal">
                  ..더보기
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection; 