'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { adminRankings, rankingTabs } from '../../../data/admin-rankings';
import CategoryFilter from '../../../components/admin/CategoryFilter';
import { hwahaeCategories } from '../../../data/hwahae-categories';
import ProductDetailModal from '../../../components/admin/ProductDetailModal';

export default function AdminRankingsPage() {
  // 버튼 포커스 스타일을 위한 CSS 주입
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      button:focus {
        outline: none !important;
      }
      button::-moz-focus-inner {
        border: 0 !important;
      }
      button:active {
        transform: none !important;
      }
      button * {
        background-color: transparent !important;
        border: none !important;
        outline: none !important;
      }
      button svg,
      button span,
      button div {
        background-color: transparent !important;
        border: none !important;
        outline: none !important;
      }
      button svg path {
        background-color: transparent !important;
        border: none !important;
        outline: none !important;
      }
      /* 진행률 바 애니메이션 */
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(200%);
        }
      }
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        animation: fade-in 0.3s ease-out;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [activeTab, setActiveTab] = useState('trending');
  const [currentData, setCurrentData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState({ current: 0, total: 0, status: '' });
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [bulkUpdateProgress, setBulkUpdateProgress] = useState({ current: 0, total: 0, currentCategory: '' });
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showTestResults, setShowTestResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(hwahaeCategories.find(cat => cat.name === '전체') || null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(hwahaeCategories.find(cat => cat.name === '전체')?.subcategories?.[0] || null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (activeTab === 'trending') {
      // 급상승 탭의 경우 기본적으로 "전체 > 카테고리 전체" themeId로 로드
      console.log('🚀 급상승 탭 초기 로드 시작');
      loadRankingDataByThemeIdWithFallback('5102');
    } else {
      loadRankingData(activeTab);
    }
  }, [activeTab]);

  // themeId로 데이터 로드 (기존 데이터 fallback 포함, 깜빡거림 방지)
  const loadRankingDataByThemeIdWithFallback = async (themeId) => {
    console.log(`🔍 themeId로 데이터 로드 시작: ${themeId}`);
    
    // 기존 데이터 백업 (깜빡거림 방지)
    const previousData = currentData;
    
    // 부드러운 로딩 상태 (기존 데이터 유지)
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/rankings?themeId=${themeId}&limit=100`);
      const result = await response.json();
      
      console.log('📊 API 응답:', result);
      
      if (result.success && result.data.length > 0) {
        console.log(`✅ themeId 데이터 로드 성공: ${result.data.length}개`);
        // 부드러운 전환을 위해 약간의 딜레이
        setTimeout(() => {
          setCurrentData(result.data);
          setIsLoading(false);
        }, 150);
      } else {
        console.log('⚠️ themeId 데이터 없음, 기존 trending 데이터로 fallback');
        // themeId 데이터가 없으면 기존 trending 데이터 로드 (로딩 상태 유지)
        const fallbackResponse = await fetch(`/api/admin/rankings?category=trending&limit=100`);
        const fallbackResult = await fallbackResponse.json();
        
        if (fallbackResult.success) {
          setTimeout(() => {
            setCurrentData(fallbackResult.data);
            setIsLoading(false);
          }, 150);
        } else {
          // 모든 시도가 실패하면 기존 데이터 유지
          setTimeout(() => {
            setCurrentData(previousData);
            setIsLoading(false);
          }, 150);
        }
      }
    } catch (error) {
      console.error('❌ 데이터 로드 오류:', error);
      // 오류 시 기존 데이터 유지
      setTimeout(() => {
        setCurrentData(previousData);
        setIsLoading(false);
      }, 150);
    }
  };

  // 데이터베이스에서 랭킹 데이터 로드
  const loadRankingData = async (category) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/rankings?category=${category}&limit=100`);
      const result = await response.json();
      
      if (result.success) {
        setCurrentData(result.data);
      } else {
        // DB에 데이터가 없으면 기본 데이터 사용
        setCurrentData(adminRankings[category] || []);
      }
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      // 오류 시 기본 데이터 사용
      setCurrentData(adminRankings[category] || []);
    } finally {
      setIsLoading(false);
    }
  };

  // 제품 상세 보기
  const handleProductDetail = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (mainCategory, subCategory) => {
    console.log('카테고리 선택:', { 
      mainCategory: mainCategory.name, 
      subCategory: subCategory.name,
      themeId: subCategory.themeId 
    });
    
    if (!mainCategory || !subCategory) {
      console.error('카테고리 데이터가 없습니다:', { mainCategory, subCategory });
      return;
    }
    
    setSelectedCategory(mainCategory);
    setSelectedSubCategory(subCategory);
    // 필터를 닫지 않고 열어둠 - 사용자가 다른 카테고리를 선택할 수 있도록
    // setShowCategoryFilter(false);
    
    // 선택된 카테고리로 데이터 로드 (fallback 포함)
    if (subCategory.themeId) {
      console.log(`🎯 선택된 카테고리로 데이터 로드: ${mainCategory.name} > ${subCategory.name} (themeId: ${subCategory.themeId})`);
      loadRankingDataByThemeIdWithFallback(subCategory.themeId);
    } else {
      console.error('themeId가 없습니다:', subCategory);
    }
  };

  // themeId로 랭킹 데이터 로드
  const loadRankingDataByThemeId = async (themeId) => {
    console.log(`🔍 themeId로 데이터 로드 시작: ${themeId}`);
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/admin/rankings?themeId=${themeId}&limit=100`);
      const result = await response.json();
      
      console.log('📊 API 응답:', result);
      
      if (result.success) {
        console.log(`✅ 데이터 로드 성공: ${result.data.length}개`);
        setCurrentData(result.data);
      } else {
        console.log('❌ API 실패:', result.message);
        setCurrentData([]);
      }
    } catch (error) {
      console.error('❌ 데이터 로드 오류:', error);
      setCurrentData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 전체 카테고리 일괄 업데이트 함수
  const handleBulkUpdateRankings = async () => {
    setIsBulkUpdating(true);
    setBulkUpdateProgress({ current: 0, total: 0, currentCategory: '준비 중...' });
    
    try {
      const response = await fetch('/api/admin/bulk-update-rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxItems: 100
        })
      });

      const result = await response.json();

      if (result.success) {
        // 현재 선택된 카테고리 데이터 새로고침
        if (selectedSubCategory?.themeId) {
          await loadRankingDataByThemeIdWithFallback(selectedSubCategory.themeId);
        } else {
          await loadRankingData(activeTab);
        }
        
        let alertMessage = `🎉 전체 업데이트 완료!\n\n📊 총 ${result.summary.totalSubCategories}개 서브카테고리\n✅ 성공: ${result.summary.totalUpdated}개 항목\n❌ 오류: ${result.summary.totalErrors}개 카테고리`;
        
        // 오류 발생한 카테고리들 표시
        if (result.errorCategories && result.errorCategories.length > 0) {
          alertMessage += `\n\n❌ 오류 발생 카테고리:`;
          result.errorCategories.forEach((errorCat, index) => {
            alertMessage += `\n${index + 1}. ${errorCat.category} > ${errorCat.subCategory}`;
            alertMessage += `\n   오류: ${errorCat.error}`;
          });
        }
        
        alert(alertMessage);
      } else {
        alert(`❌ 일괄 업데이트 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('일괄 업데이트 오류:', error);
      alert('❌ 일괄 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsBulkUpdating(false);
      setBulkUpdateProgress({ current: 0, total: 0, currentCategory: '' });
    }
  };


  // 랭킹 업데이트 함수 (진행률 표시 포함)
  const handleUpdateRankings = async () => {
    setIsUpdating(true);
    setUpdateProgress({ current: 0, total: 60, status: '크롤링 준비 중...' }); // 총 60단계 (리스트 50 + 상세 10)

    try {
      let progressInterval;
      let detailPhaseStarted = false;
      let currentDetailCount = 0;

      // 진행률 시뮬레이션 (리스트 크롤링 + 상세 페이지 크롤링)
      progressInterval = setInterval(() => {
        setUpdateProgress(prev => {
          // 리스트 크롤링 단계 (0~50)
          if (prev.current < 50) {
            const increment = Math.floor(Math.random() * 3) + 2;
            const newCurrent = Math.min(prev.current + increment, 50);


            return {
              current: newCurrent,
              total: 60,
              status: `리스트 크롤링 중... (${newCurrent}/50 제품)`
            };
          }
          // 상세 페이지 크롤링 단계 (50~60)
          else if (prev.current >= 50 && prev.current < 60) {
            if (!detailPhaseStarted) {
              detailPhaseStarted = true;

              // 상세 페이지는 2초 간격으로 천천히 진행
              setTimeout(() => {
                const detailInterval = setInterval(() => {
                  setUpdateProgress(prevDetail => {
                    currentDetailCount++;
                    if (currentDetailCount <= 10) {
                      return {
                        current: 50 + currentDetailCount,
                        total: 60,
                        status: `상세 페이지 크롤링 중... (${currentDetailCount}/10 페이지)`
                      };
                    } else {
                      clearInterval(detailInterval);
                      return {
                        current: 60,
                        total: 60,
                        status: '데이터 저장 중...'
                      };
                    }
                  });
                }, 2000); // 상세 페이지는 2초마다 하나씩
              }, 1000);

              clearInterval(progressInterval); // 리스트 진행률 업데이트 중지
              return {
                ...prev,
                current: 50,
                status: '상세 페이지 크롤링 준비 중...'
              };
            }
          }
          return prev;
        });
      }, 800); // 리스트는 0.8초마다 업데이트

      const response = await fetch('/api/admin/update-rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: activeTab,
          themeId: selectedSubCategory?.themeId || '5102',
          maxItems: 100
        })
      });

      const result = await response.json();

      // 모든 진행률 인터벌 정리
      setTimeout(() => {
        setUpdateProgress({ current: 60, total: 60, status: '완료!' });
      }, 100);

      if (result.success) {
        // 선택된 카테고리로 최신 데이터 다시 로드 (fallback 포함)
        if (selectedSubCategory?.themeId) {
          await loadRankingDataByThemeIdWithFallback(selectedSubCategory.themeId);
        } else {
          await loadRankingData(activeTab);
        }

        setTimeout(() => {
          setUpdateProgress({ current: 0, total: 0, status: '' });
          alert(`✅ ${result.count}개의 ${selectedCategory?.name || rankingTabs.find(tab => tab.id === activeTab)?.label} > ${selectedSubCategory?.name || '전체'} 랭킹이 데이터베이스에 저장되었습니다.`);
        }, 1500);
      } else {
        setUpdateProgress({ current: 0, total: 0, status: '' });
        alert(`❌ 업데이트 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('랭킹 업데이트 오류:', error);
      setUpdateProgress({ current: 0, total: 0, status: '' });
      alert('❌ 랭킹 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 크롤링 테스트 함수
  const handleTestCrawling = async () => {
    setIsTesting(true);
    setTestResults(null);
    setShowTestResults(true);

    try {
      // 현재 선택된 카테고리의 themeId 또는 기본값 사용
      const themeId = selectedSubCategory?.themeId || '5102';

      console.log(`🧪 크롤링 테스트 시작: themeId=${themeId}`);

      const response = await fetch('/api/admin/test-crawling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId: themeId,
          category: selectedCategory?.name || 'trending',
          maxItems: 5
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setTestResults(result);
        console.log('✅ 크롤링 테스트 완료:', result);
      } else {
        throw new Error(result.message || '테스트 실패');
      }
    } catch (error) {
      console.error('❌ 크롤링 테스트 오류:', error);
      setTestResults({
        success: false,
        error: error.message,
        data: []
      });
    } finally {
      setIsTesting(false);
    }
  };

  // 랭킹 변동 아이콘 렌더링
  const renderRankChange = (rankChange) => {
    if (!rankChange) return null;
    
    if (rankChange.type === 'up') {
      return (
        <span className="flex items-center text-xs font-medium" style={{ color: '#dc2626' }}>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#dc2626' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span style={{ color: '#dc2626' }}>{rankChange.value}</span>
        </span>
      );
    } else if (rankChange.type === 'down') {
      return (
        <span className="flex items-center text-xs font-medium" style={{ color: '#2563eb' }}>
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#2563eb' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span style={{ color: '#2563eb' }}>{rankChange.value}</span>
        </span>
      );
    } else if (rankChange.type === 'new') {
      return (
        <span className="text-xs font-semibold" style={{ 
          color: '#ec4899',
          fontSize: '11px',
          letterSpacing: '0.5px'
        }}>
          NEW
        </span>
      );
    }
    return null;
  };

  // 별점 렌더링
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill={`url(#half-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-label-common_5">랭킹 관리</h1>
            <p className="text-sm text-label-common_3 mt-1">화장품 랭킹을 카테고리별로 관리할 수 있습니다.</p>
          </div>
          {/* 업데이트 버튼들 */}
          <div className="flex items-center gap-3">
            {/* 전체 일괄 업데이트 버튼 */}
            <button
              onClick={handleBulkUpdateRankings}
              disabled={isUpdating || isBulkUpdating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: (isUpdating || isBulkUpdating) ? '#9ca3af' : '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (isUpdating || isBulkUpdating) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                opacity: (isUpdating || isBulkUpdating) ? 0.7 : 1,
                outline: 'none', // 포커스 시 테두리 제거
                WebkitTapHighlightColor: 'transparent' // 모바일 터치 하이라이트 제거
              }}
              onMouseEnter={(e) => {
                if (!isUpdating && !isBulkUpdating) {
                  e.target.style.backgroundColor = '#b91c1c';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isUpdating && !isBulkUpdating) {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onFocus={(e) => {
                e.target.style.outline = 'none';
                e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseDown={(e) => {
                if (!isUpdating && !isBulkUpdating) {
                  e.target.style.transform = 'scale(0.98)';
                }
              }}
              onMouseUp={(e) => {
                if (!isUpdating && !isBulkUpdating) {
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{ 
                position: 'relative',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none'
              }}>
                <svg 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: 'white',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    transform: isBulkUpdating ? 'rotate(360deg)' : 'rotate(0deg)',
                    transition: 'transform 0.5s ease'
                  }}
                  className={isBulkUpdating ? 'animate-spin' : ''}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isBulkUpdating ? (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                    />
                  ) : (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                    />
                  )}
                </svg>
              </div>
              
              <span style={{ 
                color: 'white', 
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none'
              }}>
                {isBulkUpdating ? '전체 업데이트 중...' : '전체 업데이트'}
              </span>
            </button>

            {/* 크롤링 테스트 버튼 */}
            <button
              onClick={handleTestCrawling}
              disabled={isUpdating || isBulkUpdating || isTesting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: (isUpdating || isBulkUpdating || isTesting) ? '#9ca3af' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (isUpdating || isBulkUpdating || isTesting) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                opacity: (isUpdating || isBulkUpdating || isTesting) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isUpdating && !isBulkUpdating && !isTesting) {
                  e.target.style.backgroundColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (!isUpdating && !isBulkUpdating && !isTesting) {
                  e.target.style.backgroundColor = '#10b981';
                }
              }}
            >
              {isTesting ? (
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              )}
              <span style={{
                color: 'white',
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none'
              }}>
                {isTesting ? '테스트 중...' : '테스트'}
              </span>
            </button>

            {/* 개별 카테고리 업데이트 버튼 */}
            <button
              onClick={handleUpdateRankings}
              disabled={isUpdating || isBulkUpdating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: (isUpdating || isBulkUpdating) ? '#9ca3af' : '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: (isUpdating || isBulkUpdating) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                opacity: (isUpdating || isBulkUpdating) ? 0.7 : 1,
                outline: 'none', // 포커스 시 테두리 제거
                WebkitTapHighlightColor: 'transparent' // 모바일 터치 하이라이트 제거
              }}
              onMouseEnter={(e) => {
                if (!isUpdating && !isBulkUpdating) {
                  e.target.style.backgroundColor = '#6d28d9';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isUpdating && !isBulkUpdating) {
                  e.target.style.backgroundColor = '#7c3aed';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onFocus={(e) => {
                e.target.style.outline = 'none';
                e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.3)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseDown={(e) => {
                if (!isUpdating && !isBulkUpdating) {
                  e.target.style.transform = 'scale(0.98)';
                }
              }}
              onMouseUp={(e) => {
                if (!isUpdating && !isBulkUpdating) {
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              <div style={{ 
                position: 'relative',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none'
              }}>
                <svg 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: 'white',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    transform: isUpdating ? 'rotate(360deg)' : 'rotate(0deg)',
                    transition: 'transform 0.5s ease'
                  }}
                  className={isUpdating ? 'animate-spin' : ''}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
                  />
                </svg>
              </div>
              
              <span style={{ 
                color: 'white', 
                fontWeight: 'bold',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none'
              }}>
                {isUpdating ? '업데이트 중...' : '선택 카테고리 업데이트'}
              </span>
            </button>
          </div>
        </div>

        {/* 진행률 표시 바 */}
        {isUpdating && updateProgress.total > 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                크롤링 진행 중
              </h3>
              <span className="text-sm font-medium text-gray-600">
                {updateProgress.status}
              </span>
            </div>

            <div className="relative">
              {/* 진행률 바 배경 */}
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                {/* 진행률 바 */}
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                  style={{
                    width: `${(updateProgress.current / updateProgress.total) * 100}%`,
                    background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)'
                  }}
                >
                  {/* 애니메이션 효과 */}
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      animation: 'shimmer 2s infinite'
                    }}
                  ></div>
                </div>
              </div>

              {/* 퍼센트 표시 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">
                  {Math.round((updateProgress.current / updateProgress.total) * 100)}%
                </span>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                진행 상황: <span className="font-bold text-purple-600">
                  {updateProgress.current <= 50
                    ? `리스트 ${updateProgress.current}/50`
                    : `상세 ${updateProgress.current - 50}/10`}
                </span>
              </span>
              <span className="text-gray-500">
                예상 남은 시간: {(() => {
                  const remaining = updateProgress.total - updateProgress.current;
                  if (updateProgress.current < 50) {
                    // 리스트 크롤링: 빠름
                    return Math.ceil(remaining * 0.8);
                  } else {
                    // 상세 페이지 크롤링: 느림
                    return Math.ceil((60 - updateProgress.current) * 2);
                  }
                })()}초
              </span>
            </div>
          </div>
          </div>
        )}

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {rankingTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center relative ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                style={activeTab === tab.id ? {
                  backgroundColor: '#604aff',
                  borderBottomColor: '#4d37e6',
                  borderRadius: '8px 8px 0 0'
                } : {}}
              >
                <span className="mr-2" style={activeTab === tab.id ? { color: 'white' } : {}}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 카테고리 필터 섹션 (급상승 탭에서만 표시) */}
        {activeTab === 'trending' && (
          <div className="mb-8">
            {/* 컴팩트한 필터 토글 버튼 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">카테고리 필터</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500">현재:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {selectedCategory?.name || '전체'}
                        </span>
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {selectedSubCategory?.name || '전체'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 text-sm ${
                    showCategoryFilter 
                      ? 'bg-red-500 border border-red-500 hover:bg-red-600 hover:border-red-600 shadow-sm hover:shadow-md' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 shadow-sm hover:shadow-md'
                  }`}
                  style={{
                    color: showCategoryFilter ? '#ffffff !important' : '#374151',
                    backgroundColor: showCategoryFilter ? '#ef4444' : '#ffffff'
                  }}
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${showCategoryFilter ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke={showCategoryFilter ? '#ffffff' : 'currentColor'} 
                    viewBox="0 0 24 24"
                    style={{ color: showCategoryFilter ? '#ffffff' : '#374151' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showCategoryFilter ? "M6 18L18 6M6 6l12 12" : "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"} />
                  </svg>
                  <span style={{ color: showCategoryFilter ? '#ffffff' : '#374151' }}>
                    {showCategoryFilter ? '닫기' : '필터'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* 필터 컨텐츠 */}
            {showCategoryFilter && (
              <div className="relative z-20 transform transition-all duration-300 ease-out" style={{ pointerEvents: 'auto' }}>
                <CategoryFilter
                  onCategorySelect={handleCategorySelect}
                  selectedCategory={selectedCategory}
                  selectedSubCategory={selectedSubCategory}
                />
              </div>
            )}
          </div>
        )}

        {/* 랭킹 리스트 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-label-common_5">
                  {activeTab === 'trending' && selectedCategory?.name !== '전체' 
                    ? `${selectedCategory?.name} > ${selectedSubCategory?.name}` 
                    : rankingTabs.find(tab => tab.id === activeTab)?.label
                  } 랭킹 TOP 100
                </h2>
                <p className="text-sm text-label-common_3 mt-1">
                  총 {currentData.length}개의 항목이 있습니다.
                </p>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {currentData.length > 0 && currentData[0]?.createdAt 
                  ? new Date(currentData[0].createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit', 
                      day: '2-digit'
                    }).replace(/\./g, '.').replace(/\s/g, '') + ' 업데이트'
                  : new Date().toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }).replace(/\./g, '.').replace(/\s/g, '') + ' 업데이트'
                }
              </div>
            </div>
          </div>

          <div className="relative">
            {/* 로딩 오버레이 (기존 데이터 위에 표시) */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex justify-center items-center z-10 rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="text-sm text-gray-600 font-medium">데이터 로딩 중...</span>
                </div>
              </div>
            )}
            
            {/* 테이블 (항상 표시, 로딩 중에도 기존 데이터 유지) */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      순위
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제품 이미지
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      브랜드명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      제품명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      별점
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      리뷰 수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      가격
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      용량
                    </th>
                    {activeTab === 'trending' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        변동
                      </th>
                    )}
                    {activeTab !== 'brand' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        카테고리
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.map((item, index) => (
                    <tr key={item.id || `item-${index}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-label-common_5">
                          {item.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200" 
                            src={activeTab === 'brand' ? item.brandImage : item.image} 
                            alt={activeTab === 'brand' ? item.brandName : item.name}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-label-common_5">
                          {activeTab === 'brand' ? item.brandName : item.brand}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {activeTab === 'brand' ? (
                          <div className="text-sm text-label-common_4 max-w-xs truncate">
                            {item.productCount}개 제품
                          </div>
                        ) : (
                          <button
                            onClick={() => handleProductDetail(item)}
                            className="text-sm text-purple-600 hover:text-purple-800 hover:underline max-w-xs truncate text-left transition-colors"
                            title="클릭하여 상세 정보 보기"
                          >
                            {item.name}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {renderStars(activeTab === 'brand' ? item.avgRating : item.rating)}
                          </div>
                          <span className="text-sm text-label-common_4">
                            {(activeTab === 'brand' ? item.avgRating : item.rating).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-label-common_4">
                        {(activeTab === 'brand' ? item.totalReviews : item.reviewCount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-label-common_4">
                        {item.price || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-label-common_4">
                        {item.volume || '-'}
                      </td>
                      {activeTab === 'trending' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderRankChange(item.rankChange)}
                        </td>
                      )}
                      {activeTab !== 'brand' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {item.category || item.skinType || item.ageGroup}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 페이지네이션 */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-label-common_3">
                1-{currentData.length} / 총 {currentData.length}개
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                  disabled={true}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  이전
                </button>
                
                {/* 페이지 번호 */}
                <div className="flex items-center space-x-1">
                  <button 
                    className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-colors"
                    style={{ backgroundColor: '#604aff', color: 'white' }}
                  >
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
                    3
                  </button>
                  <span className="px-2 text-gray-400 text-sm">...</span>
                  <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
                    10
                  </button>
                </div>

                <button 
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  다음
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 제품 상세 정보 모달 */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={showProductDetail}
        onClose={() => setShowProductDetail(false)}
      />

      {/* 크롤링 테스트 결과 모달 */}
      {showTestResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* 헤더 */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">🧪 크롤링 테스트 결과</h2>
                <button
                  onClick={() => setShowTestResults(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {testResults && (
                <div className="mt-2 text-sm text-gray-600">
                  {testResults.success ? (
                    <span className="text-green-600">✅ 테스트 성공 • {testResults.data?.length || 0}개 제품 크롤링 완료</span>
                  ) : (
                    <span className="text-red-600">❌ 테스트 실패 • {testResults.error}</span>
                  )}
                </div>
              )}
            </div>

            {/* 본문 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isTesting ? (
                <div className="text-center py-12">
                  <svg className="animate-spin w-12 h-12 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <p className="text-lg font-medium text-gray-600">크롤링 테스트 진행 중...</p>
                  <p className="text-sm text-gray-400 mt-2">5개 제품의 상세 정보를 크롤링하고 있습니다.</p>
                </div>
              ) : testResults?.success ? (
                <div className="space-y-6">
                  {testResults.data?.map((product, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start gap-4">
                        {/* 제품 이미지 */}
                        <div className="flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.png';
                            }}
                          />
                        </div>

                        {/* 제품 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                              #{product.rank}
                            </span>
                            <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{product.brand} • {product.price}</p>

                          {/* 성분 정보 */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 성분 구성 */}
                            <div className="bg-white p-3 rounded-lg border">
                              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                성분 구성
                              </h4>
                              <div className="text-sm space-y-1">
                                <div>전체: <span className="font-medium">{product.ingredients?.total || product.ingredients?.componentStats?.total || 'N/A'}</span></div>
                                <div>낮은위험: <span className="text-green-600 font-medium">{product.ingredients?.lowRisk || product.ingredients?.componentStats?.lowRisk || 'N/A'}</span></div>
                                <div>중간위험: <span className="text-yellow-600 font-medium">{product.ingredients?.mediumRisk || product.ingredients?.componentStats?.mediumRisk || 'N/A'}</span></div>
                                <div>높은위험: <span className="text-red-600 font-medium">{product.ingredients?.highRisk || product.ingredients?.componentStats?.highRisk || 'N/A'}</span></div>
                              </div>
                            </div>

                            {/* AI 분석 */}
                            <div className="bg-white p-3 rounded-lg border">
                              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                AI 분석
                              </h4>
                              <div className="text-sm space-y-1">
                                <div>장점: <span className="text-green-600 font-medium">{product.aiAnalysis?.pros?.length || 0}개</span></div>
                                <div>단점: <span className="text-red-600 font-medium">{product.aiAnalysis?.cons?.length || 0}개</span></div>
                                {product.aiAnalysis?.pros?.length > 0 && (
                                  <div className="text-xs text-gray-500 truncate">
                                    주요 장점: {product.aiAnalysis.pros.slice(0, 3).map(p => p.name).join(', ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 전체 성분 리스트 (개선된 크롤링 결과) */}
                          {product.ingredients?.fullIngredientsList?.length > 0 && (
                            <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-200">
                              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                추출된 성분 리스트 ({product.ingredients.fullIngredientsList.length}개)
                              </h4>
                              <div className="text-xs text-gray-600 max-h-16 overflow-y-auto">
                                {product.ingredients.fullIngredientsList.slice(0, 15).map(ing => ing.name).join(', ')}
                                {product.ingredients.fullIngredientsList.length > 15 && '...'}
                              </div>
                            </div>
                          )}

                          {/* 목적별 성분 (개선된 크롤링 결과) */}
                          {product.ingredients?.purposeBasedIngredients && Object.keys(product.ingredients.purposeBasedIngredients).length > 0 && (
                            <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                목적별 성분 분석
                              </h4>
                              <div className="text-xs text-gray-600 space-y-1">
                                {Object.entries(product.ingredients.purposeBasedIngredients).map(([purpose, count]) => (
                                  <div key={purpose} className="flex justify-between">
                                    <span>{purpose}:</span>
                                    <span className="font-medium">{count}개</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {product.functionalIngredients && Object.keys(product.functionalIngredients).length > 0 && (
                            <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-200">
                              <h4 className="font-medium text-green-800 mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                기능성 성분 상세
                              </h4>
                              <div className="text-xs text-gray-600 space-y-2">
                                {Object.entries(product.functionalIngredients).map(([type, ingredients]) => (
                                  <div key={type} className="border-l-2 border-green-300 pl-2">
                                    <div className="font-medium text-green-700 mb-1">{type} ({Array.isArray(ingredients) ? ingredients.length : 0}개)</div>
                                    {Array.isArray(ingredients) && ingredients.length > 0 && (
                                      <div className="text-gray-500 text-xs">
                                        {ingredients.join(', ')}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : testResults && !testResults.success ? (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-600 mb-2">테스트 실패</p>
                  <p className="text-sm text-red-600">{testResults.error}</p>
                </div>
              ) : null}
            </div>

            {/* 푸터 */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowTestResults(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
