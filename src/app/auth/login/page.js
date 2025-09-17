"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import LoginErrorModal from '../../../components/common/LoginErrorModal';

export default function LoginPage() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 보기/숨기기 토글
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // 이메일 형식 검증
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 형식 검증 (숫자, 영문자, 특수문자 포함 9-20자)
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{9,20}$/;
    return passwordRegex.test(password);
  };

  // 로그인 버튼 활성화 조건 체크
  const isFormValid = () => {
    const hasEmail = formData.email.trim().length > 0;
    const hasPassword = formData.password.trim().length > 0;
    const isEmailValid = hasEmail && validateEmail(formData.email);
    const isPasswordValid = hasPassword && validatePassword(formData.password);
    
    return hasEmail && hasPassword && isEmailValid && isPasswordValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 실시간 검증
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setFieldErrors(prev => ({
          ...prev,
          email: '올바른 이메일 형식이 아닙니다.'
        }));
      } else {
        setFieldErrors(prev => ({
          ...prev,
          email: ''
        }));
      }
    }

    if (name === 'password') {
      if (value && !validatePassword(value)) {
        setFieldErrors(prev => ({
          ...prev,
          password: '숫자, 영문자, 특수문자 포함 9 - 20자로 입력해주세요.'
        }));
      } else {
        setFieldErrors(prev => ({
          ...prev,
          password: ''
        }));
      }
    }

    // 디버깅: 폼 유효성 상태 확인
    setTimeout(() => {
      console.log('Form Data:', formData);
      console.log('Is Form Valid:', isFormValid());
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 다른 컴포넌트에 사용자 데이터 변경을 알리는 커스텀 이벤트 발생
        window.dispatchEvent(new Event('userDataChanged'));
        
        router.push('/');
      } else {
        // 로그인 실패 시 모달 표시
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      // 서버 오류 시에도 모달 표시
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  // 오류 모달 닫기 함수
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직
    console.log('카카오 로그인 기능을 구현 중입니다.');
  };

  const handleAppleLogin = () => {
    // Apple 로그인 로직
    console.log('Apple 로그인 기능을 구현 중입니다.');
  };

  const handleLineLogin = () => {
    // 라인 로그인 로직
    console.log('라인 로그인 기능을 구현 중입니다.');
  };

  if (showEmailForm) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
        {/* 헤더 영역 */}
        <Header />
        
        {/* 뒤로가기 영역 - 로고와 같은 위치 */}
        <div className="pt-20 px-4">
            <button 
              onClick={() => setShowEmailForm(false)}
            className="flex items-center text-label-common_6 hover:text-label-common_5 transition-colors"
              style={{ color: '#484760' }}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
        </div>

        {/* 이메일 로그인 폼 */}
        <div className="flex items-center justify-center py-12 px-4">
          <div className="w-[369px]">

            {/* 로그인 영역 */}
            <div>
            {/* 로그인 헤더 */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold leading-[150%] text-inherit" style={{ color: '#313142' }}>
                이메일로 로그인
                </h1>
            </div>
            
            {/* 로그인 폼 */}
            <div className="flex flex-col gap-[32px] w-full">
              <style jsx>{`
                .babitalk-input::placeholder {
                  color: #7E7E8F;
                  font-size: 13px;
                }
              `}</style>
              
              <div className="flex flex-col gap-[24px]">
                <form className="flex flex-col gap-[24px]" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-[10px] w-full">
                    <h5 className="leading-[150%] text-inherit text-[13px] font-semibold" style={{ color: '#313142' }}>
                      이메일
                    </h5>
                    <div>
                      <div className={`border border-[1.5px] focus-within:border-outline-common_4 bg-[#fff] rounded-[12px] w-full px-[12px] py-[13px] flex items-center justify-between gap-1.5 ${
                        fieldErrors.email ? '!border-[#FB545E]' : 'border-[#ececef]'
                      }`}>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                          className={`babitalk-input text-label-common_5 focus:text-[#484760] [font-variant-numeric:lining-nums_tabular-nums] [font-feature-settings:'salt'_on] leading-[150%] flex-1 bg-inherit text-[13px] font-normal focus:outline-none ${
                            fieldErrors.email ? 'text-[#F82D3E]' : ''
                          }`}
                      style={{ 
                            color: fieldErrors.email ? '#F82D3E' : '#313142'
                          }}
                          placeholder="이메일을 입력해주세요"
                        />
                      </div>
                      {fieldErrors.email && (
                        <div className="mt-1.5 flex items-center justify-between">
                          <p className="[font-variant-numeric:lining-nums_tabular-nums] [font-feature-settings:'salt'_on] leading-[150%] text-[#FB545E] flex gap-1 items-center text-[13px] font-normal">
                            <span className="block text-[#FB545E] material-symbols-rounded" style={{ fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: '16px' }}>
                              error
                            </span>
                            {fieldErrors.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[10px] w-full">
                    <h5 className="leading-[150%] text-inherit text-[13px] font-semibold" style={{ color: '#313142' }}>
                      비밀번호
                    </h5>
                    <div>
                      <div className={`border border-[1.5px] focus-within:border-outline-common_4 bg-[#fff] rounded-[12px] w-full px-[12px] py-[13px] flex items-center justify-between gap-1.5 ${
                        fieldErrors.password ? '!border-[#FB545E]' : 'border-[#ececef]'
                      }`}>
                    <input
                      id="password"
                      name="password"
                          type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                          className={`babitalk-input text-label-common_5 focus:text-[#484760] [font-variant-numeric:lining-nums_tabular-nums] [font-feature-settings:'salt'_on] leading-[150%] flex-1 bg-inherit text-[13px] font-normal focus:outline-none ${
                            fieldErrors.password ? 'text-[#F82D3E]' : ''
                          }`}
                      style={{ 
                            color: fieldErrors.password ? '#F82D3E' : '#313142'
                          }}
                          placeholder="비밀번호를 입력해주세요"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="flex-shrink-0 p-1"
                          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                        >
                          {showPassword ? (
                            // 눈 열림 아이콘 (비밀번호가 보일 때) - 바비톡 SVG 사용
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" fill="none">
                              <path fill="#7E7E8F" d="M8.5 10.667q1.25 0 2.125-.875a2.9 2.9 0 0 0 .875-2.125q0-1.25-.875-2.125A2.9 2.9 0 0 0 8.5 4.667q-1.25 0-2.125.875A2.9 2.9 0 0 0 5.5 7.667q0 1.25.875 2.125a2.9 2.9 0 0 0 2.125.875m0-1.2q-.75 0-1.275-.525A1.74 1.74 0 0 1 6.7 7.667q0-.75.525-1.275T8.5 5.867t1.275.525.525 1.275-.525 1.275-1.275.525m0 3.2q-2.233 0-4.075-1.2A8.6 8.6 0 0 1 1.517 8.3a1.272 1.272 0 0 1-.125-.958q.042-.159.125-.309a8.6 8.6 0 0 1 2.908-3.166 7.3 7.3 0 0 1 4.075-1.2q2.233 0 4.075 1.2a8.6 8.6 0 0 1 2.908 3.166q.084.15.125.309a1.27 1.27 0 0 1 0 .65 1.3 1.3 0 0 1-.125.308 8.6 8.6 0 0 1-2.908 3.167 7.3 7.3 0 0 1-4.075 1.2m0-1.334q1.883 0 3.458-.991a6.5 6.5 0 0 0 2.409-2.675 6.5 6.5 0 0 0-2.409-2.675A6.36 6.36 0 0 0 8.5 4q-1.883 0-3.458.992a6.5 6.5 0 0 0-2.409 2.675 6.5 6.5 0 0 0 2.409 2.675 6.36 6.36 0 0 0 3.458.991"/>
                            </svg>
                          ) : (
                            // 눈 닫힘 아이콘 (비밀번호가 숨겨질 때 - 기본 상태) - 바비톡 실제 SVG
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" fill="none">
                              <path fill="#7E7E8F" d="M10.617 5.55q.483.483.708 1.1.225.616.158 1.267a.56.56 0 0 1-.183.425.6.6 0 0 1-.433.175.58.58 0 0 1-.425-.175.58.58 0 0 1-.175-.425 1.6 1.6 0 0 0-.05-.834A1.7 1.7 0 0 0 9.8 6.4a1.9 1.9 0 0 0-.683-.433q-.4-.15-.85-.067a.57.57 0 0 1-.425-.183.6.6 0 0 1-.175-.434q0-.25.175-.425a.58.58 0 0 1 .425-.175 2.76 2.76 0 0 1 1.25.159q.615.225 1.1.708M8.5 4q-.317 0-.617.025t-.6.092a.72.72 0 0 1-.508-.084.68.68 0 0 1-.308-.4.63.63 0 0 1 .058-.516.57.57 0 0 1 .408-.3q.384-.084.775-.117t.792-.033q2.283 0 4.175 1.2A7.86 7.86 0 0 1 15.567 7.1a1.25 1.25 0 0 1 .133.567q0 .15-.025.291a1 1 0 0 1-.092.275q-.3.667-.741 1.25-.442.585-.975 1.067a.56.56 0 0 1-.467.15.6.6 0 0 1-.433-.267.74.74 0 0 1-.142-.508.69.69 0 0 1 .225-.458q.4-.384.733-.834.334-.45.584-.966a6.5 6.5 0 0 0-2.409-2.675A6.36 6.36 0 0 0 8.5 4m0 8.667a7.3 7.3 0 0 1-4.083-1.209A8.66 8.66 0 0 1 1.5 8.283a1 1 0 0 1-.125-.291 1.3 1.3 0 0 1-.042-.325q0-.167.034-.317.033-.15.116-.3.334-.667.775-1.275a6.8 6.8 0 0 1 1.009-1.108l-1.384-1.4a.65.65 0 0 1-.175-.475.65.65 0 0 1 .192-.459.63.63 0 0 1 .467-.183q.283 0 .466.183l11.334 11.334a.65.65 0 0 1 .191.458.62.62 0 0 1-.191.475.63.63 0 0 1-.467.183.63.63 0 0 1-.467-.183L10.9 12.3a8 8 0 0 1-2.4.367M4.2 5.6a7 7 0 0 0-.883.95 6 6 0 0 0-.684 1.117 6.5 6.5 0 0 0 2.409 2.675 6.36 6.36 0 0 0 3.458.991q.333 0 .65-.041.317-.042.65-.092l-.6-.633a3 3 0 0 1-.35.075 2.4 2.4 0 0 1-.35.025 2.9 2.9 0 0 1-2.125-.875A2.9 2.9 0 0 1 5.5 7.667q0-.185.025-.35.026-.167.075-.35z"/>
                            </svg>
                          )}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <div className="mt-1.5 flex items-center justify-between">
                          <p className="[font-variant-numeric:lining-nums_tabular-nums] [font-feature-settings:'salt'_on] leading-[150%] text-[#FB545E] flex gap-1 items-center text-[13px] font-normal">
                            <span className="block text-[#FB545E] material-symbols-rounded" style={{ fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: '16px' }}>
                              error
                            </span>
                            {fieldErrors.password}
                          </p>
                        </div>
                      )}
                      {!fieldErrors.password && (
                        <div className="mt-1.5">
                          <p className="text-[#7E7E8F] text-[13px] font-normal">
                            숫자, 영문자, 특수문자 포함 9 - 20자로 입력해주세요.
                          </p>
                  </div>
                      )}
                </div>
                  </div>

                  <div className="flex items-center justify-end pt-2">
                  <div className="text-sm">
                    <Link href="/auth/forgot-password" className="font-medium text-label-common_6 hover:opacity-80 transition-opacity" style={{ color: '#484760' }}>
                      비밀번호를 잊으셨나요?
                    </Link>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                      disabled={loading || !isFormValid()}
                      className="w-full flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] transition-all duration-200"
                    style={{ 
                        height: '56px',
                        backgroundColor: (isFormValid() && !loading) ? '#FF528D' : '#EFEFEF',
                        color: (isFormValid() && !loading) ? 'white' : '#BDBDD4',
                        cursor: (isFormValid() && !loading) ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {loading ? '로그인 중...' : '로그인'}
                  </button>
                </div>
              </form>
              </div>
            </div>

            {/* 회원가입 링크 */}
            <div className="flex justify-center gap-[8px] mt-[40px]">
              <div className="text-[#7e7e8f]">아직 회원이 아니신가요?</div>
              <Link href="/auth/register" className="text-[#FF528D] font-bold cursor-pointer">
                회원가입
                </Link>
            </div>
          </div>
        </div>

        {/* 로그인 오류 모달 */}
        <LoginErrorModal 
          isOpen={showErrorModal} 
          onClose={handleCloseErrorModal} 
        />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* 헤더 영역 */}
      <Header />
      
      {/* 메인 콘텐츠 영역 */}
      <div className="pt-16 flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-sm w-full text-center">
          
          {/* 메인 메시지 */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-label-common_5 leading-relaxed" style={{ color: '#313142' }}>
              아름다워지는 여정으로<br />
              함께 떠나볼까요
            </h2>
          </div>

          {/* 로그인 버튼들 */}
          <div>
            {/* 카카오로 시작하기 */}
            <button
              onClick={handleKakaoLogin}
              className="flex justify-center h-[60px] w-full px-6 rounded-[16px] items-center gap-[12px] font-bold bg-[#fee500] text-[#191919] transition-all duration-200 hover:opacity-90"
              style={{ marginBottom: '12px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width="24" height="24">
                <path fill="currentColor" fillRule="evenodd" d="M10 1.667C4.937 1.667.833 4.902.833 8.894c0 2.581 1.716 4.848 4.297 6.124l-.006.02c-.154.534-.897 3.098-.926 3.302 0 0-.019.155.082.215a.28.28 0 0 0 .218.013c.277-.04 3.091-2.006 3.796-2.5l.082-.056q.808.111 1.624.11c5.063 0 9.167-3.236 9.167-7.228S15.063 1.667 10 1.667" clipRule="evenodd" opacity="0.9"></path>
              </svg>
              카카오톡으로 시작하기
            </button>

            {/* Apple로 시작하기 */}
            <button
              onClick={handleAppleLogin}
              className="flex justify-center h-[60px] w-full px-6 rounded-[16px] items-center gap-[12px] font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#000000', marginBottom: '12px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.79.805-3.68 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.708-1.702z"/>
              </svg>
              Apple로 시작하기
            </button>

            {/* 라인으로 시작하기 */}
            <button
              onClick={handleLineLogin}
              className="flex justify-center h-[60px] w-full px-6 rounded-[16px] items-center gap-[12px] font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: '#00c300', marginBottom: '12px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.627.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              라인으로 시작하기
            </button>

            {/* 이메일로 시작하기 */}
            <button
              onClick={() => setShowEmailForm(true)}
              className="flex justify-center h-[60px] w-full px-6 rounded-[16px] items-center gap-[12px] font-bold transition-all duration-200 hover:bg-gray-50 border"
              style={{ 
                backgroundColor: '#ffffff', 
                color: '#191919',
                borderColor: '#ececef'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 6.667L10 11.667l7.5-5M4.167 15.833h11.666A1.667 1.667 0 0017.5 14.167V5.833A1.667 1.667 0 0015.833 4.167H4.167A1.667 1.667 0 002.5 5.833v8.334A1.667 1.667 0 004.167 15.833z" />
              </svg>
              이메일로 시작하기
            </button>
          </div>

          {/* 하단 안내 텍스트 */}
          <div className="mt-12">
            <p className="text-xs text-label-common_3 leading-relaxed" style={{ color: '#8e8e93' }}>
              불법 촬영물 업로드 시 법적 처벌을 받을 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 