"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { banners } from "../../data/banners";

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoSlideIntervalRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const userScrollTimeoutRef = useRef(null);

  // 특정 인덱스로 스크롤하는 함수
  const scrollToIndex = useCallback((index, smooth = true) => {
    if (scrollContainerRef.current) {
      const slideWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: slideWidth * index,
        behavior: smooth ? 'smooth' : 'instant'
      });
    }
  }, []);

  // 자동 슬라이드 시작
  const startAutoSlide = useCallback(() => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
    }
    
    autoSlideIntervalRef.current = setInterval(() => {
      if (!isUserScrolling) {
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex === banners.length - 1 ? 0 : prevIndex + 1;
          return nextIndex;
        });
      }
    }, 5000);
  }, [isUserScrolling, banners.length]);

  // 자동 슬라이드 정지
  const stopAutoSlide = useCallback(() => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
  }, []);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    // 사용자가 스크롤 중임을 표시
    setIsUserScrolling(true);
    
    // 기존 타이머 클리어
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    // 스크롤 위치 기반으로 현재 인덱스 계산
    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const slideWidth = scrollContainerRef.current.clientWidth;
        const calculatedIndex = Math.round(scrollLeft / slideWidth);
        
        // 유효한 인덱스인지 확인
        if (calculatedIndex >= 0 && calculatedIndex < banners.length) {
          setCurrentIndex(calculatedIndex);
        }
      }
    }, 100);

    // 사용자 스크롤이 끝난 후 자동 슬라이드 재개
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1500);
  }, [banners.length]);

  // 마우스 이벤트 핸들러
  const handleMouseEnter = useCallback(() => {
    setIsUserScrolling(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
  }, []);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(() => {
    setIsUserScrolling(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000);
  }, []);

  // 자동 슬라이드 관리
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [startAutoSlide, stopAutoSlide]);

  // 인덱스 변경 시 스크롤 (자동 슬라이드용)
  useEffect(() => {
    if (!isUserScrolling) {
      scrollToIndex(currentIndex);
    }
  }, [currentIndex, isUserScrolling, scrollToIndex]);

  // 이벤트 리스너 등록
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleScroll, handleMouseEnter, handleMouseLeave, handleTouchStart, handleTouchEnd]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (autoSlideIntervalRef.current) {
        clearInterval(autoSlideIntervalRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative tablet:mx-[-24px] mx-[-16px]">
      {/* 스크롤 가능한 배너 컨테이너 */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-scroll scrollbar-hide scroll-smooth"
        style={{ 
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {banners.map((banner, index) => (
          <div 
            key={index}
            className="flex-shrink-0 w-full tablet:px-[24px] px-[16px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="block relative rounded-[16px] overflow-hidden cursor-pointer">
              {/* 화해와 동일한 59.25% 종횡비 */}
              <div style={{ paddingTop: '59.25925925925925%' }}>
                <img 
                  alt={`배너 이미지 ${index + 1}`}
                  className="w-full object-cover object-center absolute top-0 h-full" 
                  src={banner.image}
                  draggable="false"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 항상 플로팅되는 페이지네이션 */}
      <div 
        className="absolute bottom-4 right-8 tablet:right-12 inline-block w-auto rounded-full z-10"
        style={{
          background: 'rgba(0,0,0,.5)',
          paddingLeft: '6px',
          paddingRight: '6px',
          fontSize: '10px',
          fontWeight: '500',
          lineHeight: '150%',
          color: 'hsla(0,0%,100%,.7)'
        }}
      >
        {currentIndex + 1}/{banners.length}
      </div>
    </div>
  );
};

export default BannerSlider; 