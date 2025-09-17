"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';

export default function TermsPage() {
  const router = useRouter();
  const [agreements, setAgreements] = useState({
    all: false,
    age14: false,
    terms: false,
    privacy: false,
    thirdParty: false,
    marketing: false,
    push: false,
    sms: false,
    email: false
  });

  // 필수 약관 항목들
  const requiredTerms = ['age14', 'terms', 'privacy', 'thirdParty'];
  
  // 전체 동의 처리
  const handleAllAgreement = (checked) => {
    const newAgreements = {};
    Object.keys(agreements).forEach(key => {
      newAgreements[key] = checked;
    });
    setAgreements(newAgreements);
  };

  // 개별 약관 동의 처리
  const handleAgreement = (key, checked) => {
    const newAgreements = { ...agreements, [key]: checked };
    
    // 전체 동의 상태 업데이트
    const allChecked = Object.keys(newAgreements)
      .filter(k => k !== 'all')
      .every(k => newAgreements[k]);
    
    newAgreements.all = allChecked;
    setAgreements(newAgreements);
  };

  // 마케팅 동의 처리 (푸쉬, SMS, 이메일)
  const handleMarketingAgreement = (checked) => {
    const newAgreements = {
      ...agreements,
      marketing: checked,
      push: checked,
      sms: checked,
      email: checked
    };
    
    // 전체 동의 상태 업데이트
    const allChecked = Object.keys(newAgreements)
      .filter(k => k !== 'all')
      .every(k => newAgreements[k]);
    
    newAgreements.all = allChecked;
    setAgreements(newAgreements);
  };

  // 다음 단계로 이동
  const handleNext = () => {
    // 필수 약관이 모두 체크되었는지 확인
    const requiredChecked = requiredTerms.every(term => agreements[term]);
    
    if (requiredChecked) {
      // 약관 동의 정보를 localStorage에 저장
      localStorage.setItem('agreements', JSON.stringify(agreements));
      // 다음 단계로 이동
      router.push('/auth/register/interests');
    } else {
      // 필수 약관 미동의 시 버튼이 비활성화되어 있으므로 이 부분은 실행되지 않음
      console.log('필수 약관에 모두 동의해주세요.');
    }
  };

  const handleClose = () => {
    router.back();
  };

  // 필수 약관이 모두 체크되었는지 확인
  const isRequiredTermsChecked = requiredTerms.every(term => agreements[term]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      {/* 헤더 영역 */}
      <Header />
      
      <div className="flex-1 flex flex-col">
        {/* 뒤로가기 영역 */}
        <div className="pt-20 px-4 pb-6">
          <button 
            onClick={handleClose}
            className="flex items-center text-label-common_6 hover:text-label-common_5 transition-colors"
            style={{ color: '#484760' }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 px-4">
          <div className="mb-8">
            {/* 메인 텍스트 */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold leading-[150%] text-inherit" style={{ color: '#313142' }}>
                약관에 동의해주세요
              </h1>
            </div>
          </div>

          {/* 약관 동의 영역 */}
          <div className="flex-1 mb-8 pb-20">
            <div className="space-y-4">
              
              {/* 전체 동의 */}
              <div className="p-4 bg-gray-50 rounded-[12px]">
                <button
                  onClick={() => handleAllAgreement(!agreements.all)}
                  className="flex items-center gap-3 w-full"
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    agreements.all 
                      ? 'bg-[#FF528D] border-[#FF528D]' 
                      : 'bg-white border-gray-300'
                  }`}>
                    {agreements.all && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-semibold" style={{ color: '#313142' }}>
                    아래 내용 모두 동의하기
                  </span>
                </button>
              </div>

                             {/* 개별 약관들 */}
               <div className="space-y-1">
                 
                 {/* 만 14세 이상 */}
                 <div className="flex items-center gap-3 py-2 pl-4">
                  <button
                    onClick={() => handleAgreement('age14', !agreements.age14)}
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: agreements.age14 ? '#FF528D' : 'white',
                      borderColor: agreements.age14 ? '#FF528D' : '#d1d5db'
                    }}
                  >
                    {agreements.age14 && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                  <h6 className="text-label-common_4 leading-[150%] text-inherit text-sm font-medium flex-1">
                    (필수) 만 14세 이상 이용 가능
                  </h6>
                </div>

                                 {/* 이용약관 */}
                 <div className="flex items-center gap-3 py-2 pl-4">
                  <button
                    onClick={() => handleAgreement('terms', !agreements.terms)}
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: agreements.terms ? '#FF528D' : 'white',
                      borderColor: agreements.terms ? '#FF528D' : '#d1d5db'
                    }}
                  >
                    {agreements.terms && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                  <h6 className="text-label-common_4 leading-[150%] text-inherit text-sm font-medium flex-1">
                    (필수) 이용약관
                  </h6>
                  <button className="p-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>

                                 {/* 개인정보 수집 및 이용 */}
                 <div className="flex items-center gap-3 py-2 pl-4">
                  <button
                    onClick={() => handleAgreement('privacy', !agreements.privacy)}
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: agreements.privacy ? '#FF528D' : 'white',
                      borderColor: agreements.privacy ? '#FF528D' : '#d1d5db'
                    }}
                  >
                    {agreements.privacy && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                  <h6 className="text-label-common_4 leading-[150%] text-inherit text-sm font-medium flex-1">
                    (필수) 개인정보 수집 및 이용
                  </h6>
                  <button className="p-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>

                                 {/* 개인정보 처리 위탁 */}
                 <div className="flex items-center gap-3 py-2 pl-4">
                  <button
                    onClick={() => handleAgreement('thirdParty', !agreements.thirdParty)}
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: agreements.thirdParty ? '#FF528D' : 'white',
                      borderColor: agreements.thirdParty ? '#FF528D' : '#d1d5db'
                    }}
                  >
                    {agreements.thirdParty && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                  <h6 className="text-label-common_4 leading-[150%] text-inherit text-sm font-medium flex-1">
                    (필수) 개인정보 처리 위탁
                  </h6>
                  <button className="p-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>

                                 {/* 이벤트/서비스 혜택 알림 */}
                 <div className="flex items-center gap-3 py-2 pl-4">
                  <button
                    onClick={() => handleMarketingAgreement(!agreements.marketing)}
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: agreements.marketing ? '#FF528D' : 'white',
                      borderColor: agreements.marketing ? '#FF528D' : '#d1d5db'
                    }}
                  >
                    {agreements.marketing && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                  <h6 className="text-label-common_4 leading-[150%] text-inherit text-sm font-medium flex-1">
                    (선택) 이벤트 / 서비스 혜택 알림
                  </h6>
                  <button className="p-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>

                {/* 푸쉬 알림, SMS, 이메일 */}
                <div className="pl-8 space-y-2">
                  <div className="flex items-center gap-6">
                                         {/* 푸쉬 알림 */}
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => handleAgreement('push', !agreements.push)}
                         className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                         style={{
                           backgroundColor: agreements.push ? '#FF528D' : 'white',
                           borderColor: agreements.push ? '#FF528D' : '#d1d5db'
                         }}
                       >
                         {agreements.push && (
                           <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                           </svg>
                         )}
                       </button>
                                             <h6 className="text-label-common_4 leading-[150%] text-inherit text-sm font-medium">
                         푸쉬 알림
                       </h6>
                    </div>

                                         {/* SMS */}
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => handleAgreement('sms', !agreements.sms)}
                         className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                         style={{
                           backgroundColor: agreements.sms ? '#FF528D' : 'white',
                           borderColor: agreements.sms ? '#FF528D' : '#d1d5db'
                         }}
                       >
                         {agreements.sms && (
                           <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                           </svg>
                         )}
                       </button>
                                             <h6 className="text-label-common_4 leading-[150%] text-inherit text-sm font-medium">
                         SMS
                       </h6>
                    </div>

                                         {/* 이메일 */}
                     <div className="flex items-center gap-2">
                       <button
                         onClick={() => handleAgreement('email', !agreements.email)}
                         className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                         style={{
                           backgroundColor: agreements.email ? '#FF528D' : 'white',
                           borderColor: agreements.email ? '#FF528D' : '#d1d5db'
                         }}
                       >
                         {agreements.email && (
                           <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                           </svg>
                         )}
                       </button>
                                             <h6 className="text-label-common_4 leading-[150%] text-inherit text-sm font-medium">
                         이메일
                       </h6>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* 플로팅 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4">
          <button
            onClick={handleNext}
            disabled={!isRequiredTermsChecked}
            className="w-full flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] transition-all duration-200"
            style={{ 
              height: '56px',
              backgroundColor: isRequiredTermsChecked ? '#FF528D' : '#EFEFEF',
              color: isRequiredTermsChecked ? 'white' : '#BDBDD4',
              cursor: isRequiredTermsChecked ? 'pointer' : 'not-allowed'
            }}
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
} 