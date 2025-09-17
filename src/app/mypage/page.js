'use client';

import Header from '../components/Header';
import BottomNavigation from '../../components/sections/BottomNavigation';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <Header />
      
      {/* 메인 컨텐츠 영역 */}
      <div className="pt-14 pb-20">
        {/* 배너 영역 */}
        <div className="w-full mb-5">
          <img 
            src="//useruploads.vwo.io/useruploads/1089957/images/944c6d5ac821ded57c29b357d550ea31_vwopc1.png" 
            className="hidden tablet:block w-full rounded-2xl cursor-pointer"
            height="366" width="2874" alt="마이페이지 배너"
          />
          <img 
            src="//useruploads.vwo.io/useruploads/1089957/images/7b696c5e21db16a924765581b17fa973_vwomo1.png" 
            className="block tablet:hidden w-full rounded-2xl cursor-pointer"
            height="366" width="1029" alt="마이페이지 모바일 배너"
          />
        </div>

        {/* 프로필 카드 */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 mb-6 mx-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">김토크님</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>카카오 로그인</span>
                  <span>•</span>
                  <span>상담목록 3건</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              프로필 수정
            </button>
          </div>
        </div>

        {/* 본인인증 영역 */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 mx-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">본인인증 필수</h4>
              <p className="text-xs text-blue-700">실명 인증 후 상담 신청이 가능합니다.</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              인증하기
            </button>
          </div>
        </div>

        {/* 설정 메뉴 */}
        <div className="mx-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">설정</h2>
          
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="border-b border-gray-200 last:border-b-0">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-gray-900 font-medium">내 상담 내역</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            
            <div className="border-b border-gray-200 last:border-b-0">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-gray-900 font-medium">내 리뷰</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            
            <div className="border-b border-gray-200 last:border-b-0">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-gray-900 font-medium">관심 의사/병원</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            
            <div className="border-b border-gray-200 last:border-b-0">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-gray-900 font-medium">알림 설정</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            
            <div className="border-b border-gray-200 last:border-b-0">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-gray-900 font-medium">계정 관리</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
            
            <div className="border-b border-gray-200 last:border-b-0">
              <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors">
                <span className="text-gray-900 font-medium">고객센터</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}