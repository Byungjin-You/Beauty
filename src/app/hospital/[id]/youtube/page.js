'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../../components/sections/Footer';
import TabNavigation from '../../../../components/common/TabNavigation';

/**
 * 병원 유튜브 페이지 컴포넌트
 */
export default function HospitalYoutubePage() {
  const params = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  // 유튜브 영상 데이터
  const youtubeVideos = [
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

  // 병원 데이터 로드
  useEffect(() => {
    const hospitalId = parseInt(params.id);
    
    // 병원 데이터 설정
    setHospital({
      id: hospitalId,
      name: "유앤유성형외과의원",
      address: "서울시 강남구 신사동 123-45",
      phone: "02-1234-5678"
    });
    
    setLoading(false);
  }, [params.id]);

  // 탭 메뉴 데이터
  const tabs = [
    { id: 'home', label: '홈', count: null },
    { id: 'events', label: '이벤트', count: 13 },
    { id: 'reviews', label: '후기', count: 125 },
    { id: 'doctors', label: '의사', count: 3 },
    { id: 'youtube', label: '유튜브', count: youtubeVideos.length }
  ];

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    if (window.opener) {
      window.close();
    } else {
      router.push('/doctors');
    }
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tabId) => {
    if (tabId === 'home') {
      window.location.href = `/hospital/${params.id}`;
    } else if (tabId === 'events') {
      window.location.href = `/hospital/${params.id}/events`;
    } else if (tabId === 'reviews') {
      window.location.href = `/hospital/${params.id}/reviews`;
    } else if (tabId === 'doctors') {
      window.location.href = `/hospital/${params.id}/doctors`;
    }
    // 다른 탭들은 현재 구현되지 않음
  };

  if (loading) {
    return <div>Loading...</div>;
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
          activeTab="youtube" 
          onTabClick={handleTabClick}
          className="desktop:ml-[-32px] tablet:ml-[-24px] ml-[-16px]"
        />

        {/* 메인 콘텐츠 영역 */}
        <div className="relative w-full max-w-[1024px] desktop:px-[32px] tablet:px-[24px] px-[16px] py-[20px]">
          
          {/* 유튜브 리스트 */}
          <div className="my-[16px]">
            <div className="flex flex-col gap-[16px]">
              {/* 유튜브 영상들 (전체) */}
              {youtubeVideos.map((video, index) => (
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
              
              {/* 더보기 버튼 */}
              <button className="w-full !gap-[4px] flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[8px] px-[12px] text-[14px] gap-[4px] border-[1.5px] bg-white border-outline-common_2 text-label-common_5" style={{ height: '40px' }}>
                더보기
                <span 
                  translate="no" 
                  className="material-symbols-rounded text-inherit" 
                  aria-hidden="true" 
                  style={{
                    fontVariationSettings:"'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    fontSize: '16px'
                  }}
                >
                  keyboard_arrow_down
                </span>
              </button>
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
      
      <Footer />
    </div>
  );
}
