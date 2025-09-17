"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';

export default function InterestsPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState([]); // 기본으로 아무것도 선택 안됨
  const [isInterestChangeMode, setIsInterestChangeMode] = useState(false); // 관심 시술 변경 모드 여부
  const maxSelection = 2;

  // 관심 시술 변경 모드인지 확인하고 기존 데이터 로드
  useEffect(() => {
    const changeMode = localStorage.getItem('isInterestChangeMode');
    if (changeMode === 'true') {
      setIsInterestChangeMode(true);
      
      // 기존 사용자 데이터에서 선택된 카테고리 불러오기
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user.selectedCategories && user.selectedCategories.length > 0) {
            setSelectedCategories(user.selectedCategories);
          }
        } catch (error) {
          console.error('사용자 데이터 로드 오류:', error);
        }
      }
    }
  }, []);

  // 카테고리별 이미지 컴포넌트
  const CategoryIcon = ({ category, isSelected }) => {
    // 기타 항목은 SVG 아이콘으로 표시
    if (category === 'etc') {
      return (
        <div 
          className="w-full h-full"
          style={{
            borderRadius: '8px',
            border: isSelected ? '3px solid #FF528D' : '3px solid transparent',
            transition: 'border-color 0.2s ease'
          }}
        >
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              borderRadius: '6px',
              backgroundColor: '#F8F8F8'
            }}
          >
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: isSelected ? "#FF528D" : "#999999"
            }}>
              ETC
            </span>
          </div>
        </div>
      );
    }
    
    // 일반 이미지 카테고리
    return (
      <div 
        className="w-full h-full"
                  style={{
            borderRadius: '8px',
            border: isSelected ? '3px solid #FF528D' : '3px solid transparent',
            transition: 'border-color 0.2s ease'
          }}
      >
        <img 
          src={`/images/${category}-icon.jpg`}
          alt={`${category} 아이콘`} 
          className="w-full h-full object-cover"
          style={{
            borderRadius: '6px'
          }}
        />
      </div>
    );
  };

  // 성형 부위 데이터
  const categories = [
    { id: 'face', name: '얼굴형' },
    { id: 'skin', name: '피부' },
    { id: 'hair', name: '헤어' },
    { id: 'nose', name: '코' },
    { id: 'eye', name: '눈' },
    { id: 'forahead', name: '이마' },
    { id: 'mouth', name: '입술' },
    { id: 'chest', name: '가슴' },
    { id: 'bodyline', name: '바디라인' },
    { id: 'yzone', name: 'Y존' },
    { id: 'waxing', name: '제모' },
    { id: 'teeth', name: '치아' },
    { id: 'etc', name: '기타' }
  ];

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(categoryId);
      
      if (isSelected) {
        // 이미 선택된 경우 제거
        return prev.filter(id => id !== categoryId);
      } else {
        // 선택되지 않은 경우
        if (prev.length >= maxSelection) {
          // 최대 선택 수에 도달한 경우, 첫 번째 항목을 제거하고 새 항목 추가
          return [...prev.slice(1), categoryId];
        } else {
          // 최대 선택 수에 도달하지 않은 경우 추가
          return [...prev, categoryId];
        }
      }
    });
  };

  const handleNext = () => {
    if (selectedCategories.length > 0) {
      // 선택된 카테고리를 localStorage에 저장
      localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
      
      if (isInterestChangeMode) {
        // 관심 시술 변경 모드: 기존 사용자의 임시 데이터도 저장
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            // 기존 사용자 정보를 tempRegisterData로 저장 (회원가입 플로우 재사용)
            localStorage.setItem('tempRegisterData', JSON.stringify({
              name: user.name,
              email: user.email,
              password: 'existing_user' // 비밀번호는 변경하지 않음을 표시
            }));
            // 기존 약관 동의 정보도 저장
            if (user.agreements) {
              localStorage.setItem('agreements', JSON.stringify(user.agreements));
            }
          } catch (error) {
            console.error('사용자 데이터 저장 오류:', error);
          }
        }
      }
      
      // 다음 단계로 이동
      router.push('/auth/register/symptoms');
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
                고민 부위를 선택하면<br />
                시술을 추천해드려요.
              </h1>
              <div className="text-[#FF528D] text-sm font-semibold">1/4</div>
            </div>
            
            {/* 서브 텍스트 - 로그인/회원가입 페이지와 동일한 스타일 */}
            <p className="text-[13px] font-normal leading-[150%]" style={{ color: '#7E7E8F' }}>
              최대 {maxSelection}개까지 선택할 수 있어요.
            </p>
          </div>

          {/* 카테고리 그리드 */}
          <div className="grid grid-cols-4 gap-6 mb-8 pb-20">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryToggle(category.id)}
                                                        className="flex flex-col items-center justify-between aspect-square p-2 relative gap-3"
                >
                  <div className="w-full aspect-square">
                    <CategoryIcon category={category.id} isSelected={isSelected} />
                  </div>
                  <div className="text-center pb-1">
                    <span 
                      className="text-label-common_4 leading-[150%] text-sm font-medium"
                      style={{ 
                        color: isSelected ? '#FF528D' : '#555555' 
                      }}
                    >
                      {category.name}
                    </span>
                  </div>

                </button>
              );
            })}
          </div>
        </div>

        {/* 플로팅 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4">
          <button
            onClick={handleNext}
            disabled={selectedCategories.length === 0}
            className="w-full flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] transition-all duration-200"
            style={{ 
              height: '56px',
              backgroundColor: selectedCategories.length > 0 ? '#FF528D' : '#EFEFEF',
              color: selectedCategories.length > 0 ? 'white' : '#BDBDD4',
              cursor: selectedCategories.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
} 