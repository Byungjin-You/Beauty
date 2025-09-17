'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doctorsData } from '../../../../data/doctors';
import Header from '../../../components/Header';
import Footer from '../../../../components/sections/Footer';
import TabNavigation from '../../../../components/common/TabNavigation';
import BeautyFilterModal from '../../../../components/common/BeautyFilterModal';

/**
 * 병원 후기 더보기 페이지 컴포넌트
 */
export default function HospitalReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('popular'); // popular, latest, ratingHigh, ratingLow
  const [showSortModal, setShowSortModal] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 281, left: 16 });
  const [showBeautyFilter, setShowBeautyFilter] = useState(false);

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
    { id: 'events', label: '이벤트', count: 13 },
    { id: 'reviews', label: '후기', count: 750, active: true },
    { id: 'doctors', label: '의사', count: 3 },
    { id: 'youtube', label: '유튜브', count: 243 }
  ];

  // 확장된 후기 데이터 (더 많은 후기들)
  const allReviews = [
    {
      id: 1,
      title: "가슴확대(보형물)",
      content: "진짜 평생 새가슴으로 살아서 그런가 큰 가슴에 대한 니즈가 진짜 극심했거든요. 키가 165라 여자치고 좀 키가 큰 편이고 옷스타일도 몸매 드러나는 옷 입는걸 좋아하는데 하체는 딱 좋은데 상체가 진짜 어린이였단말야... 수술은 하고싶은데, 그냥 가슴이 커지는게 아니라 '예쁘게' 커지는게 목표였던 터라 고민이 진짜 많았어요. 생각보다 가슴수술 한 친구들 얘기 들어봐도 그렇고 실제로 수술한 친구 가슴 보기도 해보고 만져보기도 해봤는데 내가 생각하는 그 봉긋한 느낌이 나오는경우는 못봤던것같고 수술이 생각보다 예쁘게 안된다..? 촉감도 의슴티가 딱 난다..? 뭔가 되게.. 입었을땐 예쁜데 벗었을땐 별로인거야 그래서 고민이 많았어 한번 수술하면 돌이키진 못하잖아 ㅋㅋ 그렇게 막 고민을 하다보니까 보형물쪽을 좀 꼼꼼하게 보게 되더라고 내가 원하는 봉긋한 느낌 내면서 최대한 볼륨감있게 예쁘게 수술, 혹시나 하는 문제가 생기면 바로 해결 가능, 볼륨감 있으면서도 촉감도 너무 의슴티 안나게..... 이렇게 알아보니까 모티바 풀이 딱 맞았고, 모티바 잘다루는 병원들로 상담 받아보고 ㅇㅇㅇ에서 최종적으로 수술했어!",
      rating: 5,
      username: "아이돌케이팝쏭",
      gender: "여자",
      beforeImage: "https://images.babitalk.com/reviews/blur/blur1.png",
      afterImages: [
        "https://images.babitalk.com/reviews/blur/blur1.png",
        "https://images.babitalk.com/reviews/blur/blur3.png"
      ],
      additionalImageCount: 4,
      date: "2025.07.02",
      helpfulCount: 125,
      treatmentType: "가슴성형",
      treatmentTime: "수술시기 선택안함",
      doctorName: "김기갑 원장",
      popularity: 10,
      procedureInfo: {
        name: "이름부터U&U-모티바",
        price: "11,500,000원",
        image: "https://images.babitalk.com/images/10670d8ab3da583cbef605021f64fca1/banner_img_1743907244.jpg"
      }
    },
    {
      id: 2,
      title: "가슴모양교정 가슴재수술",
      content: "재수술이라 병원 결정하는데 최선의 노력을 다했습니다.. 여러 곳 상담 다닌건 당연하구 공부 까지.. 내가 반 의사 됬던것 같아요ㅎㅎ 정말 신중하게 최종선택 한 병원이라는거 꼭 말해주고 싶습니다 결론은! 가슴은 처음부터 가슴 전문 병원에서 하라고 꼭 말해주고 싶어서 이 글을 쓰게 됩니다.. 나처럼 고생하는 이 없길 바래요.. 수술 실력은 물론이고, 수술 전 상담부터 후 관리까지 어느병원에 비교해도 빠지는거 없습니다 .. 제가 이미 다 체크하고 관리까지 받아 봤어요ㅎ 발품 팔고 예약 잡고도 수술 바로 전날 까지도 불안해서 다른 곳 상담 해 봤는데 유앤유에서 하길 최선이였겠다는걸 이제 확증합니다 . 다른것도 중요하겠지만 가슴수술은 의사기술이 가장 중요 하다고 생각합니다 전문가 중에 전문가같아요 kkk 대표원장님 존암도 어떻게 ..ㅎㅎ 진심으로 김기갑원장님께 감사합니다ㅋ",
      rating: 5,
      username: "csr8000",
      gender: "남자",
      beforeImage: "https://images.babitalk.com/reviews/blur/blur2.png",
      afterImages: [
        "https://images.babitalk.com/reviews/blur/blur3.png",
        "https://images.babitalk.com/reviews/blur/blur3.png"
      ],
      additionalImageCount: 3,
      date: "2024.12.23",
      helpfulCount: 98,
      treatmentType: "가슴재수술",
      treatmentTime: "2024년 7월 4일",
      doctorName: "김기갑 원장",
      popularity: 9,
      procedureInfo: {
        name: "유앤유 모티바 가슴재수술",
        price: "10,000,000원",
        image: "https://images.babitalk.com/images/b3a8c4cf2cf217a48b5971ff8d09116a/banner_img_1724749048.jpg"
      }
    },
    {
      id: 3,
      title: "가슴확대(보형물)",
      content: "1개월차 후기 써봅니당 지방에 머무르고 있어서 상담을 많이 갈수 없어가지고 최대한 카페랑 어플 찾아보면서 추렸어요! 세곳 상담다녔고 수술은 유앤유에서 했습니당ㅎㅎ 🍎유앤유에서 수술한 이유 가슴전문병원이라 가슴만 한다는 점에서 끌렸고 저는 강병권원장님께 상담받았는데 다른곳보다 제일 상담을 잘해주셨어요! 아마 강병권원장님께 수술받은분들은 제가 무슨말하는지 이해하실거 같아용ㅎㅎㅎ 원장님 상담만 40분정도 한거 같은데 ppt로 케이스 보여주시면서 이해하기 쉽게 설명해주셨어요! 여기는 보정브라도 1주일만하고 붕대도 안해서 이것도 너무좋고 수술하고나서도 원장님이 회복실에 오셔서 상태 체크 해주셨어요",
      rating: 5,
      username: "파김치러버",
      gender: "여자",
      beforeImage: "https://images.babitalk.com/reviews/blur/blur1.png",
      afterImages: [
        "https://images.babitalk.com/reviews/blur/blur3.png",
        "https://images.babitalk.com/reviews/blur/blur3.png"
      ],
      additionalImageCount: 1,
      date: "2024.11.23",
      helpfulCount: 87,
      treatmentType: "가슴성형",
      treatmentTime: "수술시기 선택안함",
      doctorName: "강병권 원장",
      popularity: 8,
      procedureInfo: {
        name: "U&U 유방검진도 끝판왕",
        price: "180,000원",
        image: "https://images.babitalk.com/images/f091f746fde9aae5c27a43f51556cd04/banner_img_1718332916.jpg"
      }
    }
  ];

  // 성별에 따른 프로필 이미지 반환 함수
  const getProfileImage = (gender) => {
    if (gender === "남자") {
      return "/images/profile-male.png";
    } else if (gender === "여자") {
      return "/images/profile-female.png";
    } else {
      return "/images/logo.svg"; // 기본 이미지
    }
  };

  // 정렬된 후기 데이터
  const getSortedReviews = () => {
    const sortedReviews = [...allReviews];
    
    switch (sortOrder) {
      case 'popular':
        return sortedReviews.sort((a, b) => b.popularity - a.popularity);
      case 'latest':
        return sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'ratingHigh':
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      case 'ratingLow':
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      default:
        return sortedReviews;
    }
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tabId) => {
    if (tabId === 'home') {
      window.location.href = `/hospital/${params.id}`;
    } else if (tabId === 'events') {
      window.location.href = `/hospital/${params.id}/events`;
    } else if (tabId === 'doctors') {
      window.location.href = `/hospital/${params.id}/doctors`;
    } else if (tabId === 'youtube') {
      window.location.href = `/hospital/${params.id}/youtube`;
    }
    // 다른 탭들은 현재 구현되지 않음
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    // 후기 더보기 페이지는 항상 병원 상세페이지로 돌아가기
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
            
            {/* 정렬 및 후기 섹션 */}
            <div>
              {/* 필터 및 정렬 영역 */}
              <div className="desktop:my-[32px] tablet:my-[24px] my-[16px]">
                <div className="flex flex-col gap-[16px]">
                  <div className="flex items-center gap-[8px]">
                    {/* 인기순 드롭다운 */}
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
                   sortOrder === 'latest' ? '최신순' :
                   sortOrder === 'ratingHigh' ? '별점 높은순' :
                   sortOrder === 'ratingLow' ? '별점 낮은순' : '인기순'}
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
                    <li 
                      className={`${sortOrder === 'ratingHigh' ? 'bg-background-common_2 text-label-common_5' : ''} flex flex-row items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer`}
                      onClick={() => handleSortSelect('ratingHigh')}
                    >
                      <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">별점 높은순</h6>
                      {sortOrder === 'ratingHigh' && (
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
                      className={`${sortOrder === 'ratingLow' ? 'bg-background-common_2 text-label-common_5' : ''} flex flex-row items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer`}
                      onClick={() => handleSortSelect('ratingLow')}
                    >
                      <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">별점 낮은순</h6>
                      {sortOrder === 'ratingLow' && (
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

                  </div>

                  {/* 후기 리스트 */}
                  <div className="flex flex-col gap-[32px]">
                    {getSortedReviews().map((review) => (
                      <div key={review.id} className="flex flex-col gap-[12px]">
                        {/* 프로필 영역 */}
                        <div>
                          <div className="flex items-center gap-[4px] py-[12px]">
                            <div 
                              className="w-[36px] h-[36px] rounded-[100%] mr-[4px] bg-background-thumbnail border border-outline-common_2"
                              style={{
                                backgroundImage: `url("${getProfileImage(review.gender)}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center'
                              }}
                            ></div>
                            <span className="leading-[150%] text-inherit text-sm font-semibold">
                              {review.username}
                            </span>
                            <p className="text-label-common_3 leading-[150%] text-inherit text-xs font-normal">
                              {review.date}
                            </p>
                          </div>

                          {/* 이미지 갤러리 */}
                          <div className="max-h-[234px] min-h-[206px] border border-outline-common_2 rounded-[16px] box-content">
                            <div className="desktop:h-[206px] tablet:h-[218px] h-[234px] rounded-[16px] overflow-hidden grid grid-cols-3 grid-rows-2 gap-[2px]">
                              {/* 큰 이미지 (전) */}
                              <figure className="col-span-2 row-span-2 relative w-full cursor-pointer h-full">
                                <img 
                                  src={review.beforeImage} 
                                  alt="review_thumbnail_0" 
                                  className="object-cover h-full w-full"
                                />
                                <figcaption 
                                  className="rounded-[16px_0px_16px_0px] absolute inset-0 w-full h-full flex justify-center items-center bg-container-common_5/70"
                                  style={{ width: '36px', height: '36px' }}
                                >
                                  <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">전</h6>
                                </figcaption>
                              </figure>

                              {/* 첫 번째 작은 이미지 (후) */}
                              <figure className="col-start-3 relative w-full cursor-pointer h-full">
                                <img 
                                  src={review.afterImages[0]} 
                                  alt="review_thumbnail_1" 
                                  className="object-cover h-full w-full"
                                />
                                <figcaption 
                                  className="rounded-[0px_0px_16px_0px] absolute inset-0 w-full h-full flex justify-center items-center bg-background-plasticSurgery_2"
                                  style={{ width: '28px', height: '28px' }}
                                >
                                  <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">후</h6>
                                </figcaption>
                              </figure>

                              {/* 두 번째 작은 이미지 (후) */}
                              <figure className="col-start-3 row-start-2 relative w-full cursor-pointer h-full">
                                <img 
                                  src={review.afterImages[1]} 
                                  alt="review_thumbnail_2" 
                                  className="object-cover h-full w-full"
                                />
                                <figcaption 
                                  className="rounded-[0px_0px_16px_0px] absolute inset-0 w-full h-full flex justify-center items-center bg-background-plasticSurgery_2"
                                  style={{ width: '28px', height: '28px' }}
                                >
                                  <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">후</h6>
                                </figcaption>
                                {review.additionalImageCount > 0 && (
                                  <figcaption className="rounded-br-[12px] bg-[#000]/50 absolute inset-0 flex items-center justify-center">
                                    <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">
                                      +{review.additionalImageCount}
                                    </h6>
                                  </figcaption>
                                )}
                              </figure>
                            </div>
                          </div>
                        </div>

                        {/* 시술 정보 카드 */}
                        <div className="flex items-center gap-[12px] p-[16px] bg-container-common_2 rounded-[16px] border border-outline-common_2 cursor-pointer">
                          <img 
                            className="w-[40px] h-[40px] object-cover rounded-[8px]" 
                            src={review.procedureInfo.image}
                            alt="procedure"
                          />
                          <div>
                            <h6 className="leading-[150%] text-inherit text-sm font-medium">
                              {review.procedureInfo.name}
                            </h6>
                            <div className="flex items-center gap-[4px] flex-wrap">
                              <span className="leading-[150%] text-inherit text-base font-semibold">
                                {review.procedureInfo.price}
                              </span>
                            </div>
                          </div>
                          <span 
                            translate="no" 
                            className="material-symbols-rounded text-label-common_3 !text-[16px] ml-auto" 
                            aria-hidden="true" 
                            style={{
                              fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24'
                            }}
                          >
                            arrow_forward_ios
                          </span>
                        </div>

                        {/* 후기 내용 */}
                        <div className="flex flex-col gap-[8px]">
                          <div>
                            <h4 className="line-clamp-1 leading-[150%] text-inherit text-base font-semibold">
                              {review.title}
                            </h4>
                            <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">
                              시술시기 {review.treatmentTime}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-start gap-0.5">
                            {[...Array(review.rating)].map((_, starIndex) => (
                              <img 
                                key={starIndex}
                                src="/images/reviews/ic_rating_active.svg" 
                                alt="ic_rating_active" 
                                className="w-4"
                              />
                            ))}
                          </div>
                          
                          <div>
                            <p className="line-clamp-1 leading-[150%] text-inherit text-sm font-normal">
                              {review.content}
                            </p>
                            <button onClick={() => window.location.href = `/hospital/${params.id}/reviews/${review.id}`}>
                              <p className="text-label-common_3 cursor-pointer leading-[150%] text-inherit text-[13px] font-medium">
                                ..더보기
                              </p>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 더보기 버튼 */}
                    <button className="w-full !gap-[4px] flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[8px] px-[12px] text-[14px] gap-[4px] border-[1.5px] bg-white border-outline-common_2 text-label-common_5" style={{ height: '40px' }}>
                      더보기
                      <span 
                        translate="no" 
                        className="material-symbols-rounded text-inherit" 
                        aria-hidden="true" 
                        style={{
                          fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                          fontSize: '16px',
                          visibility: 'visible'
                        }}
                      >
                        add
                      </span>
                    </button>
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

      {/* 뷰티고민 필터 모달 */}
      {showBeautyFilter && (
        <BeautyFilterModal 
          isOpen={showBeautyFilter}
          onClose={() => setShowBeautyFilter(false)}
        />
      )}

      {/* 푸터 */}
      <Footer />
    </div>
  );
}
