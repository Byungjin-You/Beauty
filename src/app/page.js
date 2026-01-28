"use client";

import { useState, useEffect } from 'react';
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
import BeautyFilterModal from "../components/common/BeautyFilterModal";
import CategoryFilter from "../components/sections/CategoryFilter";
import RealPicksProductList from "../components/sections/RealPicksProductList";
import BeautyShortContentSection from "../components/sections/BeautyShortContentSection";

export default function Home() {
  const [showBeautyFilter, setShowBeautyFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);

  const handleCategoryChange = (categoryId, subcategoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
  };

  // 스크롤 감지
  useEffect(() => {
    const contentBody = document.getElementById('content-body');
    if (!contentBody) return;

    const handleScroll = () => {
      const scrollTop = contentBody.scrollTop;
      setIsScrolled(scrollTop > 60);
    };

    contentBody.addEventListener('scroll', handleScroll);
    return () => contentBody.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="desktop:bg-background-common_2 bg-background-common_1">
      <div className="flex items-start justify-center transition-opacity opacity-100">
        <div className="relative w-full max-w-[600px] md:mx-auto my-[0] min-h-screen mx-auto">

          {/* 헤더 */}
          <Header showSearchIcon={isScrolled} />

          {/* 메인 콘텐츠 */}
          <div
            id="content-body"
            className="flex flex-col desktop:h-[calc(100dvh-72px)] tablet:h-[calc(100dvh-56px)] h-[100dvh] desktop:rounded-t-[32px] bg-white overflow-auto scrollbar-hide desktop:border desktop:border-outline-thumbnail"
          >
            <div className="relative w-full desktop:px-[32px] tablet:px-[24px] px-[16px] pt-1">

              {/* 검색 섹션 */}
              <SearchSection hideSearchIcon={isScrolled} />

              {/* 배너 슬라이더 */}
              <BannerSlider />

              {/* 섹션들을 감싸는 컨테이너 */}
              <div className="flex flex-col desktop:gap-[40px] tablet:gap-[32px] gap-[24px]">

                {/* 뷰티 어워드 섹션 */}
                <AwardsSection />

                {/* The Real Picks 섹션 헤더 */}
                <div className="flex flex-col">
                  <div className="h-[56px] w-full flex justify-between items-center">
                    <h3 className="text-label-common_5 leading-[150%] text-lg font-semibold">
                      The Real Picks of Korean Users
                    </h3>
                    <a href="/ranking" className="flex ml-auto items-center gap-[8px]">
                      <h5 className="text-label-common_4 leading-[150%] text-inherit text-[13px] font-semibold">전체보기</h5>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-label-common_4">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </a>
                  </div>
                  {/* 카테고리 필터 */}
                  <CategoryFilter onCategoryChange={handleCategoryChange} />
                  {/* 제품 리스트 */}
                  <RealPicksProductList
                    categoryId={selectedCategory}
                    subcategoryId={selectedSubcategory}
                  />
                </div>

                {/* TikTok Reviews 섹션 */}
                <TikTokReviewsSection />

                {/* Beauty Short Content 섹션 */}
                <BeautyShortContentSection />

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


            </div>
          </div>


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
