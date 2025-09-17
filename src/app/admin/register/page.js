'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    role: 'manager'
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
      // 유효성 검사
      if (formData.password !== formData.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (formData.password.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.');
        return;
      }

      // 임시 회원가입 로직 (실제로는 API 호출)
      console.log('회원가입 데이터:', formData);
      alert('회원가입이 완료되었습니다. 관리자 승인 후 로그인 가능합니다.');
      router.push('/admin/login');
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-common_1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-label-common_5 mb-2">톡톡 어드민</h1>
          <p className="text-label-common_3">관리자 회원가입</p>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-label-common_5 mb-2">
                이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ '--tw-ring-color': '#604aff' }}
                placeholder="이름을 입력하세요"
              />
            </div>

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
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-label-common_5 mb-2">
                부서
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ '--tw-ring-color': '#604aff' }}
              >
                <option value="">부서를 선택하세요</option>
                <option value="development">개발팀</option>
                <option value="marketing">마케팅팀</option>
                <option value="customer_service">고객서비스팀</option>
                <option value="business">사업팀</option>
                <option value="hr">인사팀</option>
                <option value="finance">재무팀</option>
              </select>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-label-common_5 mb-2">
                역할
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ '--tw-ring-color': '#604aff' }}
              >
                <option value="manager">매니저</option>
                <option value="admin">관리자</option>
                <option value="super_admin">최고관리자</option>
              </select>
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
                placeholder="비밀번호를 입력하세요 (6자 이상)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-label-common_5 mb-2">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all"
                style={{ '--tw-ring-color': '#604aff' }}
                placeholder="비밀번호를 다시 입력하세요"
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
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-label-common_3">
              이미 계정이 있으신가요?{' '}
              <button 
                onClick={() => router.push('/admin/login')}
                className="font-medium hover:opacity-80 transition-opacity"
                style={{ color: '#604aff' }}
              >
                로그인
              </button>
            </p>
          </div>

          {/* 안내사항 */}
          <div className="mt-4 p-4 bg-background-common_2 rounded-xl">
            <h3 className="text-sm font-medium text-label-common_5 mb-2">안내사항</h3>
            <div className="text-xs text-label-common_3 space-y-1">
              <p>• 회원가입 후 관리자 승인이 필요합니다</p>
              <p>• 승인 완료 시 이메일로 알림을 받을 수 있습니다</p>
              <p>• 문의사항이 있으시면 개발팀에 연락하세요</p>
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