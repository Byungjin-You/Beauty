'use client';

import { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalReviews: 0,
    totalEvents: 0,
    todaySignups: 0,
    todayReviews: 0,
    pendingApprovals: 0,
    activeEvents: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // 임시 데이터 로딩 시뮬레이션
    setTimeout(() => {
      setStats({
        totalUsers: 15243,
        totalDoctors: 1523,
        totalReviews: 8945,
        totalEvents: 23,
        todaySignups: 45,
        todayReviews: 123,
        pendingApprovals: 12,
        activeEvents: 8
      });

      setRecentActivities([
        { id: 1, type: 'user', message: '새로운 사용자가 가입했습니다.', user: '김민수', time: '5분 전' },
        { id: 2, type: 'review', message: '새로운 리뷰가 작성되었습니다.', user: '이영희', time: '12분 전' },
        { id: 3, type: 'doctor', message: '의사 프로필이 업데이트되었습니다.', user: '박성진 원장', time: '1시간 전' },
        { id: 4, type: 'event', message: '새로운 이벤트가 등록되었습니다.', user: '관리자', time: '2시간 전' },
        { id: 5, type: 'user', message: '사용자가 탈퇴했습니다.', user: '최지훈', time: '3시간 전' }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-label-common_3">{title}</p>
          <p className="text-2xl font-bold" style={{ color: color === 'blue' || color === 'purple' ? '#604aff' : color === 'green' ? '#16a34a' : '#ea580c' }}>{value.toLocaleString()}</p>
          {subtitle && <p className="text-xs text-label-common_3 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: color === 'blue' || color === 'purple' ? '#f8f6ff' : color === 'green' ? '#dcfce7' : '#fed7aa' }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ActivityIcon = ({ type }) => {
    switch (type) {
      case 'user':
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'review':
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        );
      case 'doctor':
        return (
          <div className="p-2 rounded-full" style={{ backgroundColor: '#f8f6ff' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#604aff' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        );
      case 'event':
        return (
          <div className="p-2 bg-orange-100 rounded-full">
            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-full">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderBottomColor: '#604aff' }}></div>
            <p className="mt-2 text-label-common_3">대시보드 로딩 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-label-common_5">대시보드</h1>
            <p className="text-label-common_3">톡톡 관리자 대시보드에 오신 것을 환영합니다.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-label-common_3">마지막 업데이트</p>
            <p className="text-sm font-medium text-label-common_5">{new Date().toLocaleString('ko-KR')}</p>
          </div>
        </div>

        {/* 주요 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="총 사용자"
            value={stats.totalUsers}
            subtitle={`오늘 +${stats.todaySignups}명`}
            color="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#604aff' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
          />
          
          <StatCard
            title="등록 의사/병원"
            value={stats.totalDoctors}
            subtitle={`승인 대기 ${stats.pendingApprovals}건`}
            color="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#604aff' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          
          <StatCard
            title="총 리뷰"
            value={stats.totalReviews}
            subtitle={`오늘 +${stats.todayReviews}개`}
            color="green"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            }
          />
          
          <StatCard
            title="진행 중인 이벤트"
            value={stats.activeEvents}
            subtitle={`총 ${stats.totalEvents}개 이벤트`}
            color="orange"
            icon={
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        {/* 최근 활동 및 빠른 액션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 최근 활동 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-label-common_5 mb-4">최근 활동</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <ActivityIcon type={activity.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-label-common_5">{activity.message}</p>
                      <p className="text-xs text-label-common_3">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#604aff' }}>
                  모든 활동 보기 →
                </button>
              </div>
            </div>
          </div>

          {/* 빠른 액션 */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-label-common_5 mb-4">빠른 액션</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-background-common_2 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#f8f6ff' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#604aff' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-label-common_5">새 사용자 추가</span>
                  </div>
                  <svg className="w-4 h-4 text-label-common_3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-background-common_2 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-label-common_5">승인 대기 목록</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">{stats.pendingApprovals}</span>
                    <svg className="w-4 h-4 text-label-common_3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-background-common_2 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#f8f6ff' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#604aff' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-label-common_5">새 이벤트 생성</span>
                  </div>
                  <svg className="w-4 h-4 text-label-common_3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-background-common_2 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#f8f6ff' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#604aff' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-label-common_5">통계 보고서</span>
                  </div>
                  <svg className="w-4 h-4 text-label-common_3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}