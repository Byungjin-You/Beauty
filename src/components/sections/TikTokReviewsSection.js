"use client";

import React, { useState, useEffect, useRef } from "react";
import { tiktokReviews } from "../../data/tiktok-reviews";

const TikTokReviewsSection = () => {
  const [playingVideo, setPlayingVideo] = useState(null);
  const videoRefs = useRef({});
  const observerRef = useRef(null);

  // 스크롤 이벤트로 자동재생 구현
  useEffect(() => {
    const scrollContainer = document.querySelector('[data-tiktok-scroll]');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      
      let closestVideo = null;
      let minDistance = Infinity;

      // 화면 중앙에 가장 가까운 비디오 찾기
      Object.entries(videoRefs.current).forEach(([videoId, video]) => {
        if (video && video.parentElement) {
          const videoContainer = video.parentElement.parentElement; // data-video-id 컨테이너
          const videoRect = videoContainer.getBoundingClientRect();
          const videoCenter = videoRect.left + videoRect.width / 2;
          const distance = Math.abs(containerCenter - videoCenter);
          
          // 비디오가 화면에 보이는지 확인
          const isVisible = videoRect.right > containerRect.left && videoRect.left < containerRect.right;
          
          if (isVisible && distance < minDistance) {
            minDistance = distance;
            closestVideo = { id: videoId, video };
          }
        }
      });

      // 모든 비디오 정지
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.pause();
        }
      });

      // 가장 가까운 비디오 재생
      if (closestVideo) {
        closestVideo.video.play().then(() => {
          setPlayingVideo(parseInt(closestVideo.id));
        }).catch((error) => {
          console.log('자동재생 실패:', error);
        });
      } else {
        setPlayingVideo(null);
      }
    };

    // 스크롤 이벤트 리스너 추가 (디바운싱)
    let scrollTimeout;
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    scrollContainer.addEventListener('scroll', debouncedScroll);
    
    // 초기 로드 시 첫 번째 비디오 재생
    setTimeout(handleScroll, 1000);

    return () => {
      scrollContainer.removeEventListener('scroll', debouncedScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <span 
        key={index}
        className="material-symbols-rounded" 
        aria-hidden="true" 
        style={{
          fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
          fontSize: '12px',
          color: index < Math.floor(rating) ? '#ffbc33' : '#e5e5ea'
        }}
      >
        star
      </span>
    ));
  };

  return (
    <div className="flex flex-col">
      {/* 섹션 헤더 */}
      <div className="h-[56px] w-full flex justify-start items-center gap-[8px] undefined">
        <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">
          TikTok Reviews
        </h3>
        <button className="flex ml-auto items-center gap-[8px]">
          <h5 className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-semibold">전체보기</h5>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-label-common_4">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      {/* TikTok 리뷰 가로 스크롤 컨테이너 */}
      <div 
        className="flex overflow-x-scroll scrollbar-hide tablet:mx-[-24px] mx-[-16px] tablet:px-[24px] px-[16px]"
        data-tiktok-scroll
        style={{ 
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex gap-[12px]">
          {tiktokReviews.map((review, index) => (
            <div 
              key={review.id} 
              className="flex flex-col flex-shrink-0"
            >
              {/* 상단 헤더 - sponsored 배지와 더보기 버튼 */}
              <div className="mb-[6px] w-[240px] flex justify-between items-center h-[24px]">
                {review.isSponsored && (
                  <span className="inline-block rounded-full h-[16px] px-[4px] text-[10px] font-normal leading-[16px] bg-gray-100 text-gray-600">
                    sponsored
                  </span>
                )}
                <div className="h-[24px] ml-auto">
                  <button type="button" className="cursor-pointer" aria-label="더보기">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-label-common_3">
                      <path fill="currentColor" d="M4.5 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m7.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m9-1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"></path>
                    </svg>
                  </button>
                </div>
              </div>

                                        {/* TikTok 비디오/이미지 영역 */}
                          <div className="relative">
                            <div 
                              className="w-[240px] h-[427px] mr-[12px] isolate overflow-hidden rounded-[4px] cursor-pointer"
                              data-video-id={review.id}
                            >
                              <div className="w-full h-full relative group">
                                {/* 비디오 요소 */}
                                <video 
                                  ref={(el) => {
                                    if (el) {
                                      videoRefs.current[review.id] = el;
                                    }
                                  }}
                                  className="w-full h-full object-cover"
                                  poster={review.videoThumbnail}
                                  muted
                                  loop
                                  playsInline
                                  onLoadedData={(e) => {
                                    // 각 비디오마다 다른 시작 시간 설정 (0~10초 사이)
                                    e.target.currentTime = (review.id - 1) * 2; // 2초씩 차이
                                  }}
                                  onError={(e) => {
                                    // 비디오 로드 실패 시 썸네일 이미지로 대체
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                >
                                  <source src={review.videoUrl} type="video/mp4" />
                                </video>
                    
                    {/* 폴백 이미지 */}
                    <img 
                      src={review.videoThumbnail}
                      alt={`TikTok 리뷰 ${index + 1}`}
                      className="w-full h-full object-cover hidden"
                    />
                    
                    {/* 재생 버튼 오버레이 */}
                    <div 
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                        playingVideo === review.id ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        const videoElement = e.currentTarget.previousSibling.previousSibling;
                        
                        if (playingVideo === review.id) {
                          // 현재 재생 중인 비디오 일시정지
                          videoElement.pause();
                          setPlayingVideo(null);
                        } else {
                          // 다른 비디오들 모두 일시정지
                          const allVideos = document.querySelectorAll('video');
                          allVideos.forEach(video => video.pause());
                          setPlayingVideo(null);
                          
                          // 현재 비디오 재생
                          videoElement.play().then(() => {
                            setPlayingVideo(review.id);
                          }).catch(console.error);
                        }
                      }}
                    >
                      <div className="w-[60px] h-[60px] rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1">
                          {playingVideo === review.id ? (
                            // 일시정지 아이콘
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          ) : (
                            // 재생 아이콘
                            <path d="M8 5v14l11-7z"/>
                          )}
                        </svg>
                      </div>
                    </div>

                    {/* TikTok 브랜딩 오버레이 */}
                    <div className="absolute top-3 right-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 제품 정보 카드 */}
                <div className="mt-[8px] w-[240px] h-[54px] rounded-[8px] border border-outline-common_2 bg-container-common_2">
                  <a 
                    className="w-[240px] h-[54px] pl-[9px] px-[8px] py-[8px] flex items-center overflow-hidden"
                    href={review.product.link}
                  >
                    {/* 제품 이미지 */}
                    <div className="w-[32px] h-[32px] mr-[4px] flex items-center justify-center">
                      <div className="relative overflow-hidden rounded-[8px] bg-white w-full aspect-square">
                        <img 
                          className="w-full h-full object-contain scale-[0.8]"
                          alt={review.product.name}
                          src={review.product.image}
                        />
                      </div>
                    </div>

                    {/* 제품 정보 */}
                    <div className="max-w-[188px] max-h-[42px] min-h-[21px] flex flex-col justify-between">
                      <div className="flex">
                        <span className="text-[12px] text-label-common_5 block truncate">
                          <span className="text-label-common_4">{review.product.brand}</span> {review.product.name}
                        </span>
                      </div>
                      
                      {/* 별점 및 리뷰 수 */}
                      <div className="flex items-center gap-[2px]">
                        {renderStars(review.product.rating)}
                        <span className="text-[12px] text-label-common_4 ml-[2px]">
                          {review.product.rating}
                        </span>
                        <span className="text-[12px] text-label-common_3">
                          ({review.product.reviewCount})
                        </span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TikTokReviewsSection;
