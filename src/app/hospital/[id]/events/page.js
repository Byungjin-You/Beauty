'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doctorsData } from '../../../../data/doctors';
import Header from '../../../components/Header';
import Footer from '../../../../components/sections/Footer';
import TabNavigation from '../../../../components/common/TabNavigation';

/**
 * 병원 이벤트 더보기 페이지 컴포넌트
 */
export default function HospitalEventsPage() {
  const params = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('popular'); // popular, review, lowPrice, highPrice, rating, latest
  const [showSortModal, setShowSortModal] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 281, left: 16 });

  // 병원 데이터 로드
  useEffect(() => {
    const hospitalId = parseInt(params.id);
    const hospitalData = doctorsData.find(doctor => doctor.id === hospitalId);
    
    if (hospitalData) {
      setHospital(hospitalData);
    }
    setLoading(false);
  }, [params.id]);

  // 탭 메뉴 데이터
  const tabs = [
    { id: 'home', label: '홈', count: null },
    { id: 'events', label: '이벤트', count: 13, active: true },
    { id: 'reviews', label: '후기', count: 750 },
    { id: 'doctors', label: '의사', count: 3 },
    { id: 'youtube', label: '유튜브', count: 243 }
  ];

  // 확장된 이벤트 데이터 (13개)
  const allEvents = [
    {
      id: 1,
      title: "UU 유앤유 가슴성형",
      description: "보정브라 1주/ 압박붕대 없음/ 불필요한 과정을 줄여 빠르고 편안하게!",
      price: "2,070,000원",
      discountRate: null,
      rating: 5.0,
      reviewCount: 2,
      image: "https://images.babitalk.com/images/3c5339119bd6d9142790d04c06d55566/banner_img_1736136308.jpg",
      popularity: 10
    },
    {
      id: 2,
      title: "유앤유 모티바 가슴재수술",
      description: "재수술도 첫수술 가격으로_이름부터 U&U Motiva 가슴재수술",
      price: "10,000,000원",
      discountRate: null,
      rating: 5.0,
      reviewCount: 4,
      image: "https://images.babitalk.com/images/b3a8c4cf2cf217a48b5971ff8d09116a/banner_img_1724749048.jpg",
      popularity: 9
    },
    {
      id: 3,
      title: "가슴성형후 가슴골 채우기",
      description: "인공진피+자가지방+HA필러로 재수술없이 I골 보완!",
      price: "1,000,000원",
      discountRate: null,
      rating: null,
      reviewCount: null,
      image: "https://images.babitalk.com/images/a154b00b1828ff607ad2c9d853926971/banner_img_1735611134.jpg",
      popularity: 8
    },
    {
      id: 4,
      title: "유앤유_플러스 지방흡입",
      description: "가슴성형과 함께 +플러스 지방흡입으로 볼륨 살리고! 지방 죽이고!",
      price: "390,000원",
      discountRate: "49%",
      rating: null,
      reviewCount: null,
      image: "https://images.babitalk.com/images/398fdde9645a8dd5bfecf759b5b864a8/banner_img_1624004679.jpg",
      popularity: 7
    },
    {
      id: 5,
      title: "이름부터U&U-모티바",
      description: "사용량 1위 병원 선정_유앤유 MOTIVA",
      price: "11,500,000원",
      discountRate: null,
      rating: 5.0,
      reviewCount: 9,
      image: "https://images.babitalk.com/images/10670d8ab3da583cbef605021f64fca1/banner_img_1743907244.jpg",
      popularity: 6
    },
    {
      id: 6,
      title: "U&U 상담당일 가슴성형",
      description: "해외 지방러들을 위한 U&U 상담 당일 가슴성형",
      price: "2,070,000원",
      discountRate: "49%",
      rating: 1.0,
      reviewCount: 1,
      image: "https://images.babitalk.com/images/b0710f0bd5d3b5452dfa9198dbf0535c/banner_img_1711082286.jpg",
      popularity: 5
    },
    {
      id: 7,
      title: "U&U 유방검진도 끝판왕",
      description: "유방암 검진 및 보형물 특화검진",
      price: "180,000원",
      discountRate: null,
      rating: 5.0,
      reviewCount: 31,
      image: "https://images.babitalk.com/images/f091f746fde9aae5c27a43f51556cd04/banner_img_1718332916.jpg",
      popularity: 4
    },
    {
      id: 8,
      title: "동일절개 가슴재수술",
      description: "추가흉터 없이 첫수술과 동일한 부위로 진행되는 가슴재수술",
      price: "10,000,000원",
      discountRate: null,
      rating: null,
      reviewCount: null,
      image: "https://images.babitalk.com/images/3a2a9a8098e93e7ad6949331f2b43db6/banner_img_1724751496.jpg",
      popularity: 3
    },
    {
      id: 9,
      title: "U&U 밑빠짐 재수술",
      description: "피막성형술을 통한 앞/옆/밑빠짐 재수술",
      price: "10,000,000원",
      discountRate: null,
      rating: 5.0,
      reviewCount: 1,
      image: "https://images.babitalk.com/images/2b72a2bd1f00c1054c436a131a230b28/banner_img_1724746003.jpg",
      popularity: 2
    },
    {
      id: 10,
      title: "D컵 자연풍만 가슴성형",
      description: "풍만하고 자연스러운 가슴 D컵부터 E컵까지",
      price: "2,070,000원",
      discountRate: null,
      rating: null,
      reviewCount: null,
      image: "https://images.babitalk.com/images/0ba470e32b969bf18e6ebc98c4716de7/banner_img_1731043340.jpg",
      popularity: 1
    },
    {
      id: 11,
      title: "U&U 보형물파열 재수술",
      description: "기존 보형물 제거와 정상적인 피막 형성을 위한 피막제거 등",
      price: "10,000,000원",
      discountRate: null,
      rating: null,
      reviewCount: null,
      image: "https://images.babitalk.com/images/8f3aa9dff07a63be6e49cf3de2836d3e/banner_img_1733207193.jpg",
      popularity: 10
    },
    {
      id: 12,
      title: "U&U 삼중평면 가슴성형",
      description: "현존하는 가슴성형의 장점만을 모아 불안요소를 잠재우다!",
      price: "2,070,000원",
      discountRate: null,
      rating: null,
      reviewCount: null,
      image: "https://images.babitalk.com/images/11b28a436494dbd63e58783583e88a7e/banner_img_1734505694.jpg",
      popularity: 9
    },
    {
      id: 13,
      title: "유앤유 시원한 가슴성형",
      description: "보정브라 1주/스포츠브라 2주/압박붕대 X",
      price: "2,070,000원",
      discountRate: null,
      rating: 5.0,
      reviewCount: 1,
      image: "https://images.babitalk.com/images/80594320e3c952a316db5f56c8079910/banner_img_1747274190.jpg",
      popularity: 8
    }
  ];

  // 정렬된 이벤트 데이터
  const getSortedEvents = () => {
    const sortedEvents = [...allEvents];
    
    switch (sortOrder) {
      case 'popular':
        return sortedEvents.sort((a, b) => b.popularity - a.popularity);
      case 'review':
        return sortedEvents.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      case 'lowPrice':
        return sortedEvents.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
      case 'highPrice':
        return sortedEvents.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        });
      case 'rating':
        return sortedEvents.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'latest':
        return sortedEvents.sort((a, b) => b.id - a.id);
      default:
        return sortedEvents;
    }
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tabId) => {
    if (tabId === 'home') {
      window.location.href = `/hospital/${params.id}`;
    } else if (tabId === 'reviews') {
      window.location.href = `/hospital/${params.id}/reviews`;
    } else if (tabId === 'doctors') {
      window.location.href = `/hospital/${params.id}/doctors`;
    } else if (tabId === 'youtube') {
      window.location.href = `/hospital/${params.id}/youtube`;
    }
    // 다른 탭들은 현재 구현되지 않음
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    // 이벤트 더보기 페이지는 항상 병원 상세페이지로 돌아가기
    window.location.href = `/hospital/${params.id}`;
  };

  // 정렬 옵션 선택
  const handleSortSelect = (order) => {
    setSortOrder(order);
    setShowSortModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">병원을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* 메인 컨텐츠 */}
      <div className="relative w-full desktop:px-[32px] tablet:px-[24px] px-[16px] tablet:pt-0 pt-14">
        
        {/* 상단 헤더 */}
        <div className="false flex flex-none items-center sticky top-0 desktop:ml-[-32px] tablet:ml-[-24px] ml-[-16px] w-screen max-w-[1024px] desktop:h-[72px] h-[56px] desktop:px-[32px] tablet:px-[24px] px-[16px] desktop:gap-[16px] gap-[12px] bg-background-common_1 z-10 transition">
          <span 
            onClick={handleGoBack}
            className="material-symbols-rounded text-icon-common_4 cursor-pointer" 
            style={{fontVariationSettings:"'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}
            aria-hidden="true"
          >
            arrow_back
          </span>
          <div className="grow shrink basis-0">
            <h3 className="text-label-common_5 leading-[150%] text-inherit text-lg font-semibold">
              유앤유성형외과의원
            </h3>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <TabNavigation
          tabs={tabs}
          onTabClick={handleTabClick}
          className="desktop:ml-[-32px] tablet:ml-[-24px] ml-[-16px]"
        />

        {/* 메인 컨텐츠 영역 */}
        <div className="">
          <div className="flex flex-col gap-[32px]">
            
            {/* 정렬 및 이벤트 섹션 */}
            <div>
              {/* 정렬 버튼 */}
              <div className="desktop:my-[32px] tablet:my-[24px] my-[16px]">
                <div className="flex flex-col gap-[16px]">
                  <div className="relative flex flex-none">
              <button 
                className="text-label-common_5 border-outline-common_2 h-[32px] px-[8px] inline-flex items-center gap-[2.5px] bg-background-common_1 border-[1.5px] rounded-lg"
                type="button"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDropdownPosition({ 
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.left + window.scrollX
                  });
                  setShowSortModal(!showSortModal);
                }}
              >
                <span className="material-symbols-rounded text-inherit" style={{
                  fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  color: 'rgb(49, 49, 66)',
                  fontSize: '16px'
                }}>swap_vert</span>
                <span className="leading-[150%] text-inherit text-sm font-semibold">
                  {sortOrder === 'popular' ? '인기순' : 
                   sortOrder === 'review' ? '후기 많은순' :
                   sortOrder === 'lowPrice' ? '저가순' :
                   sortOrder === 'highPrice' ? '고가순' :
                   sortOrder === 'rating' ? '별점 높은순' : '최신순'}
                </span>
              </button>

              {/* 정렬 드롭다운 */}
              {showSortModal && (
                <div 
                  id="filter" 
                  className="fixed z-50 rounded-lg p-1 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.12)] w-[132px] bg-background-common_1"
                  style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ul className="bg-white" aria-labelledby="filterDefaultButton">
                    <li 
                      className={`${sortOrder === 'popular' ? 'bg-background-common_2 text-label-common_5' : ''} flex flex-row items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer`}
                      onClick={() => handleSortSelect('popular')}
                    >
                      <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">인기순</h6>
                      {sortOrder === 'popular' && (
                        <span 
                          translate="no" 
                          className="material-symbols-rounded text-inherit" 
                          aria-hidden="true" 
                          style={{
                            fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                            fontSize: '16px'
                          }}
                        >
                          check
                        </span>
                      )}
                    </li>
                    <li 
                      className={`${sortOrder === 'review' ? 'bg-background-common_2 text-label-common_5' : ''} flex flex-row items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer`}
                      onClick={() => handleSortSelect('review')}
                    >
                      <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">후기 많은순</h6>
                      {sortOrder === 'review' && (
                        <span 
                          translate="no" 
                          className="material-symbols-rounded text-inherit" 
                          aria-hidden="true" 
                          style={{
                            fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                            fontSize: '16px'
                          }}
                        >
                          check
                        </span>
                      )}
                    </li>
                    <li 
                      className={`${sortOrder === 'lowPrice' ? 'bg-background-common_2 text-label-common_5' : ''} flex flex-row items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer`}
                      onClick={() => handleSortSelect('lowPrice')}
                    >
                      <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">저가순</h6>
                      {sortOrder === 'lowPrice' && (
                        <span 
                          translate="no" 
                          className="material-symbols-rounded text-inherit" 
                          aria-hidden="true" 
                          style={{
                            fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                            fontSize: '16px'
                          }}
                        >
                          check
                        </span>
                      )}
                    </li>
                    <li 
                      className={`${sortOrder === 'highPrice' ? 'bg-background-common_2 text-label-common_5' : ''} flex flex-row items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer`}
                      onClick={() => handleSortSelect('highPrice')}
                    >
                      <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">고가순</h6>
                      {sortOrder === 'highPrice' && (
                        <span 
                          translate="no" 
                          className="material-symbols-rounded text-inherit" 
                          aria-hidden="true" 
                          style={{
                            fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                            fontSize: '16px'
                          }}
                        >
                          check
                        </span>
                      )}
                    </li>
                    <li 
                      className={`${sortOrder === 'rating' ? 'bg-background-common_2 text-label-common_5' : ''} flex flex-row items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer`}
                      onClick={() => handleSortSelect('rating')}
                    >
                      <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">별점 높은순</h6>
                      {sortOrder === 'rating' && (
                        <span 
                          translate="no" 
                          className="material-symbols-rounded text-inherit" 
                          aria-hidden="true" 
                          style={{
                            fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                            fontSize: '16px'
                          }}
                        >
                          check
                        </span>
                      )}
                    </li>
                    <li 
                      className={`${sortOrder === 'latest' ? 'bg-background-common_2 text-label-common_5' : ''} flex flex-row items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer`}
                      onClick={() => handleSortSelect('latest')}
                    >
                      <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">최신순</h6>
                      {sortOrder === 'latest' && (
                        <span 
                          translate="no" 
                          className="material-symbols-rounded text-inherit" 
                          aria-hidden="true" 
                          style={{
                            fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                            fontSize: '16px'
                          }}
                        >
                          check
                        </span>
                      )}
                    </li>
                  </ul>
                </div>
              )}
            </div>

                  {/* 이벤트 리스트 */}
                  <div className="flex flex-col">
                    {getSortedEvents().map((event) => (
                      <div 
                        key={event.id}
                        className="relative w-full flex justify-start items-start gap-[12px] cursor-pointer py-[12px]"
                      >
                        <img 
                          alt="banner_image" 
                          className="bg-container-common_3 border border-outline-thumbnail rounded-[16px] flex-none w-[90px] h-[90px] object-cover" 
                          src={event.image}
                          style={{ color: 'transparent' }}
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
                              서울 압구정
                            </p>
                            <div className="w-px h-[12px] flex-none" style={{ background: 'rgb(217, 217, 217)' }}></div>
                            <p className="text-label-common_3 line-clamp-1 leading-[150%] text-inherit text-[13px] font-medium">
                              유앤유성형외과의원
                            </p>
                          </div>
                          <div className="flex justify-start items-center gap-[4px] flex-wrap">
                            <h3 className="text-label-common_5 leading-[150%] text-inherit text-lg font-semibold">
                              {event.price}
                            </h3>
                            {event.discountRate && (
                              <h3 className="text-label-plasticSurgery_2 leading-[150%] text-inherit text-lg font-semibold">
                                {event.discountRate}
                              </h3>
                            )}
                          </div>
                          {event.rating && event.reviewCount && (
                            <div className="flex items-center gap-[4px]">
                              <span className="material-symbols-rounded text-inherit" style={{
                                fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                                fontSize: '14px',
                                color: 'rgb(255, 188, 51)'
                              }}>star</span>
                              <h5 className="text-label-common_5 leading-[150%] text-inherit text-[13px] font-semibold">
                                {event.rating}
                              </h5>
                              <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">
                                ({event.reviewCount})
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 여백 */}
        <div className="desktop:my-[32px] tablet:my-[24px] my-[16px]"></div>

        {/* 하단 상담신청 버튼 */}
        <div className="sticky w-[100vw] max-w-[1024px] py-[10px] desktop:px-[32px] tablet:px-[24px] px-[16px] desktop:ml-[-32px] tablet:ml-[-24px] ml-[-16px] desktop:pb-[24px] bg-white bottom-0 grid gap-[12px] mt-[62px] bg-white" style={{bottom: '0px'}}>
          <div className="absolute top-[-30px] flex h-[30px] items-center justify-center gap-[8px] bg-background-plasticSurgery_1 w-[100vw] max-w-[1024px]">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.0552 5.48716C10.1881 5.12798 10.6961 5.12798 10.829 5.48716L11.489 7.27054C11.7675 8.02339 12.3611 8.61696 13.114 8.89553L14.8973 9.55544C15.2565 9.68835 15.2565 10.1964 14.8973 10.3293L13.1139 10.9892C12.3611 11.2678 11.7675 11.8614 11.489 12.6142L10.829 14.3976C10.6961 14.7568 10.1881 14.7568 10.0552 14.3976L9.39529 12.6142C9.11671 11.8614 8.52314 11.2678 7.7703 10.9892L5.98692 10.3293C5.62773 10.1964 5.62773 9.68835 5.98692 9.55544L7.7703 8.89553C8.52314 8.61696 9.11671 8.02339 9.39529 7.27054L10.0552 5.48716Z" fill="#604AFF"></path>
              <path d="M4.54623 1.62706C4.66415 1.23564 5.21838 1.23564 5.33629 1.62706L5.47036 2.07211C5.7364 2.95525 6.4274 3.64624 7.31054 3.91229L7.75559 4.04636C8.14701 4.16427 8.14701 4.7185 7.75559 4.83641L7.31054 4.97048C6.4274 5.23653 5.7364 5.92752 5.47036 6.81066L5.33629 7.25571C5.21838 7.64713 4.66415 7.64713 4.54623 7.25571L4.41217 6.81066C4.14612 5.92752 3.45512 5.23653 2.57198 4.97048L2.12694 4.83641C1.73552 4.7185 1.73552 4.16427 2.12694 4.04636L2.57198 3.91229C3.45512 3.64624 4.14612 2.95525 4.41217 2.0721L4.54623 1.62706Z" fill="#604AFF"></path>
            </svg>
            <p className="leading-[150%] text-inherit text-sm font-normal">
              <span className="text-label-plasticSurgery_2">
                <b className="text-inherit">2,786</b>명
              </span>
              이 상담 신청한 병원이에요!
            </p>
          </div>
          <button className="flex flex-none justify-center items-center font-semibold rounded-[12px] px-[20px] text-[16px] gap-[6px] bg-background-plasticSurgery_2 text-white h-[56px]">
            병원 상담신청
          </button>
        </div>
      </div>

      {/* 모달 배경 클릭시 닫기 */}
      {showSortModal && (
        <div 
          className="fixed inset-0 bg-transparent z-40"
          onClick={() => setShowSortModal(false)}
        />
      )}

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
