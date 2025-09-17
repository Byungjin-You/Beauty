"use client";

import { useRouter } from 'next/navigation';
import { popularEvents } from "../../data/events";

const PopularEventsSection = () => {
  const router = useRouter();
  return (
    <div>
      {/* 섹션 헤더 */}
      <div className="h-[56px] w-full flex justify-start items-center gap-[8px] undefined">
        <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">
          지금 많이 찾는 인기 이벤트
        </h3>
        <button 
          className="flex ml-auto items-center gap-[8px]"
          onClick={() => router.push('/events')}
        >
          <h5 className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-semibold">전체보기</h5>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-label-common_4">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      {/* 이벤트 그리드 */}
      <div className="grid desktop:grid-cols-4 tablet:grid-cols-3 tablet:gap-x-[12px] desktop:gap-y-[16px] tablet:gap-y-[24px] undefined">
        {popularEvents.slice(0, 3).map((event, index) => (
          <div key={index} className="relative w-full flex justify-start items-start gap-[12px] cursor-pointer py-[12px]">
            <img 
              alt="banner_image" 
              loading="lazy" 
              width="300" 
              height="300" 
              className="bg-container-common_3 border border-outline-thumbnail rounded-[16px] flex-none tablet:w-full tablet:h-auto w-[90px] h-[90px]" 
              src={event.image} 
              style={{ color: "transparent" }}
            />
            
            <div className="flex self-stretch flex-col justify-start items-start gap-[2px] w-full tablet:gap-[6px] gap-[2px]">
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
                  {event.clinic}
                </p>
              </div>
              
              <div className="flex justify-start items-center gap-[4px] flex-wrap">
                <h3 className="text-label-common_5 leading-[150%] text-inherit text-lg font-semibold">
                  {event.price}
                </h3>
                <h3 className={`leading-[150%] text-inherit text-lg font-semibold ${event.type === 'surgery' ? 'text-label-plasticSurgery_2' : 'text-label-skinTreatment_2'}`}>
                  {event.discount}
                </h3>
                {event.vatIncluded && (
                  <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">VAT 포함</p>
                )}
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
              
              {event.hasKakaoTalk && (
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
  );
};

export default PopularEventsSection; 