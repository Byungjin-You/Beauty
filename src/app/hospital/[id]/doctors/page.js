'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doctorsData } from '../../../../data/doctors';
import Header from '../../../components/Header';
import Footer from '../../../../components/sections/Footer';
import TabNavigation from '../../../../components/common/TabNavigation';

/**
 * 병원 의사 페이지 컴포넌트
 */
export default function HospitalDoctorsPage() {
  const params = useParams();
  const router = useRouter();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  // 의사 더미 데이터
  const doctorsData = [
    {
      id: 1,
      name: "김기갑 대표원장",
      title: "성형외과 전문의",
      hospitalName: "유앤유성형외과의원",
      image: "https://images.babitalk.com/doctor/1484/7d1968d3034ead34108bcc8d22fdfd65/face.jpeg",
      specialties: ["가슴"],
      reviewCount: 240,
      consultationCount: 396,
      hasDoctorConsultation: true
    },
    {
      id: 2,
      name: "서정화 원장",
      title: "성형외과 전문의",
      hospitalName: "유앤유성형외과의원",
      image: "https://images.babitalk.com/doctor/2359/8f497fa5baa64384b3c1e107e5e77695/face.jpeg",
      specialties: ["지방흡입/이식", "가슴", "기타성형"],
      reviewCount: 95,
      consultationCount: 85,
      hasDoctorConsultation: true
    },
    {
      id: 3,
      name: "이융기 원장",
      title: "성형외과 전문의",
      hospitalName: "유앤유성형외과의원",
      image: "https://images.babitalk.com/doctor/580/28a39aad846a5d9776104a0e57d34e92/face.jpeg",
      specialties: ["지방흡입/이식", "가슴"],
      reviewCount: 372,
      consultationCount: 51,
      hasDoctorConsultation: true
    }
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

  // 탭 메뉴 데이터
  const tabs = [
    { id: 'home', label: '홈', count: null },
    { id: 'events', label: '이벤트', count: 13 },
    { id: 'reviews', label: '후기', count: 750 },
    { id: 'doctors', label: '의사', count: 3, active: true },
    { id: 'youtube', label: '유튜브', count: 243 }
  ];

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    window.location.href = `/hospital/${params.id}`;
  };

  // 탭 클릭 핸들러
  const handleTabClick = (tabId) => {
    if (tabId === 'home') {
      window.location.href = `/hospital/${params.id}`;
    } else if (tabId === 'events') {
      window.location.href = `/hospital/${params.id}/events`;
    } else if (tabId === 'reviews') {
      window.location.href = `/hospital/${params.id}/reviews`;
    } else if (tabId === 'youtube') {
      window.location.href = `/hospital/${params.id}/youtube`;
    }
    // 현재 의사 탭이므로 다른 처리 없음
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-common_1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-container-plasticSurgery_3 mx-auto mb-4"></div>
          <p className="text-label-common_3">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-background-common_1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-label-common_3">병원 정보를 찾을 수 없습니다.</p>
          <button 
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-container-plasticSurgery_3 text-white rounded-lg"
          >
            돌아가기
          </button>
        </div>
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
          activeTab="doctors" 
          onTabClick={handleTabClick}
          className="desktop:ml-[-32px] tablet:ml-[-24px] ml-[-16px]"
        />

        {/* 메인 콘텐츠 영역 */}
        <div className="relative w-full max-w-[1024px] desktop:px-[32px] tablet:px-[24px] px-[16px] py-[20px]">
          
          {/* 의사 리스트 */}
          <div className="desktop:my-[32px] tablet:my-[24px] my-[16px]">
            <div className="flex flex-col gap-[16px]">
              <div className="flex flex-col gap-[24px]">
                {doctorsData.map((doctor) => (
                  <div key={doctor.id} className="w-full justify-start items-start gap-[12px] inline-flex cursor-pointer">
                    <img className="w-[90px] h-[90px] relative flex-none rounded-full overflow-hidden border border-outline-thumbnail" src={doctor.image} alt={doctor.name} />
                    <div className="grow shrink basis-0 flex flex-col justify-start items-start gap-[6px]">
                      <div className="self-stretch flex flex-col justify-start items-start gap-[2px]">
                        <h4 className="leading-[150%] text-inherit text-base font-semibold">{doctor.name}</h4>
                        <p className="leading-[150%] text-inherit text-[13px] font-medium">{doctor.title}</p>
                        <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">{doctor.hospitalName}</p>
                      </div>
                      <div className="flex self-stretch justify-start items-start gap-[4px]">
                        {doctor.specialties.map((specialty, index) => (
                          <div key={index} className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] bg-container-common_2 border-none text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-common_5 !text-label-common_3">
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
                          <p className="leading-[150%] text-inherit text-[11px] font-medium">{doctor.consultationCount}</p>
                        </div>
                      </div>
                      {doctor.hasDoctorConsultation && (
                        <div className="flex gap-[4px]">
                          <div className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] border-outline-common_2 text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-common_5 undefined">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none">
                              <path fill="currentColor" d="M4.78 6.176a1.64 1.64 0 0 0 1.641-1.64c0-.904-.758-1.597-1.642-1.597-.888 0-1.65.704-1.645 1.604a1.64 1.64 0 0 0 1.645 1.633m4.252.236a.45.45 0 0 0 .362-.184l1.838-2.589a.5.5 0 0 0 .101-.25c0-.185-.183-.31-.374-.31-.123 0-.237.066-.322.188L9.016 5.612l-.754-.867a.38.38 0 0 0-.318-.155c-.2 0-.358.148-.358.329q.001.133.106.25l.961 1.059c.11.125.228.184.379.184M2.238 9.605h5.075c.672 0 .904-.184.904-.523 0-.948-1.328-2.253-3.442-2.253-2.11 0-3.442 1.305-3.442 2.253 0 .339.233.523.905.523"></path>
                            </svg>
                            <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">의사상담</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
      
      <Footer />
    </div>
  );
}
