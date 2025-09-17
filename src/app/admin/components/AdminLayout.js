'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const profileDropdownRef = useRef(null);
  const profileButtonRef = useRef(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (!adminToken || !adminUser) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(adminUser));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  // 프로필 드롭다운 토글
  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // 마이페이지 이동
  const handleMyPageClick = () => {
    setIsProfileDropdownOpen(false);
    // 마이페이지로 이동 (추후 구현)
    console.log('마이페이지로 이동');
  };

  // 로그아웃 클릭
  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false);
    handleLogout();
  };

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target) &&
          profileButtonRef.current && !profileButtonRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      title: '대시보드',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0" />
        </svg>
      ),
      path: '/admin',
      active: pathname === '/admin'
    },
    {
      title: '이벤트 관리',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      path: '/admin/events',
      active: pathname === '/admin/events'
    },
    {
      title: '랭킹 관리',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/admin/rankings',
      active: pathname === '/admin/rankings'
    },
    {
      title: '의사/병원 관리',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      path: '/admin/doctors',
      active: pathname === '/admin/doctors'
    },
    {
      title: '사용자 관리',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      path: '/admin/users',
      active: pathname.startsWith('/admin/users')
    },
    {
      title: '리뷰 관리',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      path: '/admin/reviews',
      active: pathname.startsWith('/admin/reviews')
    },
    {
      title: '칼럼 관리',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      path: '/admin/columns',
      active: pathname.startsWith('/admin/columns')
    },
    {
      title: '설정',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/admin/settings',
      active: pathname.startsWith('/admin/settings')
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background-common_1 flex items-center justify-center">
        <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderBottomColor: '#604aff' }}></div>
          <p className="mt-2 text-label-common_3">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-common_1">
      {/* 사이드바 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img 
              alt="TOKTOK" 
              loading="lazy" 
              width="100" 
              height="26" 
              decoding="async" 
              className="flex-none" 
              src="/images/toktok-logo.png" 
              style={{ color: 'transparent' }}
            />
            <span className="text-sm font-medium text-gray-500 tracking-wider">ADMIN</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-background-common_2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-colors ${
                    item.active 
                      ? 'border border-gray-200' 
                      : 'text-label-common_4 hover:bg-background-common_2 hover:text-label-common_5'
                  }`}
                  style={item.active ? { backgroundColor: '#f8f6ff', color: '#604aff' } : {}}
                >
                  {item.icon}
                  <span className="ml-3 font-medium">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={`lg:ml-64 flex flex-col min-h-screen`}>
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-background-common_2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* 상단 오른쪽 프로필 영역 */}
          <div className="flex items-center ml-auto relative">
            {/* 관리자 프로필 영역 - 클릭 가능 */}
            <button 
              ref={profileButtonRef}
              onClick={handleProfileDropdownToggle}
              className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              {/* 프로필 아이콘 */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f8f6ff' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#604aff' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {/* 사용자 정보 */}
              <div className="text-left">
                <div className="text-sm font-medium text-label-common_5">{user?.name}</div>
                <div className="text-xs text-label-common_3">{user?.email}</div>
              </div>

              {/* 드롭다운 화살표 */}
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 프로필 드롭다운 메뉴 */}
            {isProfileDropdownOpen && (
              <div 
                ref={profileDropdownRef}
                className="absolute top-full right-0 mt-2 z-20 rounded-lg p-1 shadow-[0px_2px_12px_0px_rgba(0,0,0,0.12)] w-[150px] bg-background-common_1"
              >
                <ul className="bg-white" role="menu">
                  <li 
                    onClick={handleMyPageClick}
                    className="flex items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer"
                    role="menuitem"
                  >
                    <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">
                      마이페이지
                    </h6>
                  </li>
                  <li 
                    onClick={handleLogoutClick}
                    className="flex items-center justify-between px-2 h-[40px] rounded-lg hover:bg-background-common_2 text-label-common_4 hover:text-label-common_4 cursor-pointer"
                    role="menuitem"
                  >
                    <h6 className="text-inherit leading-[150%] text-inherit text-sm font-medium">
                      로그아웃
                    </h6>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* 모바일 오버레이 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}