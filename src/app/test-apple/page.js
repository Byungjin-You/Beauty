'use client';

import { useState, useEffect } from 'react';

export default function TestApplePage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [appleScriptLoaded, setAppleScriptLoaded] = useState(false);

  useEffect(() => {
    // Apple Sign-In JavaScript SDK 로드
    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.onload = () => {
      console.log('Apple Sign-In SDK 로딩 완료');
      setAppleScriptLoaded(true);
      
      // Apple Sign-In 초기화
      if (window.AppleID) {
        const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
        const redirectURI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || 
                           `${window.location.origin}/api/auth/callback/apple`;
        
        if (appleClientId) {
          window.AppleID.auth.init({
            clientId: appleClientId,
            scope: 'name email',
            redirectURI: redirectURI,
            state: 'apple_auth_state',
            usePopup: true // 팝업 모드 사용
          });
          console.log('Apple Sign-In 초기화 완료');
        } else {
          setError('NEXT_PUBLIC_APPLE_CLIENT_ID 환경변수가 설정되지 않았습니다.');
        }
      }
    };
    script.onerror = () => {
      setError('Apple Sign-In SDK 로딩에 실패했습니다.');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleAppleLogin = async () => {
    if (!window.AppleID) {
      setError('Apple Sign-In SDK가 로드되지 않았습니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Apple Sign-In 실행
      const response = await window.AppleID.auth.signIn();
      console.log('Apple 로그인 성공:', response);
      
      // 사용자 정보 처리
      const { authorization, user } = response;
      
      const userData = {
        id: authorization.code, // Apple에서는 authorization code를 사용
        email: user?.email || '',
        firstName: user?.name?.firstName || '',
        lastName: user?.name?.lastName || '',
        isPrivateEmail: user?.email?.includes('@privaterelay.appleid.com') || false
      };

      setUser(userData);
      
      // 우리 백엔드 API로 소셜 로그인 처리
      await handleSocialLogin(userData, authorization);

    } catch (error) {
      console.error('Apple 로그인 실패:', error);
      
      // 사용자가 취소한 경우
      if (error.error === 'popup_closed_by_user') {
        setError('Apple 로그인이 취소되었습니다.');
      } else {
        setError(`Apple 로그인에 실패했습니다: ${error.error || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (appleUser, authorization) => {
    try {
      const response = await fetch('/api/auth/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'apple',
          providerId: authorization.code, // Apple은 authorization code 사용
          providerEmail: appleUser.email,
          providerData: {
            firstName: appleUser.firstName,
            lastName: appleUser.lastName,
            isPrivateEmail: appleUser.isPrivateEmail,
            identityToken: authorization.id_token,
            authorizationCode: authorization.code,
            state: authorization.state
          },
          accessToken: authorization.id_token // Apple은 ID Token 사용
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('백엔드 로그인 성공:', data);
        console.log('Apple 로그인 성공! 콘솔을 확인해주세요.');
        
        // JWT 토큰 저장
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } else {
        console.error('백엔드 로그인 실패:', data);
        setError(`백엔드 로그인 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('소셜 로그인 처리 오류:', error);
      setError('소셜 로그인 처리 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('로그아웃 완료');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            🍎 Apple Sign-In 테스트
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {!user ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">설정 확인 사항:</h3>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>✅ Apple Developer 계정 필요</li>
                  <li>✅ Service ID 생성 및 설정</li>
                  <li>✅ Key 생성 (Sign in with Apple)</li>
                  <li>✅ Return URL 등록: https://d0b026e925fb.ngrok-free.app</li>
                  <li>⚠️ .env.local에 Apple 설정 추가</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">⚠️ 중요 안내</h4>
                <p className="text-xs text-yellow-700">
                  Apple Sign-In은 HTTPS가 필수입니다. 
                  ngrok URL (https://d0b026e925fb.ngrok-free.app)을 사용해야 합니다.
                </p>
              </div>

              <button
                onClick={handleAppleLogin}
                disabled={loading || !appleScriptLoaded}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm bg-black text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif' }}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    로그인 중...
                  </div>
                ) : !appleScriptLoaded ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    SDK 로딩 중...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Sign in with Apple
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">🔧 Apple 개발자 설정:</h4>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Apple Developer Console에서 Service ID 생성</li>
                  <li>Sign in with Apple 활성화</li>
                  <li>Return URL 설정</li>
                  <li>Key 생성 및 다운로드</li>
                  <li>.env.local에 설정 추가</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">✅ Apple 로그인 성공!</h3>
                <div className="text-xs text-green-600">
                  <p><strong>이메일:</strong> {user.email || '제공되지 않음'}</p>
                  <p><strong>이름:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Private Relay:</strong> {user.isPrivateEmail ? '예' : '아니오'}</p>
                  {user.isPrivateEmail && (
                    <p className="mt-2 text-xs text-blue-600">
                      💡 Private Relay 이메일이 제공되었습니다.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                로그아웃
              </button>

              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600">
                  💡 개발자 도구 콘솔을 확인하면 더 자세한 정보를 볼 수 있습니다.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-2">📱 Apple Sign-In 특징</h4>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>• 사용자 이름은 최초 로그인시에만 제공</li>
              <li>• Private Relay 이메일 옵션 제공</li>
              <li>• 매우 강력한 프라이버시 보호</li>
              <li>• iOS/macOS에서 네이티브 경험 제공</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}