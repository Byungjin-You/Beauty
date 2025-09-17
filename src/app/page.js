"use client";

import { useState } from 'react';
import Header from "./components/Header";
import SearchSection from "../components/sections/SearchSection";
import BannerSlider from "../components/sections/BannerSlider";
import AwardsSection from "../components/sections/AwardsSection";
import TikTokReviewsSection from "../components/sections/TikTokReviewsSection";
import TrendingRankingSection from "../components/sections/TrendingRankingSection";
import CustomerRankingSection from "../components/sections/CustomerRankingSection";
import SkinTypeRankingSection from "../components/sections/SkinTypeRankingSection";
import AgeRecommendationSection from "../components/sections/AgeRecommendationSection";
import TrendingBrandsSection from "../components/sections/TrendingBrandsSection";
import Footer from "../components/sections/Footer";
import BottomNavigation from "../components/sections/BottomNavigation";
import BeautyFilterModal from "../components/common/BeautyFilterModal";

export default function Home() {
  const [showBeautyFilter, setShowBeautyFilter] = useState(false);

  return (
    <div className="desktop:bg-background-common_2 bg-background-common_1">
      <div className="flex items-start justify-center transition-opacity opacity-100">
        <div className="relative w-full max-w-[600px] md:mx-auto my-[0] min-h-screen mx-auto">
          
          {/* 헤더 */}
          <Header />
          
          {/* 메인 콘텐츠 */}
          <div 
            id="content-body" 
            className="flex flex-col desktop:h-[calc(100dvh-72px)] tablet:h-[calc(100dvh-56px)] h-[100dvh] desktop:rounded-t-[32px] bg-white overflow-auto scrollbar-hide desktop:border desktop:border-outline-thumbnail"
          >
            <div className="relative w-full desktop:px-[32px] tablet:px-[24px] px-[16px] pt-4">
              
              {/* 검색 섹션 */}
              <SearchSection />
              
              {/* 배너 슬라이더 */}
              <BannerSlider />
              
              {/* 섹션들을 감싸는 컨테이너 */}
              <div className="flex flex-col desktop:gap-[40px] tablet:gap-[32px] gap-[24px]">
                
                {/* 뷰티 어워드 섹션 */}
                <AwardsSection />
                
                {/* TikTok Reviews 섹션 */}
                <TikTokReviewsSection />
                
                {/* 급상승 랭킹 섹션 */}
                <TrendingRankingSection />
                
                {/* 고객 선택 랭킹 섹션 */}
                <CustomerRankingSection 
                  onOpenBeautyFilter={() => setShowBeautyFilter(true)}
                />
                
                {/* 내 피부에 꼭 맞는 제품 랭킹 섹션 */}
                <SkinTypeRankingSection />
                
                {/* 나이대별 추천 섹션 */}
                <AgeRecommendationSection />
                
                {/* 요즘 뜨는 브랜드 섹션 */}
                <TrendingBrandsSection />
                
              </div>
              
              {/* 푸터를 콘텐츠 영역 안으로 이동 */}
              <div className="desktop:-mx-[32px] tablet:-mx-[24px] -mx-[16px]">
                <Footer />
              </div>
              
              {/* 하단 네비게이션을 위한 여백 (모바일/태블릿에서만) */}
              <div className="desktop:hidden h-[60px]"></div>
              
            </div>
          </div>
          
          {/* 하단 네비게이션 */}
          <BottomNavigation />
          
        </div>
      </div>

      {/* BeautyFilterModal - 이벤트 페이지와 동일한 위치 */}
      {showBeautyFilter && (
        <BeautyFilterModal 
          isOpen={showBeautyFilter}
          onClose={() => setShowBeautyFilter(false)}
        />
      )}
    </div>
  );
} 