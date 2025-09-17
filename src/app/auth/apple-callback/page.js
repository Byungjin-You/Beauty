'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function AppleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAppleCallback = async () => {
      try {
        const success = searchParams.get('success');
        
        if (success === 'false') {
          const errorMsg = searchParams.get('error') || 'Apple 로그인에 실패했습니다.';
          setError(errorMsg);
          setStatus('error');
          return;
        }

        if (success === 'true') {
          // Apple에서 받은 사용자 정보 추출
          const appleUserData = {
            userId: searchParams.get('user_id'),
            email: searchParams.get('email'),
            emailVerified: searchParams.get('email_verified') === 'true',
            firstName: searchParams.get('first_name') || '',
            lastName: searchParams.get('last_name') || '',
            isPrivateEmail: searchParams.get('email')?.includes('@privaterelay.appleid.com') || false
          };

          setUserInfo(appleUserData);

          // 우리 백엔드 API로 소셜 로그인 처리
          await handleSocialLogin(appleUserData);
          
        } else {
          setError('Apple 로그인 응답이 올바르지 않습니다.');
          setStatus('error');
        }

      } catch (error) {
        console.error('Apple 콜백 처리 오류:', error);
        setError('Apple 로그인 처리 중 오류가 발생했습니다.');
        setStatus('error');
      }
    };

    handleAppleCallback();
  }, [searchParams]);

  const handleSocialLogin = async (appleUserData) => {
    try {
      const response = await fetch('/api/auth/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'apple',
          providerId: appleUserData.userId,
          providerEmail: appleUserData.email,
          providerData: {
            firstName: appleUserData.firstName,
            lastName: appleUserData.lastName,
            isPrivateEmail: appleUserData.isPrivateEmail,
            emailVerified: appleUserData.emailVerified
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('백엔드 로그인 성공:', data);
        
        // JWT 토큰 저장
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setStatus('success');
        
        // 3초 후 메인 페이지로 이동
        setTimeout(() => {
          router.push('/');
        }, 3000);
        
      } else {
        console.error('백엔드 로그인 실패:', data);
        setError(`백엔드 로그인 실패: ${data.message}`);
        setStatus('error');
      }
    } catch (error) {
      console.error('소셜 로그인 처리 오류:', error);
      setError('소셜 로그인 처리 중 오류가 발생했습니다.');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    router.push('/test-apple');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Apple 로그인 처리 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 실패</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                다시 시도
              </button>
              <button
                onClick={handleGoHome}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">🍎 Apple 로그인 성공!</h2>
            
            {userInfo && (
              <div className="bg-gray-50 rounded-md p-4 mb-6 text-left">
                <h3 className="text-sm font-medium text-gray-700 mb-2">로그인 정보:</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>이메일:</strong> {userInfo.email || '제공되지 않음'}</p>
                  <p><strong>이름:</strong> {userInfo.firstName} {userInfo.lastName}</p>
                  <p><strong>이메일 인증:</strong> {userInfo.emailVerified ? '인증됨' : '미인증'}</p>
                  <p><strong>Private Relay:</strong> {userInfo.isPrivateEmail ? '사용중' : '미사용'}</p>
                </div>
                
                {userInfo.isPrivateEmail && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-600">
                    💡 Apple Private Relay 이메일이 제공되었습니다. 실제 이메일 주소가 보호됩니다.
                  </div>
                )}
              </div>
            )}
            
            <p className="text-gray-600 mb-4">3초 후 홈페이지로 이동합니다...</p>
            
            <button
              onClick={handleGoHome}
              className="w-full px-4 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              지금 홈으로 이동
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function AppleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <AppleCallbackContent />
    </Suspense>
  );
}