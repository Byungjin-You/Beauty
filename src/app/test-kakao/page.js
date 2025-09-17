'use client';

import { useState, useEffect } from 'react';

export default function TestKakaoPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 카카오 SDK 로드
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.integrity = 'sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        // Next.js에서 클라이언트 환경변수는 NEXT_PUBLIC_ 접두사 필요
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
        
        if (kakaoKey) {
          window.Kakao.init(kakaoKey);
          console.log('카카오 SDK 초기화 완료');
        } else {
          console.error('NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY 환경변수가 설정되지 않았습니다.');
          setError('카카오 JavaScript 키가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      // cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleKakaoLogin = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      setError('카카오 SDK가 초기화되지 않았습니다. JavaScript 키를 확인해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    window.Kakao.Auth.login({
      success: function(authObj) {
        console.log('카카오 로그인 성공:', authObj);
        
        // 사용자 정보 가져오기
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: function(res) {
            console.log('사용자 정보:', res);
            setUser(res);
            setLoading(false);
            
            // 우리 백엔드 API로 소셜 로그인 처리
            handleSocialLogin(res, authObj.access_token);
          },
          fail: function(err) {
            console.error('사용자 정보 가져오기 실패:', err);
            setError('사용자 정보를 가져오는데 실패했습니다.');
            setLoading(false);
          }
        });
      },
      fail: function(err) {
        console.error('카카오 로그인 실패:', err);
        setError('카카오 로그인에 실패했습니다.');
        setLoading(false);
      }
    });
  };

  const handleSocialLogin = async (kakaoUser, accessToken) => {
    try {
      const response = await fetch('/api/auth/social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'kakao',
          providerId: kakaoUser.id.toString(),
          providerEmail: kakaoUser.kakao_account?.email || '',
          providerData: {
            nickname: kakaoUser.kakao_account?.profile?.nickname || '',
            profile_image_url: kakaoUser.kakao_account?.profile?.profile_image_url || '',
            thumbnail_image_url: kakaoUser.kakao_account?.profile?.thumbnail_image_url || '',
            gender: kakaoUser.kakao_account?.gender || '',
            birthday: kakaoUser.kakao_account?.birthday || '',
            birthyear: kakaoUser.kakao_account?.birthyear || '',
          },
          accessToken: accessToken
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('백엔드 로그인 성공:', data);
        console.log('로그인 성공! 콘솔을 확인해주세요.');
        
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
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.logout(() => {
        console.log('카카오 로그아웃 완료');
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            🟡 카카오 로그인 테스트
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
                  <li>✅ 카카오 개발자센터에서 앱 등록</li>
                  <li>✅ Web 플랫폼 도메인 등록: https://d0b026e925fb.ngrok-free.app</li>
                  <li>✅ Redirect URI 등록</li>
                  <li>⚠️ .env.local에 KAKAO_JAVASCRIPT_KEY 설정</li>
                </ul>
              </div>

              <button
                onClick={handleKakaoLogin}
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm bg-yellow-400 text-yellow-900 font-medium hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-900 mr-2"></div>
                    로그인 중...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.785-3.373C3.195 17.323 1.5 15.028 1.5 11.185 1.5 6.665 6.201 3 12 3z"/>
                    </svg>
                    카카오 로그인
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">🔧 설정 방법:</h4>
                <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                  <li>카카오 개발자센터에서 REST API 키와 JavaScript 키 발급</li>
                  <li>.env.local에 키 설정</li>
                  <li>페이지를 새로고침</li>
                  <li>카카오 로그인 버튼 클릭</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-green-800 mb-2">✅ 로그인 성공!</h3>
                <div className="text-xs text-green-600">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>닉네임:</strong> {user.kakao_account?.profile?.nickname || '없음'}</p>
                  <p><strong>이메일:</strong> {user.kakao_account?.email || '제공되지 않음'}</p>
                  {user.kakao_account?.profile?.profile_image_url && (
                    <div className="mt-2">
                      <img 
                        src={user.kakao_account.profile.profile_image_url} 
                        alt="프로필" 
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
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
        </div>
      </div>
    </div>
  );
}