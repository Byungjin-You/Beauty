'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 임시 로그인 로직 (실제로는 API 호출)
      if (formData.email === 'admin@toktok.com' && formData.password === 'admin123') {
        localStorage.setItem('adminToken', 'admin_token_123');
        localStorage.setItem('adminUser', JSON.stringify({
          id: 1,
          email: formData.email,
          name: '관리자',
          role: 'admin'
        }));
        router.push('/admin');
      } else {
        alert('이메일 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-common_1 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-label-common_5 mb-2">톡톡 어드민</h1>
          <p className="text-label-common_3">관리자 로그인</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-label-common_5 mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ '--tw-ring-color': '#604aff' }}
                placeholder="관리자 이메일을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-label-common_5 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ '--tw-ring-color': '#604aff' }}
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: '#604aff' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#4d37e6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#604aff'}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-label-common_3">
              계정이 없으신가요?{' '}
              <button 
                onClick={() => router.push('/admin/register')}
                className="font-medium hover:opacity-80 transition-opacity"
                style={{ color: '#604aff' }}
              >
                회원가입
              </button>
            </p>
          </div>

          {/* 테스트 계정 안내 */}
          <div className="mt-4 p-4 bg-background-common_2 rounded-xl">
            <h3 className="text-sm font-medium text-label-common_5 mb-2">테스트 계정</h3>
            <div className="text-xs text-label-common_3 space-y-1">
              <p>이메일: admin@toktok.com</p>
              <p>비밀번호: admin123</p>
            </div>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="text-center mt-6">
          <button 
            onClick={() => router.push('/')}
            className="text-label-common_3 hover:text-label-common_5 text-sm"
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}