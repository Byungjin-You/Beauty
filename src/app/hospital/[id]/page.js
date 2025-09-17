'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doctorsData } from '../../../data/doctors';
import Header from '../../components/Header';
import Footer from '../../../components/sections/Footer';
import TabNavigation from '../../../components/common/TabNavigation';

/**
 * 병원 상세페이지 컴포넌트
 */
export default function HospitalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isScheduleExpanded, setIsScheduleExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // 가상 이미지 슬라이더 데이터
  const sliderImages = [
    "https://images.babitalk.com/images/83c265a3af61f86712a0a8d6ff964311/etc_1696576015.jpg",
    "https://images.babitalk.com/images/37ab995453b9d87e80bdcd8661a1cab9/etc_1696576015.jpg",
    "https://images.babitalk.com/images/562b4c65e8377496c40f4a386f179cea/etc_1696576016.jpg",
    "https://images.babitalk.com/images/054ed85395498d93b18b9349a614a402/etc_1696576016.jpg",
    "https://images.babitalk.com/images/81000b3be1bdc0e98eb171e5b23d5adf/etc_1696576016.jpg",
    "https://images.babitalk.com/images/ea1756d969f63c9266e51c7f7f4b2938/etc_1696576016.jpg"
  ];

  // 병원 데이터 로드
  useEffect(() => {
    const hospitalId = parseInt(params.id);
    const hospitalData = doctorsData.find(doctor => doctor.id === hospitalId);
    
    if (hospitalData) {
      setHospital(hospitalData);
    }
    setLoading(false);
  }, [params.id]);

  // 자동 슬라이딩 (5초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => 
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  // 터치/스크롤 이벤트 핸들러
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart(touch.clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    setTouchEnd(touch.clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // 왼쪽으로 스와이프 - 다음 슬라이드
      setCurrentSlide(prev => 
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }
    if (isRightSwipe) {
      // 오른쪽으로 스와이프 - 이전 슬라이드
      setCurrentSlide(prev => 
        prev === 0 ? sliderImages.length - 1 : prev - 1
      );
    }

    setTouchStart(null);
    setTouchEnd(null);
  };



  // 이미지 모달 핸들러
  const handleImageClick = (index) => {
    setModalImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const goToNextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % sliderImages.length);
  };

  const goToPrevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  // 이벤트 데이터
  const hospitalEvents = [
    {
      id: 1,
      title: "유앤유 모티바 가슴재수술",
      description: "재수술도 첫수술 가격으로_이름부터 U&U Motiva 가슴재수술",
      price: "10,000,000원",
      rating: 5.0,
      reviewCount: 4,
      image: "https://images.babitalk.com/images/b3a8c4cf2cf217a48b5971ff8d09116a/banner_img_1724749048.jpg"
    },
    {
      id: 2,
      title: "UU 유앤유 가슴성형",
      description: "보정브라 1주/ 압박붕대 없음/ 불필요한 과정을 줄여 빠르고 편안하게!",
      price: "2,070,000원",
      rating: 5.0,
      reviewCount: 2,
      image: "https://images.babitalk.com/images/3c5339119bd6d9142790d04c06d55566/banner_img_1736136308.jpg"
    },
    {
      id: 3,
      title: "가슴성형후 가슴골 채우기",
      description: "인공진피+자가지방+HA필러로 재수술없이 I골 보완!",
      price: "1,000,000원",
      rating: null,
      reviewCount: null,
      image: "https://images.babitalk.com/images/a154b00b1828ff607ad2c9d853926971/banner_img_1735611134.jpg"
    },
    {
      id: 4,
      title: "눈성형 패키지",
      description: "쌍꺼풀+앞트임 패키지, 자연스럽고 아름다운 눈매 완성",
      price: "980,000원",
      rating: 4.8,
      reviewCount: 15,
      image: "https://images.babitalk.com/images/054ed85395498d93b18b9349a614a402/etc_1696576016.jpg"
    },
    {
      id: 5,
      title: "지방흡입 이벤트",
      description: "복부+허벅지 지방흡입, 매끈한 바디라인 완성",
      price: "2,500,000원",
      rating: 4.9,
      reviewCount: 8,
      image: "https://images.babitalk.com/images/81000b3be1bdc0e98eb171e5b23d5adf/etc_1696576016.jpg"
    }
  ];

  // 시술후기 데이터
  const hospitalReviews = [
    {
      id: 1,
      title: "가슴확대(보형물)",
      content: "진짜 평생 새가슴으로 살아서 그런가\n큰 가슴에 대한 니즈가 진짜 극심했거든\n내가 키가 165라 여자치고 좀 키가 큰 편이고\n옷스타일도 몸매 드러나는 옷 입는걸 좋아하는데\n하체는 딱 좋은데 상체가 진짜 어린이였단말야\n\n수술은 하고싶은데, 그냥 가슴이 커지는게 아니라\n\"예쁘게\" 커지는게 목표였던 터라 고민이 진짜 많았다?\n생각보다 가슴수술 한 친구들 얘기 들어봐도 그렇고\n실제로 수술한 친구 가슴 보기도 해보고 만져보기도 해봤는데\n내가 생각하는 그 봉긋한 느낌이 나오는경우는 못봤던것같고\n수술이 생각보다 예쁘게 안된다..? 촉감도 의슴티가 딱 난다..?\n뭔가 되게.. 입었을땐 예쁜데 벗었을땐 별로인거야\n그래서 고민이 많았어 한번 수술하면 돌이키진 못하잖아 ㅋㅋ\n\n그렇게 막 고민을 하다보니까\n보형물쪽을 좀 꼼꼼하게 보게 되더라고\n내가 원하는 봉긋한 느낌 내면서 최대한 볼륨감있게 예쁘게 수술,\n혹시나 하는 문제가 생기면 바로 해결 가능,\n볼륨감 있으면서도 촉감도 너무 의슴티 안나게.....\n이렇게 알아보니까 모티바 풀이 딱 맞았고,\n모티바 잘다루는 병원들로 상담 받아보고 ㅇㅇㅇ에서 최종적으로 수술했어!",
      rating: 5,
      beforeImage: "https://images.babitalk.com/reviews/blur/blur1.png"
    },
    {
      id: 2,
      title: "가슴모양교정 가슴재수술",
      content: "재수술이라 병원 결정하는데 최선의 노력을 다했습니다..\n 여러 곳 상담 다닌건 당연하구 공부 까지.. 내가 반 의사 됬던것 같아요ㅎㅎ\n정말 신중하게 최종선택 한 병원이라는거 꼭 말해주고 싶습니다\n\n결론은! 가슴은 처음부터 가슴 전문 병원에서 하라고 꼭 말해주고 싶어서 이 글을 쓰게 됩니다.. 나처럼 고생하는 이 없길 바래요..\n\n수술  실력은 물론이고,\n 수술 전 상담부터 후 관리까지 어느병원에 비교해도 빠지는거 없습니다 .. 제가 이미 다 체크하고 관리까지 받아 봤어요ㅎ\n\n발품 팔고 예약 잡고도 수술 바로 전날 까지도 불안해서 다른 곳 상담 해 봤는데\n  유앤유에서 하길 최선이였겠다는걸 이제 확증합니다 .\n\n다른것도 중요하겠지만 가슴수술은 의사기술이 가장 중요 하다고 생각합니다\n전문가 중에 전문가같아요 kkk 대표원장님\n존암도 어떻게 ..ㅎㅎ\n 진심으로 김기갑원장님께 감사합니다ㅋ",
      rating: 5,
      beforeImage: "https://images.babitalk.com/reviews/blur/blur2.png"
    },
    {
      id: 3,
      title: "가슴확대(보형물)",
      content: "1개월차 후기 써봅니당\n지방에 머무르고 있어서 상담을 많이 갈수 없어가지고 최대한 카페랑 어플 찾아보면서 추렸어요!\n세곳 상담다녔고 수술은 유앤유에서 했습니당ㅎㅎ\n\n🍎유앤유에서 수술한 이유\n가슴전문병원이라 가슴만 한다는 점에서 끌렸고 저는 강병권원장님께 상담받았는데 다른곳보다 제일 상담을 잘해주셨어요!\n아마 강병권원장님께 수술받은분들은 제가 무슨말하는지 이해하실거 같아용ㅎㅎㅎ\n원장님 상담만 40분정도 한거 같은데 ppt로 케이스 보여주시면서 이해하기 쉽게 설명해주셨어요!\n여기는 보정브라도 1주일만하고 붕대도 안해서 이것도 너무좋고 수술하고나서도 원장님이 회복실에 오셔서 상태 체크 해주셨어요\n그리고 병원자체가 엄청큰데 검진센터랑, 사후관리센터랑 다 나누어져 있어서 저는 예약금걸고 아예 검사까지 받고왔어요 ㅎㅎ\n유방검진만 따로 보시는 원장님도 계셔서 수술하기전 과정들이 너무 수월했어요! 뭔가 안심되는 마음도 들고???\n일주일차에 경과보고 사후관리도 해주시는데 여기는 물리치료랑 필라테스 해주거든요?????????이거 아주 좋아용ㅎㅎ",
      rating: 5,
      beforeImage: "https://images.babitalk.com/reviews/blur/blur1.png"
    },
    {
      id: 4,
      title: "코성형 후기",
      content: "수술 전 많이 고민했는데 결과가 정말 자연스럽게 나왔어요. 붓기도 생각보다 빨리 빠졌습니다.",
      rating: 5,
      beforeImage: "https://images.babitalk.com/reviews/blur/blur2.png"
    },
    {
      id: 5,
      title: "눈성형 후기",
      content: "쌍꺼풀 라인이 너무 예쁘게 나왔어요. 주변에서 자연스럽다고 칭찬 많이 받습니다.",
      rating: 5,
      beforeImage: "https://images.babitalk.com/reviews/blur/blur1.png"
    }
  ];

  // 의사정보 데이터
  const hospitalDoctors = [
    {
      id: 1,
      name: "김기갑 대표원장",
      title: "성형외과 전문의",
      hospital: "유앤유성형외과의원",
      image: "https://images.babitalk.com/doctor/1484/7d1968d3034ead34108bcc8d22fdfd65/face.jpeg",
      specialties: ["가슴"],
      reviewCount: 240,
      consultCount: 396,
      hasDoctorConsult: true
    },
    {
      id: 2,
      name: "서정화 원장",
      title: "성형외과 전문의",
      hospital: "유앤유성형외과의원",
      image: "https://images.babitalk.com/doctor/2359/8f497fa5baa64384b3c1e107e5e77695/face.jpeg",
      specialties: ["지방흡입/이식", "가슴", "기타성형"],
      reviewCount: 95,
      consultCount: 85,
      hasDoctorConsult: true
    },
    {
      id: 3,
      name: "이융기 원장",
      title: "성형외과 전문의",
      hospital: "유앤유성형외과의원",
      image: "https://images.babitalk.com/doctor/580/28a39aad846a5d9776104a0e57d34e92/face.jpeg",
      specialties: ["지방흡입/이식", "가슴"],
      reviewCount: 372,
      consultCount: 51,
      hasDoctorConsult: true
    },
    {
      id: 4,
      name: "강병권 원장",
      title: "성형외과 전문의",
      hospital: "유앤유성형외과의원",
      image: "https://images.babitalk.com/images/83c265a3af61f86712a0a8d6ff964311/etc_1696576015.jpg",
      specialties: ["가슴", "코성형"],
      reviewCount: 158,
      consultCount: 123,
      hasDoctorConsult: true
    }
  ];

  // 유튜브 영상 데이터
  const hospitalYoutubeVideos = [
    {
      id: 1,
      title: "하이브리드 가슴성형이란?",
      videoId: "ROzUoe-cDRM",
      embedUrl: "https://www.youtube.com/embed/ROzUoe-cDRM"
    },
    {
      id: 2,
      title: "가슴 촉감에 영향을 끼치는 요소 - 인부조직",
      videoId: "Gr7M4lFSUFQ",
      embedUrl: "https://www.youtube.com/embed/Gr7M4lFSUFQ"
    },
    {
      id: 3,
      title: "가슴 촉감에 영향을 끼치는 요소 - 피막",
      videoId: "xHbaEgvjJpo",
      embedUrl: "https://www.youtube.com/embed/xHbaEgvjJpo"
    },
    {
      id: 4,
      title: "모티바 가슴성형 전문병원",
      videoId: "dQw4w9WgXcQ",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
      id: 5,
      title: "가슴성형 수술 과정 및 회복",
      videoId: "abc123def456",
      embedUrl: "https://www.youtube.com/embed/abc123def456"
    }
  ];

  // 탭 메뉴 데이터
  const tabs = [
    { id: 'home', label: '홈', count: null },
    { id: 'events', label: '이벤트', count: hospitalEvents.length },
    { id: 'reviews', label: '후기', count: hospitalReviews.length },
    { id: 'doctors', label: '의사', count: hospitalDoctors.length },
    { id: 'youtube', label: '유튜브', count: hospitalYoutubeVideos.length }
  ];

  // 탭 클릭 핸들러
  const handleTabClick = (tabId) => {
    if (tabId === 'events') {
      window.location.href = `/hospital/${params.id}/events`;
    } else if (tabId === 'reviews') {
      window.location.href = `/hospital/${params.id}/reviews`;
    } else if (tabId === 'doctors') {
      window.location.href = `/hospital/${params.id}/doctors`;
    } else if (tabId === 'youtube') {
      window.location.href = `/hospital/${params.id}/youtube`;
    } else {
      setActiveTab(tabId);
    }
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    // 새 창에서 열렸거나 히스토리가 없는 경우 창 닫기
    if (window.opener || window.history.length <= 1) {
      window.close();
    } else {
      // 일반적인 경우 병원 리스트로 이동
      router.push('/doctors');
    }
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
          >
            arrow_back
          </span>
          <div className="grow shrink basis-0">
            <h3 className="text-label-common_5 leading-[150%] text-inherit text-lg font-semibold">
              {hospital.name}
            </h3>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          className="desktop:ml-[-32px] tablet:ml-[-24px] ml-[-16px]"
        />

        {/* 메인 컨텐츠 영역 */}
        <div className="">
          <div className="flex flex-col gap-[32px]">
            
            {/* 이미지 슬라이더 */}
            <div>
              <div className="w-[100vw] max-w-[1024px] desktop:ml-[-32px] tablet:ml-[-24px] ml-[-16px]">
                <div 
                  className="relative overflow-hidden cursor-grab active:cursor-grabbing" 
                  style={{ height: '340px' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {sliderImages.map((image, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 relative"
                        style={{ height: '340px' }}
                      >
                        <img
                          src={image}
                          alt={`병원 이미지 ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => handleImageClick(index)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm absolute top-0 left-0"
                          style={{ display: 'none' }}
                        >
                          이미지를 불러올 수 없습니다
                        </div>
                      </div>
                    ))}
                  </div>


                  {/* 바비톡과 완전히 동일한 페이지네이션 */}
                  <div 
                    className="absolute bottom-2 right-2 inline-block w-auto rounded-full"
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
                    {currentSlide + 1}/{sliderImages.length}
                  </div>

                </div>
              </div>

              {/* 병원 기본 정보 */}
              <div className="desktop:mt-[32px] tablet:mt-[24px] mt-[16px] flex flex-col gap-[6px]">
                <div className="flex flex-col gap-[2px]">
                  <h3 className="leading-[150%] text-inherit text-lg font-semibold">{hospital.name}</h3>
                  <div className="flex items-center gap-[6px]">
                    <p className="leading-[150%] text-inherit text-[13px] font-medium">성형외과</p>
                    <div className="w-px h-3 bg-[#d9d9d9]"></div>
                    <p className="leading-[150%] text-inherit text-[13px] font-medium">{hospital.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-[4px]">
                  <span className="material-symbols-rounded text-inherit" style={{
                    fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    fontSize: '16px',
                    color: 'rgb(255, 188, 51)'
                  }}>star</span>
                  <p className="leading-[150%] text-inherit text-[13px] font-medium">{hospital.rating}</p>
                  <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">({hospital.reviewCount})</p>
                </div>
                <div className="flex gap-[4px] flex-wrap">
                  {hospital.specialties.map((specialty, index) => (
                    <div key={index} className="inline-flex items-center gap-0.5 rounded border border-solid h-[20px] px-[5px] h-[24px] px-[6px] bg-container-plasticSurgery_1 border-none text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-plasticSurgery_2">
                      <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">{specialty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 병원 상세 정보 */}
              <div className="my-[24px] flex flex-col gap-[20px]">
                {/* 운영시간 */}
                <div className="flex gap-[8px] size-fit">
                  <div className="flex items-center justify-center w-[18px] h-[18px]">
                    <span className="material-symbols-rounded text-label-common_3 mt-[2px] flex flex-none" style={{
                      fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                      fontSize: '16px'
                    }}>schedule</span>
                  </div>
                  <div 
                    className="whitespace-pre-wrap cursor-pointer flex-1"
                    onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
                  >
                    <div className="leading-[150%] text-inherit text-sm font-normal">
                      <div className="flex flex-col gap-[8px]">
                        {!isScheduleExpanded ? (
                          <div className="flex gap-[4px]">
                            <span>월~금</span>
                            <span>10:00~19:00</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex gap-[4px]">
                              <span>월</span>
                              <span>10:00~19:00</span>
                            </div>
                            <div className="flex gap-[4px]">
                              <span>화</span>
                              <span>10:00~19:00</span>
                            </div>
                            <div className="flex gap-[4px]">
                              <span>수</span>
                              <span>10:00~19:00</span>
                            </div>
                            <div className="flex gap-[4px]">
                              <span>목</span>
                              <span>10:00~19:00</span>
                            </div>
                            <div className="flex gap-[4px]">
                              <span>금</span>
                              <span>10:00~21:00</span>
                            </div>
                            <div className="flex gap-[4px]">
                              <span>토</span>
                              <span>10:00~16:00</span>
                            </div>
                            <div className="flex gap-[4px]">
                              <span>일</span>
                              <span>진료시간 문의 필요</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <span 
                    className="material-symbols-rounded cursor-pointer mt-auto ml-auto text-label-common_4" 
                    style={{
                      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                      fontSize: '18px'
                    }}
                    onClick={() => setIsScheduleExpanded(!isScheduleExpanded)}
                  >
                    {isScheduleExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                  </span>
                </div>

                {/* 주소 정보 */}
                <div className="flex flex-col gap-[8px]">
                  <div className="flex gap-[8px]">
                    <div className="flex items-center justify-center w-[18px] h-[18px]">
                      <span className="material-symbols-rounded text-label-common_3 mt-[2px] flex flex-none" style={{
                        fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        fontSize: '16px'
                      }}>location_on</span>
                    </div>
                    <div className="whitespace-pre-wrap false">
                      <div className="leading-[150%] text-inherit text-sm font-normal">
                        <div className="flex flex-col gap-[8px]">
                          <div className="leading-[150%] text-inherit text-sm font-normal">{hospital.address}</div>
                          <div className="flex gap-[8px]">
                            <div className="inline-flex items-center gap-0.5 rounded border border-solid h-[24px] px-[6px] border-outline-common_2 text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-common_5 cursor-pointer">
                              <span className="text-inherit leading-[150%] text-inherit text-xs font-semibold">주소복사</span>
                            </div>
                            <div className="inline-flex items-center gap-0.5 rounded border border-solid h-[24px] px-[6px] border-outline-common_2 text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-common_5 cursor-pointer">
                              <span className="text-inherit leading-[150%] text-inherit text-xs font-semibold">지도보기</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 병원 소개 */}
                <div className="flex gap-[8px]">
                  <div className="flex items-center justify-center w-[18px] h-[18px]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-[15px] h-[15px] text-label-common_3">
                      <path fill="currentColor" fillRule="evenodd" d="M10 1.667C4.937 1.667.833 4.902.833 8.894c0 2.581 1.716 4.848 4.297 6.124l-.006.02c-.154.534-.897 3.098-.926 3.302 0 0-.019.155.082.215a.28.28 0 0 0 .218.013c.277-.04 3.091-2.006 3.796-2.5l.082-.056q.808.111 1.624.11c5.063 0 9.167-3.236 9.167-7.228S15.063 1.667 10 1.667" clipRule="evenodd" opacity="0.9"></path>
                    </svg>
                  </div>
                  <div 
                    className="whitespace-pre-wrap cursor-pointer flex-1"
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  >
                    <div 
                      className={`leading-[150%] text-inherit text-sm font-normal transition-all duration-300 ${
                        !isDescriptionExpanded 
                          ? 'line-clamp-2 overflow-hidden' 
                          : ''
                      }`}
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: !isDescriptionExpanded ? 2 : 'none'
                      }}
                    >
                      "환자가 편한 병원"{'\n'}
                      "수술후에 더욱 소중하게"{'\n'}
                      언택트진료, 1인회복실보장{'\n'}
                      {isDescriptionExpanded && (
                        <>
                          {'\n'}
                          저희 병원은 환자 중심의 의료 서비스를 제공합니다. 최신 의료 장비와 풍부한 경험을 바탕으로 안전하고 만족스러운 결과를 위해 최선을 다하고 있습니다.{'\n'}
                          {'\n'}
                          또한 수술 후 관리에도 특별한 관심을 기울여 환자분들이 빠르고 건강하게 회복할 수 있도록 도와드립니다. 1인 회복실과 언택트 진료 시스템을 통해 더욱 편리하고 안전한 의료 서비스를 경험하실 수 있습니다.
                        </>
                      )}
                    </div>
                  </div>
                  <span 
                    className="material-symbols-rounded cursor-pointer mt-auto ml-auto text-label-common_4" 
                    style={{
                      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                      fontSize: '18px'
                    }}
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  >
                    {isDescriptionExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                  </span>
                </div>
              </div>

              {/* 특징 아이콘들 */}
              <div className="my-[12px] flex gap-[30px] overflow-x-auto scrollbar-hide">
                <div className="flex flex-col gap-[6px] justify-center items-center flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="32" fill="none">
                    <path fill="#F1F1F4" stroke="#C8C7CF" strokeWidth="1.4" d="M14.781 30.29a3.7 3.7 0 0 0 1.812-.637l6.738-4.618h.001a7.29 7.29 0 0 0 3.174-6.02V6.807a.457.457 0 0 0-.403-.455l.083-.695c-1.33-.16-3.299-.5-5.178-1.22A19.7 19.7 0 0 1 15.86 1.47zm0 0h-.271a3.7 3.7 0 0 1-2.083-.647l-6.738-4.618h-.001a7.29 7.29 0 0 1-3.174-6.02V6.807c0-.227.177-.427.404-.455 1.346-.163 3.39-.512 5.344-1.26l.003-.002a20.4 20.4 0 0 0 5.332-3.074l.006-.005c.247-.201.568-.312.907-.312.33 0 .657.115.915.318z"></path>
                    <path fill="#C8C7CF" d="M14.51 2c.19 0 .46.04.73.26a20.2 20.2 0 0 0 5.408 3.118c1.98.76 4.039 1.12 5.418 1.28.08 0 .14.07.14.15v12.201c0 2.31-1.14 4.469-3.039 5.778l-6.738 4.619c-.57.39-1.23.59-1.909.59-.68 0-1.35-.21-1.91-.59l-6.737-4.619a6.98 6.98 0 0 1-3.04-5.778V6.808c0-.08.06-.14.14-.15 1.38-.16 3.44-.52 5.419-1.28 1.93-.74 3.749-1.79 5.408-3.119.27-.21.54-.26.73-.26m0-1.999c-.7 0-1.4.23-1.98.69-1.159.93-2.808 2.02-4.888 2.819-1.73.67-3.569 1-4.938 1.16-1.1.13-1.91 1.05-1.91 2.139v12.201a9 9 0 0 0 3.91 7.428l6.737 4.618c.92.63 1.98.94 3.04.94 1.059 0 2.128-.31 3.038-.94l6.738-4.618a9 9 0 0 0 3.909-7.428V6.808c0-1.09-.81-2.01-1.9-2.14-1.36-.16-3.209-.5-4.938-1.16-2.07-.799-3.719-1.889-4.889-2.818A3.18 3.18 0 0 0 14.48 0z"></path>
                    <path fill="#604AFF" d="M20.508 13.666H16.55V9.707h-4.078v3.959H8.512v4.089h3.959v3.948h4.078v-3.948h3.96z"></path>
                  </svg>
                  <p className="leading-[150%] text-inherit text-xs font-normal">전문의 {hospital.doctorCount}명</p>
                </div>
                
                <div className="flex flex-col gap-[6px] justify-center items-center flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" fill="none">
                    <path stroke="#7E7E8F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.35 26.373V32M28.65 26.373V32"></path>
                    <path fill="#ECECEF" d="M24.31 0H7.69C5.416 0 3.574 1.956 3.574 4.37v15.9c0 2.413 1.842 4.37 4.114 4.37h16.622c2.272 0 4.114-1.957 4.114-4.37V4.37c0-2.414-1.842-4.37-4.114-4.37"></path>
                    <path fill="#604AFF" d="M21.354 9.19H10.643c-1.01 0-1.829.87-1.829 1.943v5.55c0 1.072.819 1.941 1.829 1.941h10.71c1.01 0 1.83-.87 1.83-1.942v-5.55c0-1.072-.82-1.941-1.83-1.941"></path>
                    <path fill="#C8C7CF" d="M29.623 13.973H2.377C1.064 13.973 0 15.103 0 16.498v9.428c0 1.395 1.064 2.525 2.377 2.525h27.246c1.313 0 2.377-1.13 2.377-2.525v-9.428c0-1.395-1.064-2.525-2.377-2.525"></path>
                  </svg>
                  <p className="leading-[150%] text-inherit text-xs font-normal">전담회복실</p>
                </div>

                <div className="flex flex-col gap-[6px] justify-center items-center flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none">
                    <path fill="#C8C7CF" d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16"></path>
                    <path fill="#F1F1F4" d="M16 29.586c7.504 0 13.587-6.082 13.587-13.586 0-7.503-6.083-13.586-13.586-13.586S2.414 8.497 2.414 16s6.083 13.586 13.587 13.586"></path>
                    <path fill="#604AFF" d="M11.054 8.361h6.738c3.543 0 5.86 2.231 5.86 5.554s-2.386 5.514-5.993 5.514h-2.45v4.768h-4.155zm5.773 7.831c1.577 0 2.473-.873 2.473-2.277 0-1.403-.896-2.23-2.473-2.23H15.21v4.507z"></path>
                  </svg>
                  <p className="leading-[150%] text-inherit text-xs font-normal">주차가능</p>
                </div>

                <div className="flex flex-col gap-[6px] justify-center items-center flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="33" height="29" fill="none">
                    <path stroke="#A3A3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m17.89 16.936 5.639 6.61h7.793M31.322 19.906v7.288"></path>
                    <path fill="#604AFF" d="m2.807 9.056 2.941-.68 2.197 9.514-2.941.679a2.365 2.365 0 0 1-2.84-1.775l-1.13-4.889a2.365 2.365 0 0 1 1.776-2.84z"></path>
                    <path fill="#ECECEF" d="M27.02 1.35 5.372 6.345a2.417 2.417 0 0 0-1.81 2.899L5.6 18.077A2.417 2.417 0 0 0 8.5 19.888l21.645-4.997a2.417 2.417 0 0 0 1.811-2.899L29.917 3.16a2.417 2.417 0 0 0-2.898-1.81"></path>
                    <path fill="#604AFF" d="M7.224 10.288a.97.97 0 1 0 0-1.941.97.97 0 0 0 0 1.941"></path>
                    <path fill="#DADADF" d="m5.037 15.646 26.355-6.085.56 2.43a2.417 2.417 0 0 1-1.81 2.899L8.496 19.887a2.417 2.417 0 0 1-2.898-1.81z"></path>
                  </svg>
                  <p className="leading-[150%] text-inherit text-xs font-normal">CCTV설치</p>
                </div>
              </div>
            </div>

            {/* 탭별 컨텐츠 */}
            {activeTab === 'home' && (
              <>
                {/* 이벤트 섹션 */}
                <div>
                  <div className="h-[56px] w-full flex justify-start items-center gap-[8px]">
                    <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">이벤트</h3>
                  </div>
                  <div className="flex flex-col">
                    {/* 이벤트 아이템들 (최대 3개) */}
                    {hospitalEvents.slice(0, 3).map((event, index) => (
                      <div key={event.id}>
                        <div className="relative w-full flex justify-start items-start gap-[12px] cursor-pointer py-[12px]">
                          <img 
                            alt="banner_image" 
                            className="bg-container-common_3 border border-outline-thumbnail rounded-[16px] flex-none w-[90px] h-[90px] object-cover" 
                            src={event.image}
                            style={{ color: 'transparent' }}
                          />
                          <div className="flex self-stretch flex-col justify-start items-start gap-[2px] w-full gap-[2px]">
                            <div className="flex self-stretch flex-col justify-start items-start gap-[2px]">
                              <div className="w-full flex gap-[2px] items-center">
                                <h4 className="text-label-common_5 line-clamp-1 leading-[150%] text-inherit text-base font-semibold">{event.title}</h4>
                              </div>
                              <p className="text-label-common_3 line-clamp-1 leading-[150%] text-inherit text-[13px] font-medium">{event.description}</p>
                            </div>
                            <div className="flex justify-start items-center gap-[6px]">
                              <p className="text-label-common_3 flex-none leading-[150%] text-inherit text-[13px] font-medium">{hospital.location}</p>
                              <div className="w-px h-[12px] flex-none" style={{ background: 'rgb(217, 217, 217)' }}></div>
                              <p className="text-label-common_3 line-clamp-1 leading-[150%] text-inherit text-[13px] font-medium">{hospital.name}</p>
                            </div>
                            <div className="flex justify-start items-center gap-[4px] flex-wrap">
                              <h3 className="text-label-common_5 leading-[150%] text-inherit text-lg font-semibold">{event.price}</h3>
                            </div>
                            {event.rating && event.reviewCount && (
                              <div className="flex items-center gap-[4px]">
                                <span className="material-symbols-rounded text-inherit" style={{
                                  fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                                  fontSize: '14px',
                                  color: 'rgb(255, 188, 51)'
                                }}>star</span>
                                <h5 className="text-label-common_5 leading-[150%] text-inherit text-[13px] font-semibold">{event.rating}</h5>
                                <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">({event.reviewCount})</p>
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                    
                    <div className="h-[12px]"></div>
                    <button 
                      className="w-full flex flex-none justify-center items-center font-semibold rounded-[8px] px-[12px] text-[14px] gap-[4px] border-[1.5px] bg-white border-outline-common_2 text-label-common_5 h-[40px]"
                      onClick={() => window.location.href = `/hospital/${params.id}/events`}
                    >
                      더보기
                      <span className="text-label-common_4 leading-[150%] text-inherit text-xs font-semibold">({hospitalEvents.length})</span>
                      <span className="material-symbols-rounded text-label-common_4" style={{
                        fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        fontSize: '16px'
                      }}>arrow_forward_ios</span>
                    </button>
                  </div>
                </div>

                {/* 시술후기 섹션 */}
                <div>
                  <div className="h-[56px] w-full flex justify-start items-center gap-[8px]">
                    <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">시술후기</h3>
                  </div>
                  <div className="flex flex-col">
                    {/* 평점 요약 */}
                    <div className="flex gap-[4px] items-center py-[12px]">
                      <span className="material-symbols-rounded text-inherit" style={{
                        fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        fontSize: '24px',
                        color: 'rgb(255, 188, 51)'
                      }}>star</span>
                      <h1 className="leading-[150%] text-inherit text-2xl font-semibold">{hospital.rating}</h1>
                      <h5 className="leading-[150%] text-inherit text-[13px] font-semibold">({hospitalReviews.length})</h5>
                    </div>
                    
                    {/* 후기 아이템들 (최대 3개) */}
                    {hospitalReviews.slice(0, 3).map((review, index) => (
                      <div key={review.id}>
                        <div className="flex gap-[12px] cursor-pointer py-[12px]">
                          <div className="w-[90px] h-[90px] bg-white rounded-[16px] border border-[#ececef] flex justify-start items-start overflow-hidden flex-none relative">
                            <img 
                              className="w-full h-full bg-background-thumbnail" 
                              src={review.beforeImage}
                              alt="review_image"
                            />
                            <figcaption className="absolute w-[28px] h-[28px] rounded-[16px_0px_16px_0px] flex justify-center items-center bg-[rgba(49,49,66,0.70)]">
                              <h6 className="text-white leading-[150%] text-inherit text-sm font-medium">전</h6>
                            </figcaption>
                          </div>
                          <div className="flex flex-col gap-[8px]">
                            <h4 className="line-clamp-1 leading-[150%] text-inherit text-base font-semibold">{review.title}</h4>
                            <div className="flex items-center justify-start gap-0.5">
                              {[...Array(review.rating)].map((_, starIndex) => (
                                <img 
                                  key={starIndex}
                                  src="/images/reviews/ic_rating_active.svg" 
                                  alt="ic_rating_active" 
                                  className="w-3"
                                />
                              ))}
                            </div>
                            <div className="flex flex-col">
                              <p className="tablet:line-clamp-1 line-clamp-2 leading-[150%] text-inherit text-xs font-normal">
                                {review.content}
                              </p>
                              <p className="text-label-common_4 leading-[150%] text-inherit text-[11px] font-medium">..더보기</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                    
                    <div className="h-[12px]"></div>
                    <button 
                      className="w-full flex flex-none justify-center items-center font-semibold rounded-[8px] px-[12px] text-[14px] gap-[4px] border-[1.5px] bg-white border-outline-common_2 text-label-common_5 h-[40px]"
                      onClick={() => window.location.href = `/hospital/${params.id}/reviews`}
                    >
                      더보기
                      <span className="text-label-common_4 leading-[150%] text-inherit text-xs font-semibold">({hospitalReviews.length})</span>
                      <span className="material-symbols-rounded text-label-common_4" style={{
                        fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        fontSize: '16px'
                      }}>arrow_forward_ios</span>
                    </button>
                  </div>
                </div>

                {/* 의사정보 섹션 */}
                <div>
                  <div className="h-[56px] w-full flex justify-start items-center gap-[8px]">
                    <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">의사정보</h3>
                  </div>
                  <div className="flex flex-col">
                    {/* 의사 아이템들 (최대 3개) */}
                    {hospitalDoctors.slice(0, 3).map((doctor, index) => (
                      <div key={doctor.id}>
                        <div className="w-full justify-start items-start gap-[12px] inline-flex cursor-pointer py-[12px]">
                          <img 
                            className="w-[90px] h-[90px] relative flex-none rounded-full overflow-hidden border border-outline-thumbnail object-cover" 
                            src={doctor.image}
                            alt="doctor_image"
                          />
                          <div className="grow shrink basis-0 flex flex-col justify-start items-start gap-[6px]">
                            <div className="self-stretch flex flex-col justify-start items-start gap-[2px]">
                              <h4 className="leading-[150%] text-inherit text-base font-semibold">{doctor.name}</h4>
                              <p className="leading-[150%] text-inherit text-[13px] font-medium">{doctor.title}</p>
                              <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">{doctor.hospital}</p>
                            </div>
                            <div className="flex self-stretch justify-start items-start gap-[4px]">
                              {doctor.specialties.map((specialty, specIndex) => (
                                <div key={specIndex} className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] bg-container-common_2 border-none text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-common_5 !text-label-common_3">
                                  <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">{specialty}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-[6px]">
                              <div className="flex items-center gap-[4px]">
                                <p className="text-label-common_4 leading-[150%] text-inherit text-[11px] font-medium">시술후기</p>
                                <p className="leading-[150%] text-inherit text-[11px] font-medium">{doctor.reviewCount}</p>
                              </div>
                              <div className="w-[1px] h-[12px] bg-[#dadadf]"></div>
                              <div className="flex items-center gap-[4px]">
                                <p className="text-label-common_4 leading-[150%] text-inherit text-[11px] font-medium">상담</p>
                                <p className="leading-[150%] text-inherit text-[11px] font-medium">{doctor.consultCount}</p>
                              </div>
                            </div>
                            {doctor.hasDoctorConsult && (
                              <div className="flex gap-[4px]">
                                <div className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] border-outline-common_2 text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-common_5">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none">
                                    <path fill="currentColor" d="M4.78 6.176a1.64 1.64 0 0 0 1.641-1.64c0-.904-.758-1.597-1.642-1.597-.888 0-1.65.704-1.645 1.604a1.64 1.64 0 0 0 1.645 1.633m4.252.236a.45.45 0 0 0 .362-.184l1.838-2.589a.5.5 0 0 0 .101-.25c0-.185-.183-.31-.374-.31-.123 0-.237.066-.322.188L9.016 5.612l-.754-.867a.38.38 0 0 0-.318-.155c-.2 0-.358.148-.358.329q.001.133.106.25l.961 1.059c.11.125.228.184.379.184M2.238 9.605h5.075c.672 0 .904-.184.904-.523 0-.948-1.328-2.253-3.442-2.253-2.11 0-3.442 1.305-3.442 2.253 0 .339.233.523.905.523"></path>
                                  </svg>
                                  <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">의사상담</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="h-[12px]"></div>
                    <button 
                      className="w-full flex flex-none justify-center items-center font-semibold rounded-[8px] px-[12px] text-[14px] gap-[4px] border-[1.5px] bg-white border-outline-common_2 text-label-common_5 h-[40px]"
                      onClick={() => window.location.href = `/hospital/${params.id}/doctors`}
                    >
                      더보기
                      <span className="text-label-common_4 leading-[150%] text-inherit text-xs font-semibold">({hospitalDoctors.length})</span>
                      <span className="material-symbols-rounded text-label-common_4" style={{
                        fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        fontSize: '16px'
                      }}>arrow_forward_ios</span>
                    </button>
                  </div>
                </div>

                {/* 공식 유튜브 섹션 */}
                <div>
                  <div className="h-[56px] w-full flex justify-start items-center gap-[8px]">
                    <h3 className="text-label-common_5 flex items-center gap-[10px] leading-[150%] text-inherit text-lg font-semibold">공식 유튜브</h3>
                  </div>
                  <div className="flex flex-col gap-[16px]">
                    {/* 유튜브 영상들 (최대 3개) */}
                    {hospitalYoutubeVideos.slice(0, 3).map((video, index) => (
                      <div key={video.id} className="flex desktop:flex-nowrap flex-wrap gap-[16px]">
                        <div className="desktop:w-[50%] w-full desktop:h-[250px] tablet:h-[400px] h-[210px] bg-[#ececef] tablet:rounded-[12px] flex-none overflow-hidden">
                          <iframe 
                            width="100%" 
                            height="100%" 
                            src={video.embedUrl} 
                            referrerPolicy="strict-origin-when-cross-origin" 
                            allowFullScreen
                            title={video.title}
                          />
                        </div>
                        <h6 className="line-clamp-1 h-fit tablet:pl-[0] pl-[16px] leading-[150%] text-inherit text-base font-medium">
                          {video.title}
                        </h6>
                      </div>
                    ))}
                    
                    <div className="h-[12px]"></div>
                    <button 
                      className="w-full flex flex-none justify-center items-center font-semibold rounded-[8px] px-[12px] text-[14px] gap-[4px] border-[1.5px] bg-white border-outline-common_2 text-label-common_5 h-[40px]"
                      onClick={() => window.location.href = `/hospital/${params.id}/youtube`}
                    >
                      더보기
                      <span className="text-label-common_4 leading-[150%] text-inherit text-xs font-semibold">({hospitalYoutubeVideos.length})</span>
                      <span className="material-symbols-rounded text-label-common_4" style={{
                        fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                        fontSize: '16px'
                      }}>arrow_forward_ios</span>
                    </button>
                  </div>
                </div>
              </>
            )}
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
                <b className="text-inherit">{hospital.consultCount.toLocaleString()}</b>명
              </span>
              이 상담 신청한 병원이에요!
            </p>
          </div>
          <button className="flex flex-none justify-center items-center font-semibold rounded-[12px] px-[20px] text-[16px] gap-[6px] bg-background-plasticSurgery_2 text-white h-[56px]">
            병원 상담신청
          </button>
        </div>
      </div>

      {/* 이미지 모달 */}
      {isImageModalOpen && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className="fixed inset-0 bg-black opacity-50 z-30"
            onClick={closeImageModal}
          />
          
          {/* 모달 컨텐츠 */}
          <div 
            className="fixed inset-0 flex items-center justify-center z-40"
            onClick={closeImageModal}
          >
            <div 
              className="scrollbar-hide flex items-center justify-center"
              tabIndex="-1" 
              role="dialog" 
              aria-label="PhotoSlide" 
              aria-modal="true" 
              style={{
                backgroundColor: 'transparent',
                border: 'medium',
                outline: 'currentcolor',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                height: '100vh'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <div className="z-50 max-w-[1016px] w-full m-6 flex justify-end items-start" style={{ opacity: 1 }}>
                <button className="z-10 right-[100px] inline-flex w-fit items-center justify-end gap-2" onClick={closeImageModal}>
                  <span className="text-label-common_1 tablet:text-xl text-base font-medium leading-[100%] tracking-[-0.2px]">
                    닫기
                  </span>
                  <span 
                    className="material-symbols-rounded text-white" 
                    style={{
                      fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                      fontSize: '24px'
                    }}
                  >
                    close
                  </span>
                </button>
              </div>
              
              {/* 메인 이미지 */}
              <div className="z-40 flex justify-center items-center text-center mx-auto desktop:h-[720px] tablet:h-[576px] h-[343px] desktop:w-[720px] tablet:w-[576px] w-[343px]" style={{ opacity: 1 }}>
                <div 
                  className="absolute w-full desktop:max-w-[720px] tablet:max-w-[576px] max-w-[343px] h-full desktop:max-h-[720px] tablet:max-h-[576px] max-h-[343px] z-20 flex justify-center items-center" 
                  draggable="false" 
                  style={{
                    zIndex: 1,
                    opacity: 1,
                    willChange: 'transform, opacity',
                    transform: 'none',
                    WebkitUserSelect: 'none',
                    touchAction: 'pan-y'
                  }}
                >
                  <img 
                    className="absolute object-contain w-full h-full" 
                    src={sliderImages[modalImageIndex]} 
                    alt="photo"
                    style={{ opacity: 1 }}
                  />
                </div>
              </div>
              
              {/* 하단 네비게이션 */}
              <div className="mx-auto mt-5 mb-[60px] z-50 px-4 w-screen flex max-w-[1016px] max-h-[388px] justify-between tablet:items-center items-end" style={{ opacity: 1 }}>
                <span 
                  translate="no"
                  className="material-symbols-rounded cursor-pointer z-10" 
                  aria-hidden="true"
                  onClick={goToPrevModalImage}
                  style={{
                    fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                    color: 'rgb(255, 255, 255)',
                    fontSize: '24px',
                    visibility: 'visible'
                  }}
                >
                  arrow_back_ios
                </span>
                
                <div className="w-full flex justify-center items-center">
                  <div className="px-4 py-3 rounded-[38px] text-label-common_1 tablet:text-xl text-sm font-bold leading-[150%]" style={{ background: 'rgba(49,49,66,0.40)' }}>
                    {modalImageIndex + 1}/{sliderImages.length}
                  </div>
                </div>
                
                <span 
                  translate="no"
                  className="material-symbols-rounded cursor-pointer z-10" 
                  aria-hidden="true"
                  onClick={goToNextModalImage}
                  style={{
                    fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24',
                    color: 'rgb(255, 255, 255)',
                    fontSize: '24px',
                    visibility: 'visible'
                  }}
                >
                  arrow_forward_ios
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 푸터 */}
      <Footer />
    </div>
  );
}