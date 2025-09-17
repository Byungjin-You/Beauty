"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';

export default function TreatmentTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');

  // 치료 종류 옵션
  const treatmentOptions = [
    {
      id: 'procedure',
      title: '시술',
      description: '예시) 레이저 리프팅, 필러, 보톡스 등'
    },
    {
      id: 'surgery',
      title: '수술',
      description: '예시) 쌍꺼풀, 양악, 가슴수술 등'
    },
    {
      id: 'both',
      title: '둘 다 찾고 있어요',
      description: ''
    }
  ];

  const handleTypeToggle = (typeId) => {
    setSelectedType(typeId);
  };

  const handleNext = () => {
    if (selectedType) {
      // 치료 타입을 매핑하여 저장
      const typeMapping = {
        'procedure': '시술',
        'surgery': '수술', 
        'both': '둘 다 찾고 있어요'
      };
      
      localStorage.setItem('selectedType', typeMapping[selectedType]);
      router.push('/auth/register/recommendations');
    }
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      {/* 헤더 영역 */}
      <Header />
      
      <div className="flex-1 flex flex-col">
        {/* 뒤로가기 영역 - 로그인 페이지와 동일한 간격 */}
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
            {/* 메인 텍스트와 페이지네이션 */}
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-semibold leading-[150%] text-inherit" style={{ color: '#313142' }}>
                현재 찾고있는 이벤트는<br />
                어떤 종류인가요?
              </h1>
              <div className="text-[#FF528D] text-sm font-semibold">3/4</div>
            </div>
            
            {/* 서브 텍스트 - 로그인/회원가입 페이지와 동일한 스타일 */}
            <p className="text-[13px] font-normal leading-[150%]" style={{ color: '#7E7E8F' }}>
              선택한 종류에 맞는 시술 정보를 추천받을 수 있어요.
            </p>
          </div>

          {/* 치료 종류 선택 영역 */}
          <div className="flex-1 mb-8 pb-20 px-2">
            <div>
              {treatmentOptions.map((option, index) => {
                const isSelected = selectedType === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleTypeToggle(option.id)}
                    className={`w-full text-left rounded-[12px] border transition-all duration-200 ${index > 0 ? 'mt-8' : ''} ${
                      isSelected 
                        ? 'border-[#FF528D] bg-white' 
                        : 'border-outline-common_2 bg-white'
                    }`}
                    style={{
                      padding: '1rem 1.5rem'
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* 라디오 버튼 스타일 원형 아이콘 */}
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center transition-all duration-200 ${
                        isSelected 
                          ? 'border-[#FF528D] bg-white' 
                          : 'border-gray-300 bg-white'
                      }`}>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF528D]"></div>
                        )}
                      </div>
                      
                      {/* 텍스트 영역 */}
                      <div className="flex-1">
                        <h3 className={`text-base font-semibold leading-[150%] mb-1 ${
                          isSelected ? 'text-[#FF528D]' : 'text-inherit'
                        }`} style={{ color: isSelected ? '#FF528D' : '#313142' }}>
                          {option.title}
                        </h3>
                        {option.description && (
                          <p className="text-[13px] font-normal leading-[150%]" style={{ color: '#7E7E8F' }}>
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 플로팅 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4">
          <button
            onClick={handleNext}
            disabled={!selectedType}
            className="w-full flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] transition-all duration-200"
            style={{ 
              height: '56px',
              backgroundColor: selectedType ? '#FF528D' : '#EFEFEF',
              color: selectedType ? 'white' : '#BDBDD4',
              cursor: selectedType ? 'pointer' : 'not-allowed'
            }}
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
} 