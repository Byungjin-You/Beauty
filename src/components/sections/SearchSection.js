"use client";

import { useState, useEffect } from "react";

const SearchSection = () => {
  const [searchValue, setSearchValue] = useState("");
  const [interestTags, setInterestTags] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 기본 관심 시술 태그 (로그인하지 않은 경우)
  const defaultInterestTags = [
    "쌍꺼풀(매몰)",
    "눈재수술", 
    "쌍꺼풀(자연유착)",
    "윗트임"
  ];

  // 사용자 데이터를 로드하는 함수
  const loadUserData = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        const user = JSON.parse(userData);
        
        // 사용자가 선택한 시술이 있는 경우
        if (user.selectedTreatments && user.selectedTreatments.length > 0) {
          const userTreatmentTags = user.selectedTreatments
            .map(treatment => treatment.treatmentName)
            .filter(Boolean); // null이나 undefined 제거
          
          // 사용자 선택 시술이 있으면 사용, 없으면 기본 태그 사용
          setInterestTags(userTreatmentTags.length > 0 ? userTreatmentTags : defaultInterestTags);
        } else {
          // 선택한 시술이 없는 경우 기본 태그 사용
          setInterestTags(defaultInterestTags);
        }
      } catch (error) {
        console.error('사용자 데이터 파싱 오류:', error);
        setInterestTags(defaultInterestTags);
      }
    } else {
      setIsLoggedIn(false);
      setInterestTags(defaultInterestTags);
    }
  };

  // 로그인된 사용자의 선택한 시술 태그 가져오기
  useEffect(() => {
    loadUserData();

    // localStorage 변경사항을 감지하여 실시간 업데이트
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        loadUserData();
      }
    };

    // 같은 탭에서의 localStorage 변경사항 감지를 위한 커스텀 이벤트
    const handleCustomStorageChange = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataChanged', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChanged', handleCustomStorageChange);
    };
  }, []);

  // 관심 시술 변경 버튼 클릭 핸들러
  const handleInterestChange = () => {
    if (isLoggedIn) {
      // 로그인된 사용자: 관심 부위 선택부터 다시 시작
      // 관심 시술 변경 모드임을 표시하는 플래그 설정
      localStorage.setItem('isInterestChangeMode', 'true');
      window.location.href = '/auth/register/interests';
    } else {
      // 로그인하지 않은 사용자: 로그인 페이지로 이동
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-[12px] desktop:py-[32px] tablet:pt-0 tablet:pb-[24px] pb-[16px]">
      {/* 검색바 */}
      <div className="flex gap-[10px] w-full max-w-[680px] rounded-[30px] border border-outline-common_2 pl-[16px] pr-[8px] py-[7px] transition">
        <input
          className="text-sm font-medium w-full placeholder-[#7e7e8f] text-label-common_5 outline-none"
          placeholder="궁금한 제품을 검색해 보세요"
          readOnly
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button className="flex-none tablet:w-[36px] tablet:h-[36px] w-[32px] h-[32px] bg-background-common_3 rounded-[50px] shadow justify-center items-center flex text-white p-[8px]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-full h-full">
            <path fill="currentColor" fillRule="evenodd" d="M14.167 8.75a5.417 5.417 0 1 1-10.833 0 5.417 5.417 0 0 1 10.833 0m-1.032 5.563a7.083 7.083 0 1 1 1.178-1.178l3.194 3.193a.833.833 0 1 1-1.178 1.179z" clipRule="evenodd"></path>
          </svg>
        </button>
      </div>

      {/* 관심 시술 섹션 */}
      <div className="w-full py-2">
        <div className="flex items-center justify-between mb-3">
          <span className="interest-procedure-text text-gray-600 text-xs font-medium">
            관심 시술로 검색하기
          </span>
          <button 
            onClick={handleInterestChange}
            className="flex items-center gap-1 text-gray-500 text-xs hover:text-gray-700 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V2l3 3-3 3V6c-3.31 0-6 2.69-6 6 0 1.01.25 1.97.7 2.8L5.24 16.26C4.46 15.04 4 13.57 4 12c0-4.42 3.58-8 8-8z" fill="currentColor"></path>
              <path d="M12 20v2l-3-3 3-3v2c3.31 0 6-2.69 6-6 0-1.01-.25-1.97-.7-2.8l1.46-1.46C19.54 8.96 20 10.43 20 12c0 4.42-3.58 8-8 8z" fill="currentColor"></path>
            </svg>
            관심 시술 변경
          </button>
        </div>

        {/* 관심 시술 태그들 */}
        <div className="flex gap-[6px] overflow-x-auto scrollbar-hide pb-1">
          {interestTags.map((tag, index) => (
            <button
              key={index}
              className="min-w-[42px] flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[8px] px-[8px] text-[12px] gap-[2px] bg-container-common_2 text-label-common_5 border border-outline-common_2 h-[32px] whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection; 