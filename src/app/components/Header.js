"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      // 이미 홈페이지에 있으면 새로고침
      window.location.reload();
    } else {
      // 다른 페이지에 있으면 홈으로 이동
      router.push('/');
    }
  };

  const handleMyClick = (e) => {
    e.stopPropagation();
    
    if (isLoggedIn) {
      setShowDropdown(!showDropdown);
    } else {
      router.push('/auth/login');
    }
  };

  const handleMyPageClick = () => {
    setShowDropdown(false);
    // 마이페이지로 이동
    router.push('/mypage');
  };

  const handleConsultationClick = () => {
    setShowDropdown(false);
    // 내 상담목록으로 이동 (추후 구현)
    console.log('내 상담목록으로 이동');
  };

  const handleLogoutClick = () => {
    setShowDropdown(false);
    
    // 로그아웃 처리
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    
    // 다른 컴포넌트에 사용자 데이터 변경을 알리는 커스텀 이벤트 발생
    window.dispatchEvent(new Event('userDataChanged'));
    
    // 홈으로 이동
    router.push('/');
  };

  return (
    <div className="sticky top-0 w-full h-14 items-center flex justify-between px-4 bg-white z-30">
        <div className="cursor-pointer flex-none flex items-center gap-2 logo-container" onClick={handleLogoClick}>
          <img
            alt="Logo"
            loading="lazy"
            width="24"
            height="24"
            decoding="async"
            className="cursor-pointer flex-none -translate-y-0.5"
            src="/images/3d-glassy-gradient-glass-asterisk-sign.png"
            style={{ objectFit: 'cover' }}
          />
          <img
            alt="TOKTOK"
            loading="lazy"
            width="120"
            height="32"
            decoding="async"
            className="cursor-pointer flex-none hover:opacity-80 transition-opacity duration-200"
            src="/images/toktok-logo1.png"
            style={{ color: 'transparent' }}
          />
        </div>

        <div className="flex flex-none gap-3 ml-auto items-center">
          <a className="w-7 h-7 p-0.5 hidden justify-center items-center ml-auto text-gray-600" href="/search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="w-full h-full">
              <path fill="currentColor" fillRule="evenodd" d="M14.167 8.75a5.417 5.417 0 1 1-10.833 0 5.417 5.417 0 0 1 10.833 0m-1.032 5.563a7.083 7.083 0 1 1 1.178-1.178l3.194 3.193a.833.833 0 1 1-1.178 1.179z" clipRule="evenodd"></path>
            </svg>
          </a>
          <div className="relative flex items-center" ref={dropdownRef}>
            <button onClick={handleMyClick}>
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none">
                <path fill="#484760" fillRule="evenodd" d="M18.833 2.5H7.167A4.667 4.667 0 0 0 2.5 7.167v11.666A4.667 4.667 0 0 0 7.167 23.5h11.666a4.667 4.667 0 0 0 4.667-4.667V7.167A4.667 4.667 0 0 0 18.833 2.5M7.167.167a7 7 0 0 0-7 7v11.666a7 7 0 0 0 7 7h11.666a7 7 0 0 0 7-7V7.167a7 7 0 0 0-7-7z" clipRule="evenodd"></path>
                <path fill="#484760" d="M5.457 17.339c-.58 0-.913-.35-.913-.959v-6.085c0-.852.485-1.342 1.342-1.342.722 0 1.11.293 1.404 1.054l1.698 4.298h.045l1.692-4.298c.299-.761.688-1.054 1.415-1.054.852 0 1.337.485 1.337 1.342v6.085c0 .61-.333.959-.914.959-.575 0-.908-.35-.908-.959v-4.247h-.04l-1.81 4.478c-.152.384-.394.559-.79.559-.394 0-.653-.175-.8-.559L6.41 12.133h-.045v4.247c0 .61-.333.959-.908.959M18.096 17.339c-.66 0-1.038-.39-1.038-1.077v-1.844l-2.402-3.78a1.3 1.3 0 0 1-.215-.704c0-.57.44-.981 1.043-.981.452 0 .694.163.97.66l1.642 2.848h.04l1.64-2.849c.265-.473.536-.66.948-.66.586 0 1.02.412 1.02.965 0 .248-.067.48-.22.716l-2.396 3.785v1.844c0 .688-.378 1.077-1.032 1.077"></path>
              </svg>
            </button>

            {/* 드롭다운 메뉴 */}
            {isLoggedIn && showDropdown && (
              <ul 
                className="absolute left-0 mt-[4px] min-w-max bg-white rounded-[12px] w-[196px] left-auto top-[100%] right-0"
                style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 2px 12px 0px' }}
              >
                <li 
                  className="flex items-center px-[8px] m-[4px] h-[40px] rounded-[8px] z-10 text-label-common_4 cursor-pointer hover:bg-background-common_2 hover:text-label-common_5"
                  onClick={handleMyPageClick}
                  style={{ color: '#7E7E8F' }}
                >
                  <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">
                    마이페이지
                  </h6>
                </li>
                <li 
                  className="flex items-center px-[8px] m-[4px] h-[40px] rounded-[8px] z-10 text-label-common_4 cursor-pointer hover:bg-background-common_2 hover:text-label-common_5"
                  onClick={handleConsultationClick}
                  style={{ color: '#7E7E8F' }}
                >
                  <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">
                    내 상담목록
                  </h6>
                </li>
                <li 
                  className="flex items-center px-[8px] m-[4px] h-[40px] rounded-[8px] z-10 text-label-common_4 cursor-pointer hover:bg-background-common_2 hover:text-label-common_5"
                  onClick={handleLogoutClick}
                  style={{ color: '#7E7E8F' }}
                >
                  <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">
                    로그아웃
                  </h6>
                </li>
              </ul>
            )}
          </div>
        </div>
    </div>
  );
};

export default Header; 