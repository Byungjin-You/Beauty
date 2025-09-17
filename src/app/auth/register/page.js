"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import LoginErrorModal from '../../../components/common/LoginErrorModal';
import ExistingAccountModal from '../../../components/common/ExistingAccountModal';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showExistingAccountModal, setShowExistingAccountModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 비밀번호 보기/숨기기 토글
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
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

  // 회원가입 버튼 활성화 조건 체크
  const isFormValid = () => {
    const hasEmail = formData.email.trim().length > 0;
    const hasPassword = formData.password.trim().length > 0;
    const hasConfirmPassword = formData.confirmPassword.trim().length > 0;
    const isEmailValid = hasEmail && validateEmail(formData.email);
    const isPasswordValid = hasPassword && validatePassword(formData.password);
    const isPasswordMatch = formData.password === formData.confirmPassword;
    
    return hasEmail && hasPassword && hasConfirmPassword && isEmailValid && isPasswordValid && isPasswordMatch;
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

    if (name === 'confirmPassword') {
      if (value && formData.password && value !== formData.password) {
        setFieldErrors(prev => ({
          ...prev,
          confirmPassword: '비밀번호가 일치하지 않습니다.'
        }));
      } else {
        setFieldErrors(prev => ({
          ...prev,
          confirmPassword: ''
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

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setShowErrorModal(true);
      return;
    }

    // 폼 검증이 통과했으면 약관 동의 페이지로 이동
    if (isFormValid()) {
      // 회원가입 데이터를 localStorage에 임시 저장
      localStorage.setItem('tempRegisterData', JSON.stringify(formData));
      router.push('/auth/register/terms');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
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
        // 이미 가입된 계정인지 확인
        if (response.status === 409 || 
            (data.message && (
              data.message.includes('이미 가입된') || 
              data.message.includes('already exists') ||
              data.message.includes('duplicate') ||
              data.message.includes('EMAIL_ALREADY_EXISTS')
            ))) {
          setShowExistingAccountModal(true);
        } else {
          // 기타 회원가입 실패 시 일반 오류 모달 표시
          setShowErrorModal(true);
        }
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
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

  // 이미 가입된 계정 모달 닫기 함수
  const handleCloseExistingAccountModal = () => {
    setShowExistingAccountModal(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      {/* 헤더 영역 */}
      <Header />
      
      {/* 뒤로가기 영역 - 로고와 같은 위치 */}
      <div className="pt-20 px-4">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-label-common_6 hover:text-label-common_5 transition-colors"
          style={{ color: '#484760' }}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* 이메일 회원가입 폼 */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-[369px]">
          {/* 회원가입 헤더 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold leading-[150%] text-inherit" style={{ color: '#313142' }}>
              이메일로 회원가입
            </h1>
          </div>

            {/* 회원가입 폼 */}
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

                  <div className="flex flex-col gap-[10px] w-full">
                    <h5 className="leading-[150%] text-inherit text-[13px] font-semibold" style={{ color: '#313142' }}>
                      비밀번호 확인
                    </h5>
                    <div>
                      <div className={`border border-[1.5px] focus-within:border-outline-common_4 bg-[#fff] rounded-[12px] w-full px-[12px] py-[13px] flex items-center justify-between gap-1.5 ${
                        fieldErrors.confirmPassword ? '!border-[#FB545E]' : 'border-[#ececef]'
                      }`}>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`babitalk-input text-label-common_5 focus:text-[#484760] [font-variant-numeric:lining-nums_tabular-nums] [font-feature-settings:'salt'_on] leading-[150%] flex-1 bg-inherit text-[13px] font-normal focus:outline-none ${
                            fieldErrors.confirmPassword ? 'text-[#F82D3E]' : ''
                          }`}
                          style={{ 
                            color: fieldErrors.confirmPassword ? '#F82D3E' : '#313142'
                          }}
                          placeholder="비밀번호를 다시 입력해주세요"
                        />
                        <button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="flex-shrink-0 p-1"
                          aria-label={showConfirmPassword ? "비밀번호 확인 숨기기" : "비밀번호 확인 보기"}
                        >
                          {showConfirmPassword ? (
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
                      {fieldErrors.confirmPassword && (
                        <div className="mt-1.5 flex items-center justify-between">
                          <p className="[font-variant-numeric:lining-nums_tabular-nums] [font-feature-settings:'salt'_on] leading-[150%] text-[#FB545E] flex gap-1 items-center text-[13px] font-normal">
                            <span className="block text-[#FB545E] material-symbols-rounded" style={{ fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: '16px' }}>
                              error
                            </span>
                            {fieldErrors.confirmPassword}
                          </p>
                        </div>
                      )}
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
                      {loading ? '처리 중...' : '다음'}
                    </button>
                  </div>
                </form>
              </div>

              {/* 로그인 링크 */}
              <div className="flex justify-center gap-[8px] mt-[40px]">
                <div className="text-[#7e7e8f]">이미 회원이신가요?</div>
                <Link href="/auth/login" className="text-[#FF528D] font-bold cursor-pointer">
                  로그인
                </Link>
              </div>

              {/* 테스트 버튼 (개발용) */}
              <div className="flex justify-center mt-[20px]">
                <button
                  onClick={() => setShowExistingAccountModal(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
                  type="button"
                >
                  이미 가입된 계정 모달 테스트
                </button>
              </div>
            </div>

            {/* 회원가입 오류 모달 */}
            <LoginErrorModal 
              isOpen={showErrorModal} 
              onClose={handleCloseErrorModal} 
            />

            {/* 이미 가입된 계정 모달 */}
            <ExistingAccountModal 
              isOpen={showExistingAccountModal} 
              onClose={handleCloseExistingAccountModal} 
            />
          </div>
        </div>
            </div>
    );
} 