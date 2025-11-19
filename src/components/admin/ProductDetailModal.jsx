import React, { useState, useEffect } from 'react';

// 개선된 성분 데이터 추출 헬퍼 함수들
// 화해 사이트 실제 성분 분석 정보 추출 함수
const extractIngredientAnalysisInfo = (ingredients) => {
  if (!ingredients) return '';

  console.log('🔍 extractIngredientAnalysisInfo 실행, ingredients:', ingredients);
  console.log('🔍 전체 데이터 구조:', JSON.stringify(ingredients, null, 2));

  // ingredientAnalysis 데이터만 추출
  let analysisData = null;

  // 모든 가능한 경로를 확인
  console.log('🔍 ingredientAnalysis 경로 확인:');
  console.log('- ingredients.ingredients?.ingredientAnalysis:', ingredients.ingredients?.ingredientAnalysis);
  console.log('- ingredients.ingredientAnalysis:', ingredients.ingredientAnalysis);

  // 1. ingredients.ingredients에서 ingredientAnalysis 추출
  if (ingredients.ingredients?.ingredientAnalysis) {
    analysisData = ingredients.ingredients.ingredientAnalysis;
    console.log('✅ ingredients.ingredients에서 ingredientAnalysis 발견');
  }
  // 2. 직접 경로에서 추출
  else if (ingredients.ingredientAnalysis) {
    analysisData = ingredients.ingredientAnalysis;
    console.log('✅ 직접 ingredientAnalysis 발견');
  }

  if (!analysisData) {
    console.log('❌ ingredientAnalysis 정보를 찾을 수 없음, componentStats로 fallback');

    // componentStats가 있다면 기본 정보라도 표시
    let componentStats = null;
    if (ingredients.ingredients?.componentStats) {
      componentStats = ingredients.ingredients.componentStats;
    } else if (ingredients.componentStats) {
      componentStats = ingredients.componentStats;
    }

    if (componentStats) {
      const fallbackText = [];
      if (componentStats.total) fallbackText.push(`전체 성분: ${componentStats.total}개`);
      if (componentStats.lowRisk >= 0) fallbackText.push(`낮은 위험: ${componentStats.lowRisk}개`);
      if (componentStats.mediumRisk >= 0) fallbackText.push(`중간 위험: ${componentStats.mediumRisk}개`);
      if (componentStats.highRisk >= 0) fallbackText.push(`높은 위험: ${componentStats.highRisk}개`);

      return fallbackText.join(' | ') || '성분 분석 정보가 없습니다.';
    }

    return '성분 분석 정보가 없습니다.';
  }

  console.log('🔍 analysisData 확인:', analysisData);

  // ingredientAnalysis 정보만 표시
  const analysisText = [];

  // 알레르기 주의성분 정보
  if (analysisData?.allergyIngredients !== undefined) {
    if (analysisData.allergyIngredients === 'Free') {
      analysisText.push('알레르기 성분: Free');
    } else {
      analysisText.push(`알레르기 성분: ${analysisData.allergyIngredients}개`);
    }
  }

  // 기능성 성분 정보
  if (analysisData?.antiAgingIngredients > 0) {
    analysisText.push(`주름 개선: ${analysisData.antiAgingIngredients}개`);
  }
  if (analysisData?.brighteningIngredients > 0) {
    analysisText.push(`미백 성분: ${analysisData.brighteningIngredients}개`);
  }

  // 자외선 차단 성분 추가 (functionalIngredients에서 추출)
  if (ingredients.functionalIngredients?.['자외선 차단']) {
    const sunscreenCount = Array.isArray(ingredients.functionalIngredients['자외선 차단'])
      ? ingredients.functionalIngredients['자외선 차단'].length
      : 0;
    if (sunscreenCount > 0) {
      analysisText.push(`자외선 차단: ${sunscreenCount}개`);
    }
  }

  // 주의성분 정보
  if (analysisData?.cautionIngredients) {
    const { total, present } = analysisData.cautionIngredients;
    if (present === 0) {
      analysisText.push(`${total}가지 주의성분: Free`);
    } else {
      analysisText.push(`${total}가지 주의성분: ${present}개`);
    }
  }

  const result = analysisText.join(' | ');
  console.log('📊 변환된 성분 분석 정보:', result);
  return result || '성분 분석 정보 처리 중...';
};

const extractFullIngredientsList = (ingredients) => {
  // 화해에는 실제 성분명 리스트가 없으므로 성분 분석 정보로 대체
  return extractIngredientAnalysisInfo(ingredients);
};

const extractPurposeBasedIngredients = (ingredients) => {
  if (!ingredients) return '';

  console.log('🔍 extractPurposeBasedIngredients 실행, ingredients:', ingredients);

  // 여러 가능한 구조에서 목적별 성분 추출
  let purposeData = null;

  // 1. 직접적인 purposeBasedIngredients 객체
  if (ingredients.purposeBasedIngredients && typeof ingredients.purposeBasedIngredients === 'object') {
    purposeData = ingredients.purposeBasedIngredients;
    console.log('✅ 방법 1: 직접 purposeBasedIngredients 발견');
  }
  // 2. componentStats나 다른 구조에서 추출
  else if (ingredients.componentStats?.purposeBasedIngredients) {
    purposeData = ingredients.componentStats.purposeBasedIngredients;
    console.log('✅ 방법 2: componentStats에서 발견');
  }
  // 3. 다양한 형태의 성분 데이터 구조 지원
  else if (ingredients.ingredients?.purposeBasedIngredients) {
    purposeData = ingredients.ingredients.purposeBasedIngredients;
    console.log('✅ 방법 3: ingredients.ingredients에서 발견');
  }
  // 4. 최신 크롤링 구조 지원
  else if (ingredients.data?.purposeBasedIngredients) {
    purposeData = ingredients.data.purposeBasedIngredients;
    console.log('✅ 방법 4: data에서 발견');
  }
  // 5. 테스트 크롤링 결과 구조
  else if (ingredients.enhancedIngredients?.purposeBasedIngredients) {
    purposeData = ingredients.enhancedIngredients.purposeBasedIngredients;
    console.log('✅ 방법 5: enhancedIngredients에서 발견');
  }

  // 객체를 "목적:개수" 형태의 문자열로 변환
  if (purposeData && Object.keys(purposeData).length > 0) {
    console.log('🎯 목적별 성분 데이터:', purposeData);
    const result = Object.entries(purposeData)
      .filter(([key, value]) => key && value >= 0) // 유효한 데이터만
      .map(([key, value]) => `${key}:${value}`)
      .join(', ');

    console.log('📊 변환된 목적별 성분:', result);
    return result;
  }

  console.log('❌ 목적별 성분을 찾을 수 없음');
  return '';
};

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    price: '',
    volume: '',
    image: '',
    brandLogo: '',
    categoryRanking: '',
    awards: '',
    aiAnalysisPros: '',
    aiAnalysisCons: '',
    ingredientsTotal: '',
    ingredientsLowRisk: '',
    ingredientsMediumRisk: '',
    ingredientsHighRisk: '',
    ingredientsUndetermined: '',
    fullIngredientsList: '',
    purposeBasedIngredients: '',
    skinTypeOilyGood: '',
    skinTypeOilyBad: '',
    skinTypeDryGood: '',
    skinTypeDryBad: '',
    skinTypeSensitiveGood: '',
    skinTypeSensitiveBad: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 제품 데이터로 폼 초기화
  useEffect(() => {
    if (product) {
      console.log('🔍 ProductDetailModal 제품 데이터:', product); // 디버깅용
      console.log('🧪 ingredients 구조:', product.ingredients);
      console.log('🏆 수상 정보 디버깅:', product.awards); // 수상 정보 확인

      // 개선된 성분 정보 추출 테스트
      const extractedIngredients = extractFullIngredientsList(product);
      const extractedPurpose = extractPurposeBasedIngredients(product);

      console.log('📋 추출된 성분 리스트:', extractedIngredients ? extractedIngredients.substring(0, 100) + '...' : '없음');
      console.log('🎯 추출된 목적별 성분:', extractedPurpose || '없음');

      const formDataObject = {
        brand: product.brand || '',
        name: product.name || '',
        price: product.price || '',
        volume: product.volume || '',
        image: product.image || '',
        brandLogo: product.brandLogo || '',
        categoryRanking: product.categoryRanking || '',
        awards: product.awards?.map(a => `${a.title}:${a.description}`).join(', ') || '',
        aiAnalysisPros: product.aiAnalysis?.pros?.map(p => `${p.name}:${p.count}`).join(', ') || '',
        aiAnalysisCons: product.aiAnalysis?.cons?.map(c => `${c.name}:${c.count}`).join(', ') || '',
        ingredientsTotal: (product.ingredients?.total || product.ingredients?.componentStats?.total || '').toString(),
        ingredientsLowRisk: (product.ingredients?.lowRisk || product.ingredients?.componentStats?.lowRisk || '').toString(),
        ingredientsMediumRisk: (product.ingredients?.mediumRisk || product.ingredients?.componentStats?.mediumRisk || '').toString(),
        ingredientsHighRisk: (product.ingredients?.highRisk || product.ingredients?.componentStats?.highRisk || '').toString(),
        ingredientsUndetermined: (product.ingredients?.undetermined || product.ingredients?.componentStats?.undetermined || '').toString(),
        fullIngredientsList: extractedIngredients,
        purposeBasedIngredients: extractedPurpose,
        skinTypeOilyGood: (product.skinTypeAnalysis?.oily?.good || '').toString(),
        skinTypeOilyBad: (product.skinTypeAnalysis?.oily?.bad || '').toString(),
        skinTypeDryGood: (product.skinTypeAnalysis?.dry?.good || '').toString(),
        skinTypeDryBad: (product.skinTypeAnalysis?.dry?.bad || '').toString(),
        skinTypeSensitiveGood: (product.skinTypeAnalysis?.sensitive?.good || '').toString(),
        skinTypeSensitiveBad: (product.skinTypeAnalysis?.sensitive?.bad || '').toString(),
        functionalIngredients: product.functionalIngredients || {} // 기능성 성분 상세 리스트 추가
      };

      // 기능성 성분 데이터 디버깅
      console.log('🔍 ProductDetailModal - product 전체:', product);
      console.log('🔍 ProductDetailModal - functionalIngredients:', product.functionalIngredients);
      console.log('🔍 ProductDetailModal - formDataObject.functionalIngredients:', formDataObject.functionalIngredients);

      setFormData(formDataObject);
      setOriginalData(formDataObject); // 원본 데이터 저장
    }
  }, [product]);

  // 폼 데이터 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거 핸들러
  const handleImageRemove = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  // 취소 핸들러 - 원본 데이터로 복원
  const handleCancel = () => {
    if (originalData) {
      setFormData({ ...originalData });
    }
    onClose();
  };

  // 저장 핸들러
  const handleSave = async () => {
    setIsLoading(true);


    try {
      const response = await fetch('/api/admin/product-detail', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.productId || product._id,
          basicData: {
            brand: formData.brand,
            name: formData.name,
            price: formData.price,
            volume: formData.volume,
            image: formData.image
          },
          detailData: formData
        })
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        alert('✅ 상세 정보가 저장되었습니다!');
        onClose();
        window.location.reload();
      } else {
        alert(`❌ 저장 실패: ${result.message}`);
      }
    } catch (error) {
      alert(`❌ 저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  // mockDetailData 제거됨 - 크롤링 실패 시 빈 데이터로 표시

  // 실제 데이터만 사용, 없으면 빈 데이터 표시
  const detailData = {
    brandLogo: product.brandLogo || '',
    categoryRanking: product.categoryRanking || '',
    aiAnalysis: (product.aiAnalysis && (product.aiAnalysis.pros?.length > 0 || product.aiAnalysis.cons?.length > 0)) 
      ? product.aiAnalysis 
      : { pros: [], cons: [] },
    ingredients: (product.ingredients && product.ingredients.total)
      ? product.ingredients 
      : {},
    skinTypeAnalysis: product.skinTypeAnalysis || { oily: {good: 0, bad: 0}, dry: {good: 0, bad: 0}, sensitive: {good: 0, bad: 0} }
  };

  const renderStarRating = (rating, size = 'w-4 h-4') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className={`${size} text-yellow-400`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.712 21.992c-.12 0-.25-.03-.36-.09l-5.347-2.958-5.347 2.959a.75.75 0 0 1-.79-.04.761.761 0 0 1-.31-.74l1.03-6.328-4.378-4.478c-.2-.2-.26-.5-.17-.76.09-.27.32-.46.6-.5l5.997-.92L11.315 2.4c.25-.53 1.11-.53 1.36 0l2.688 5.738 5.997.92c.28.04.51.24.6.5.09.269.02.559-.17.759l-4.358 4.478 1.03 6.328a.76.76 0 0 1-.74.88z"/>
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className={`${size} text-gray-300`} fill="currentColor" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`half-star-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill={`url(#half-star-${i})`} d="M17.712 21.992c-.12 0-.25-.03-.36-.09l-5.347-2.958-5.347 2.959a.75.75 0 0 1-.79-.04.761.761 0 0 1-.31-.74l1.03-6.328-4.378-4.478c-.2-.2-.26-.5-.17-.76.09-.27.32-.46.6-.5l5.997-.92L11.315 2.4c.25-.53 1.11-.53 1.36 0l2.688 5.738 5.997.92c.28.04.51.24.6.5.09.269.02.559-.17.759l-4.358 4.478 1.03 6.328a.76.76 0 0 1-.74.88z"/>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className={`${size} text-gray-300`} fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.712 21.992c-.12 0-.25-.03-.36-.09l-5.347-2.958-5.347 2.959a.75.75 0 0 1-.79-.04.761.761 0 0 1-.31-.74l1.03-6.328-4.378-4.478c-.2-.2-.26-.5-.17-.76.09-.27.32-.46.6-.5l5.997-.92L11.315 2.4c.25-.53 1.11-.53 1.36 0l2.688 5.738 5.997.92c.28.04.51.24.6.5.09.269.02.559-.17.759l-4.358 4.478 1.03 6.328a.76.76 0 0 1-.74.88z"/>
          </svg>
        );
      }
    }
    return stars;
  };

  const renderRankChange = (rankChange) => {
    if (!rankChange) return null;
    
    if (rankChange.type === 'new') {
      return (
        <span className="text-xs font-bold" style={{ color: '#ec4899', fontSize: '11px', letterSpacing: '0.5px' }}>
          NEW
        </span>
      );
    }
    
    const isUp = rankChange.type === 'up';
    return (
      <div className="flex items-center text-xs">
        <svg className={`w-3 h-3 ${isUp ? 'text-red-500' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d={isUp ? 
            "M9.279 15c-1.02 0-1.628-1.028-1.062-1.795l2.72-3.69c.506-.686 1.62-.686 2.125 0l2.721 3.69c.566.767-.042 1.795-1.062 1.795z" :
            "M14.721 9c1.02 0 1.628 1.028 1.062 1.795l-2.72 3.69c-.506.686-1.62.686-2.125 0l-2.721-3.69C7.65 10.028 8.259 9 9.279 9z"
          }/>
        </svg>
        <span className={`ml-1 ${isUp ? 'text-red-500' : 'text-blue-600'}`}>
          {rankChange.value}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-label-common_5 flex items-center">
              <svg className="w-6 h-6 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              제품 상세 정보 편집
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 본문 - 편집 가능한 폼 */}
        <div className="p-6 space-y-6">

          {/* 기본 정보 섹션 */}
          <div>
            <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              기본 정보
            </h3>
            <div className="space-y-4">
              {/* 브랜드명 + 제품명 */}
              <div className="grid grid-cols-2 gap-6">
                {/* 브랜드명 - 왼쪽 */}
                <div>
                  <label className="block text-sm font-semibold text-label-common_5 mb-2">
                    브랜드명 *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                    style={{ borderRadius: '8px' }}
                    placeholder="브랜드명을 입력해주세요"
                    required
                  />
                </div>

                {/* 제품명 - 오른쪽 */}
                <div>
                  <label className="block text-sm font-semibold text-label-common_5 mb-2">
                    제품명 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                    style={{ borderRadius: '8px' }}
                    placeholder="제품명을 입력해주세요"
                    required
                  />
                </div>
              </div>

              {/* 가격 + 용량 */}
              <div className="grid grid-cols-2 gap-6">
                {/* 가격 - 왼쪽 */}
                <div>
                  <label className="block text-sm font-semibold text-label-common_5 mb-2">
                    가격 *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                    style={{ borderRadius: '8px' }}
                    placeholder="예: $15.51"
                    required
                  />
                </div>

                {/* 용량 - 오른쪽 */}
                <div>
                  <label className="block text-sm font-semibold text-label-common_5 mb-2">
                    용량 *
                  </label>
                  <input
                    type="text"
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                    style={{ borderRadius: '8px' }}
                    placeholder="예: 1.5mL"
                    required
                  />
                </div>
              </div>

              {/* 이미지 섹션 - 왼쪽/오른쪽 반반 배치 */}
              <div className="grid grid-cols-2 gap-6">
              {/* 제품 이미지 - 왼쪽 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">
                  제품 이미지 URL *
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                    style={{ borderRadius: '8px' }}
                    placeholder="https://img.hwahae.co.kr/products/..."
                    required
                  />
                  <div className="mt-3">
                    {formData.image && (formData.image.startsWith('data:') || formData.image.startsWith('http')) ? (
                      <div className="relative group">
                        <img
                          src={formData.image}
                          alt="제품 이미지 미리보기"
                          className="w-24 h-16 object-cover border-2 border-gray-200 group-hover:border-purple-400 transition-colors"
                          style={{ borderRadius: '12px' }}
                          onError={(e) => {
                            console.error('이미지 로드 실패:', formData.image);
                            e.target.style.display = 'none';
                          }}
                          onLoad={() => console.log('이미지 로드 성공')}
                        />
                        {/* X 버튼 - 오른쪽 상단 */}
                        <button
                          type="button"
                          onClick={() => handleImageRemove('image')}
                          className="absolute top-0.5 right-0.5 text-white p-1 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          title="이미지 삭제"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.9)',
                            borderRadius: '50%'
                          }}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {/* 교체 버튼 - 가운데 */}
                        <div 
                          className="absolute inset-0 bg-black transition-all flex items-center justify-center pointer-events-none group-hover:pointer-events-auto" 
                          style={{ 
                            borderRadius: '12px',
                            backgroundColor: 'transparent'
                          }}
                        >
                          <label
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-500 hover:bg-purple-600 text-white p-1.5 rounded-full transition-colors shadow-lg cursor-pointer pointer-events-auto"
                            title="이미지 교체"
                            style={{
                              backgroundColor: 'rgba(96, 74, 255, 0.9)'
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'image')}
                              className="hidden"
                            />
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="relative group block w-full p-6 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-all cursor-pointer bg-gray-50 hover:bg-purple-50" style={{ borderRadius: '12px' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'image')}
                          className="hidden"
                        />
                        <div className="text-center">
                          <div className="space-y-2">
                            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">제품 이미지 업로드</p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF 파일을 드래그하거나 클릭하여 업로드</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* 브랜드 로고 - 오른쪽 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">
                  브랜드 로고 URL *
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    name="brandLogo"
                    value={formData.brandLogo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                    style={{ borderRadius: '8px' }}
                    placeholder="https://img.hwahae.co.kr/brands/..."
                  />
                  <div className="mt-3">
                    {formData.brandLogo && (formData.brandLogo.startsWith('data:') || formData.brandLogo.startsWith('http')) ? (
                      <div className="relative group">
                        <img
                          src={formData.brandLogo}
                          alt="브랜드 로고 미리보기"
                          className="w-16 h-16 object-contain border-2 border-gray-200 group-hover:border-purple-400 transition-colors bg-white"
                          style={{ borderRadius: '12px' }}
                          onError={(e) => {
                            console.error('브랜드 로고 로드 실패:', formData.brandLogo);
                            e.target.style.display = 'none';
                          }}
                        />
                        {/* X 버튼 - 오른쪽 상단 */}
                        <button
                          type="button"
                          onClick={() => handleImageRemove('brandLogo')}
                          className="absolute top-0.5 right-0.5 text-white p-1 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                          title="로고 삭제"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.9)',
                            borderRadius: '50%'
                          }}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {/* 교체 버튼 - 가운데 */}
                        <div 
                          className="absolute inset-0 bg-black transition-all flex items-center justify-center pointer-events-none group-hover:pointer-events-auto" 
                          style={{ 
                            borderRadius: '12px',
                            backgroundColor: 'transparent'
                          }}
                        >
                          <label
                            className="opacity-0 group-hover:opacity-100 transition-opacity bg-purple-500 hover:bg-purple-600 text-white p-1.5 rounded-full transition-colors shadow-lg cursor-pointer pointer-events-auto"
                            title="로고 교체"
                            style={{
                              backgroundColor: 'rgba(96, 74, 255, 0.9)'
                            }}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'brandLogo')}
                              className="hidden"
                            />
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="relative group block w-full p-6 border-2 border-dashed border-gray-300 hover:border-purple-400 transition-all cursor-pointer bg-gray-50 hover:bg-purple-50" style={{ borderRadius: '12px' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'brandLogo')}
                          className="hidden"
                        />
                        <div className="text-center">
                          <div className="space-y-2">
                            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">브랜드 로고 업로드</p>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF 파일을 드래그하거나 클릭하여 업로드</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>
              </div>
              </div>

              {/* 카테고리 랭킹 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">
                  카테고리 랭킹 *
                </label>
                <input
                  type="text"
                  name="categoryRanking"
                  value={formData.categoryRanking}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="예: Essences/Ampoules/Serums ・ Brightening 70th Place"
                />
              </div>
            </div>
          </div>

          {/* 수상 영역 */}
          <div>
            <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              수상 정보
            </h3>

            <div className="space-y-4">
              {formData.awards && formData.awards.split(', ').filter(item => item.trim()).map((item, index) => {
                const [title, description] = item.split(':');
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 min-w-[24px]">{index + 1}.</span>
                    <div className="flex flex-1 space-x-4">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">수상 제목</label>
                        <input
                          type="text"
                          value={title || ''}
                          onChange={(e) => {
                            const awards = formData.awards.split(', ').filter(item => item.trim());
                            awards[index] = `${e.target.value}:${description || ''}`;
                            handleInputChange({
                              target: { name: 'awards', value: awards.join(', ') }
                            });
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                          style={{ borderRadius: '8px' }}
                          placeholder="2023 하반기 트렌드 어워드 - 수분 부문"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">수상 설명</label>
                        <input
                          type="text"
                          value={description || ''}
                          onChange={(e) => {
                            const awards = formData.awards.split(', ').filter(item => item.trim());
                            awards[index] = `${title || ''}:${e.target.value}`;
                            handleInputChange({
                              target: { name: 'awards', value: awards.join(', ') }
                            });
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                          style={{ borderRadius: '8px' }}
                          placeholder="에센스/앰플/세럼 1위"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const awards = formData.awards.split(', ').filter(item => item.trim());
                        awards.splice(index, 1);
                        handleInputChange({
                          target: { name: 'awards', value: awards.join(', ') }
                        });
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const currentAwards = formData.awards ? formData.awards + ', ' : '';
                    handleInputChange({
                      target: { name: 'awards', value: currentAwards + ':' }
                    });
                  }}
                  className="px-6 py-2 border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 transition-colors text-sm"
                  style={{ borderRadius: '6px' }}
                >
                  + 수상 정보 추가
                </button>
              </div>
            </div>
          </div>

          {/* AI 분석 섹션 */}
          <div>
            <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI 분석 리뷰
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI 분석 - 장점 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">
                  장점 리뷰 키워드 (각각 따로 입력)
                </label>
                <div className="space-y-4">
                  {/* 장점 개별 입력란들 */}
                  {formData.aiAnalysisPros.split(', ').filter(item => item.trim()).map((item, index) => {
                    const [keyword, count] = item.split(':');
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 min-w-[24px]">{index + 1}.</span>
                        <input
                          type="text"
                          value={keyword || ''}
                          onChange={(e) => {
                            const prosItems = formData.aiAnalysisPros.split(', ').filter(item => item.trim());
                            prosItems[index] = `${e.target.value}:${count || '0'}`;
                            setFormData(prev => ({
                              ...prev,
                              aiAnalysisPros: prosItems.join(', ')
                            }));
                          }}
                          className="flex-1 mr-3 px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-green-400 transition-colors bg-gray-50 focus:bg-white"
                          style={{ borderRadius: '8px' }}
                          placeholder="키워드 (예: 흡수잘되는)"
                        />
                        <input
                          type="number"
                          value={count || ''}
                          onChange={(e) => {
                            const prosItems = formData.aiAnalysisPros.split(', ').filter(item => item.trim());
                            prosItems[index] = `${keyword || ''}:${e.target.value}`;
                            setFormData(prev => ({
                              ...prev,
                              aiAnalysisPros: prosItems.join(', ')
                            }));
                          }}
                          className="w-24 mr-3 px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-green-400 transition-colors bg-gray-50 focus:bg-white text-center"
                          style={{ borderRadius: '8px' }}
                          placeholder="횟수"
                          min="0"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const prosItems = formData.aiAnalysisPros.split(', ').filter(item => item.trim());
                            prosItems.splice(index, 1);
                            setFormData(prev => ({
                              ...prev,
                              aiAnalysisPros: prosItems.join(', ')
                            }));
                          }}
                          className="px-2 py-2 text-red-500 hover:bg-red-50 transition-colors"
                          style={{ borderRadius: '4px' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                  {/* 새 항목 추가 버튼 */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const prosItems = formData.aiAnalysisPros.split(', ').filter(item => item.trim());
                        prosItems.push(':0');
                        setFormData(prev => ({
                          ...prev,
                          aiAnalysisPros: prosItems.join(', ')
                        }));
                      }}
                      className="px-6 py-2 border-2 border-dashed border-gray-300 hover:border-green-400 text-gray-600 hover:text-green-600 transition-colors text-sm"
                      style={{ borderRadius: '6px' }}
                    >
                      + 장점 키워드 추가
                    </button>
                  </div>
                </div>
              </div>

              {/* AI 분석 - 단점 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">
                  단점 리뷰 키워드 (각각 따로 입력)
                </label>
                <div className="space-y-4">
                  {/* 단점 개별 입력란들 */}
                  {formData.aiAnalysisCons.split(', ').filter(item => item.trim()).map((item, index) => {
                    const [keyword, count] = item.split(':');
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 min-w-[24px]">{index + 1}.</span>
                        <input
                          type="text"
                          value={keyword || ''}
                          onChange={(e) => {
                            const consItems = formData.aiAnalysisCons.split(', ').filter(item => item.trim());
                            consItems[index] = `${e.target.value}:${count || '0'}`;
                            setFormData(prev => ({
                              ...prev,
                              aiAnalysisCons: consItems.join(', ')
                            }));
                          }}
                          className="flex-1 mr-3 px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-red-400 transition-colors bg-gray-50 focus:bg-white"
                          style={{ borderRadius: '8px' }}
                          placeholder="키워드 (예: 끈적한)"
                        />
                        <input
                          type="number"
                          value={count || ''}
                          onChange={(e) => {
                            const consItems = formData.aiAnalysisCons.split(', ').filter(item => item.trim());
                            consItems[index] = `${keyword || ''}:${e.target.value}`;
                            setFormData(prev => ({
                              ...prev,
                              aiAnalysisCons: consItems.join(', ')
                            }));
                          }}
                          className="w-24 mr-3 px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-red-400 transition-colors bg-gray-50 focus:bg-white text-center"
                          style={{ borderRadius: '8px' }}
                          placeholder="횟수"
                          min="0"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const consItems = formData.aiAnalysisCons.split(', ').filter(item => item.trim());
                            consItems.splice(index, 1);
                            setFormData(prev => ({
                              ...prev,
                              aiAnalysisCons: consItems.join(', ')
                            }));
                          }}
                          className="px-2 py-2 text-red-500 hover:bg-red-50 transition-colors"
                          style={{ borderRadius: '4px' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                  {/* 새 항목 추가 버튼 */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const consItems = formData.aiAnalysisCons.split(', ').filter(item => item.trim());
                        consItems.push(':0');
                        setFormData(prev => ({
                          ...prev,
                          aiAnalysisCons: consItems.join(', ')
                        }));
                      }}
                      className="px-6 py-2 border-2 border-dashed border-gray-300 hover:border-red-400 text-gray-600 hover:text-red-600 transition-colors text-sm"
                      style={{ borderRadius: '6px' }}
                    >
                      + 단점 키워드 추가
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* 기능성 성분 섹션 */}
          <div>
            <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" style={{ color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              기능성 성분
            </h3>

            {/* 기능성 성분 리스트 */}
            {console.log('🎯 렌더링 시점 - formData.functionalIngredients:', formData.functionalIngredients)}
            {formData.functionalIngredients && Object.keys(formData.functionalIngredients).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.functionalIngredients).map(([type, ingredients]) => (
                  <div key={type} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
                      {type === '주름 개선' && (
                        <>
                          <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h10" />
                          </svg>
                          주름 개선
                        </>
                      )}
                      {type === '피부 미백' && (
                        <>
                          <svg className="w-4 h-4 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                          </svg>
                          피부 미백
                        </>
                      )}
                      {type === '자외선 차단' && (
                        <>
                          <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          자외선 차단
                        </>
                      )}
                      {type === '피부 보습' && (
                        <>
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          피부 보습
                        </>
                      )}
                      {type === '주의성분' && (
                        <>
                          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L4.082 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          주의성분
                        </>
                      )}
                      {type === '알레르기 주의성분' && (
                        <>
                          <svg className="w-4 h-4 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                          </svg>
                          알레르기 주의성분
                        </>
                      )}
                      {!['주름 개선', '피부 미백', '자외선 차단', '피부 보습', '주의성분', '알레르기 주의성분'].includes(type) && type}
                    </h4>
                    {Array.isArray(ingredients) && ingredients.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {ingredients.map((ingredient, idx) => (
                          <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-300">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">성분 정보 없음</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-500 text-center">기능성 성분 정보가 없습니다.</p>
                <p className="text-xs text-gray-400 text-center mt-1">크롤링 시 기능성 성분이 있는 경우 자동으로 표시됩니다.</p>
              </div>
            )}
          </div>

          {/* 성분 정보 섹션 */}
          <div>
            <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              성분 정보
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">전체 성분 *</label>
                <input
                  type="number"
                  name="ingredientsTotal"
                  value={formData.ingredientsTotal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="42"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">저위험</label>
                <input
                  type="number"
                  name="ingredientsLowRisk"
                  value={formData.ingredientsLowRisk}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-green-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="39"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">중위험</label>
                <input
                  type="number"
                  name="ingredientsMediumRisk"
                  value={formData.ingredientsMediumRisk}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-yellow-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">고위험</label>
                <input
                  type="number"
                  name="ingredientsHighRisk"
                  value={formData.ingredientsHighRisk}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-red-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">미분류</label>
                <input
                  type="number"
                  name="ingredientsUndetermined"
                  value={formData.ingredientsUndetermined}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-gray-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="1"
                />
              </div>
            </div>

            {/* Enhanced 크롤링 상태 알림 */}
            {!formData.fullIngredientsList && !formData.purposeBasedIngredients && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Enhanced 성분 데이터 없음</p>
                    <p className="text-xs text-yellow-700 mt-1">상세 성분 정보를 얻으려면 [선택 카테고리 업데이트] 버튼을 사용하여 향상된 크롤링을 실행하세요.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 성분 분석 정보 섹션 */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-label-common_5 mb-2">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                성분 분석 정보 (각각 따로 입력)
                {!formData.fullIngredientsList && (
                  <span className="ml-2 text-xs text-yellow-600 font-normal">(크롤링 필요)</span>
                )}
              </label>
              <div className="space-y-4">
                {/* 성분 분석 개별 입력란들 */}
                {formData.fullIngredientsList.split(' | ').filter(item => item.trim()).map((item, index) => {
                  const [category, count] = item.split(': ');
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 min-w-[24px]">{index + 1}.</span>
                      <input
                        type="text"
                        value={category || ''}
                        onChange={(e) => {
                          const ingredientsItems = formData.fullIngredientsList.split(' | ').filter(item => item.trim());
                          ingredientsItems[index] = `${e.target.value}: ${count || '0'}`;
                          setFormData(prev => ({
                            ...prev,
                            fullIngredientsList: ingredientsItems.join(' | ')
                          }));
                        }}
                        className="flex-1 mr-3 px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                        style={{ borderRadius: '8px' }}
                        placeholder="카테고리 (예: 전체 성분)"
                      />
                      <input
                        type="text"
                        value={count || ''}
                        onChange={(e) => {
                          const ingredientsItems = formData.fullIngredientsList.split(' | ').filter(item => item.trim());
                          ingredientsItems[index] = `${category || ''}: ${e.target.value}`;
                          setFormData(prev => ({
                            ...prev,
                            fullIngredientsList: ingredientsItems.join(' | ')
                          }));
                        }}
                        className="w-24 mr-3 px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white text-center"
                        style={{ borderRadius: '8px' }}
                        placeholder="개수/값"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const ingredientsItems = formData.fullIngredientsList.split(' | ').filter(item => item.trim());
                          ingredientsItems.splice(index, 1);
                          setFormData(prev => ({
                            ...prev,
                            fullIngredientsList: ingredientsItems.join(' | ')
                          }));
                        }}
                        className="px-2 py-2 text-red-500 hover:bg-red-50 transition-colors"
                        style={{ borderRadius: '4px' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
                {/* 새 항목 추가 버튼 */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const ingredientsItems = formData.fullIngredientsList.split(' | ').filter(item => item.trim());
                      ingredientsItems.push(': 0');
                      setFormData(prev => ({
                        ...prev,
                        fullIngredientsList: ingredientsItems.join(' | ')
                      }));
                    }}
                    className="px-6 py-2 border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 transition-colors text-sm"
                    style={{ borderRadius: '6px' }}
                  >
                    + 새 성분 분석 항목 추가
                  </button>
                </div>
              </div>
            </div>

            {/* 목적별 성분 정보 섹션 */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-label-common_5 mb-2">
                <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                목적별 성분 정보 (각각 따로 입력)
                {!formData.purposeBasedIngredients && (
                  <span className="ml-2 text-xs text-yellow-600 font-normal">(Enhanced 크롤링 필요)</span>
                )}
              </label>
              <div className="space-y-4">
                {/* 목적별 성분 개별 입력란들 */}
                {formData.purposeBasedIngredients.split(', ').filter(item => item.trim()).map((item, index) => {
                  const [purpose, count] = item.split(':');
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 min-w-[24px]">{index + 1}.</span>
                      <input
                        type="text"
                        value={purpose || ''}
                        onChange={(e) => {
                          const purposeItems = formData.purposeBasedIngredients.split(', ').filter(item => item.trim());
                          purposeItems[index] = `${e.target.value}:${count || '0'}`;
                          setFormData(prev => ({
                            ...prev,
                            purposeBasedIngredients: purposeItems.join(', ')
                          }));
                        }}
                        className="flex-1 mr-3 px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white"
                        style={{ borderRadius: '8px' }}
                        placeholder="목적 (예: 피부 보습)"
                      />
                      <input
                        type="number"
                        value={count || ''}
                        onChange={(e) => {
                          const purposeItems = formData.purposeBasedIngredients.split(', ').filter(item => item.trim());
                          purposeItems[index] = `${purpose || ''}:${e.target.value}`;
                          setFormData(prev => ({
                            ...prev,
                            purposeBasedIngredients: purposeItems.join(', ')
                          }));
                        }}
                        className="w-24 mr-3 px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-purple-400 transition-colors bg-gray-50 focus:bg-white text-center"
                        style={{ borderRadius: '8px' }}
                        placeholder="개수"
                        min="0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const purposeItems = formData.purposeBasedIngredients.split(', ').filter(item => item.trim());
                          purposeItems.splice(index, 1);
                          setFormData(prev => ({
                            ...prev,
                            purposeBasedIngredients: purposeItems.join(', ')
                          }));
                        }}
                        className="px-2 py-2 text-red-500 hover:bg-red-50 transition-colors"
                        style={{ borderRadius: '4px' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
                {/* 새 항목 추가 버튼 */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      const purposeItems = formData.purposeBasedIngredients.split(', ').filter(item => item.trim());
                      purposeItems.push(':0');
                      setFormData(prev => ({
                        ...prev,
                        purposeBasedIngredients: purposeItems.join(', ')
                      }));
                    }}
                    className="px-6 py-2 border-2 border-dashed border-gray-300 hover:border-purple-400 text-gray-600 hover:text-purple-600 transition-colors text-sm"
                    style={{ borderRadius: '6px' }}
                  >
                    + 새 목적별 성분 항목 추가
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 피부타입별 분석 섹션 */}
          <div>
            <h3 className="text-lg font-semibold text-label-common_5 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" style={{ color: '#604aff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              피부타입별 성분 분석
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {/* 지성 피부 - 좋은 성분 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">지성 피부 (좋음)</label>
                <input
                  type="number"
                  name="skinTypeOilyGood"
                  value={formData.skinTypeOilyGood}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-green-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="0"
                />
              </div>

              {/* 지성 피부 - 나쁜 성분 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">지성 피부 (나쁨)</label>
                <input
                  type="number"
                  name="skinTypeOilyBad"
                  value={formData.skinTypeOilyBad}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-red-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="0"
                />
              </div>

              {/* 건성 피부 - 좋은 성분 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">건성 피부 (좋음)</label>
                <input
                  type="number"
                  name="skinTypeDryGood"
                  value={formData.skinTypeDryGood}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-green-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="4"
                />
              </div>

              {/* 건성 피부 - 나쁜 성분 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">건성 피부 (나쁨)</label>
                <input
                  type="number"
                  name="skinTypeDryBad"
                  value={formData.skinTypeDryBad}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-red-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="0"
                />
              </div>

              {/* 민감성 피부 - 좋은 성분 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">민감성 피부 (좋음)</label>
                <input
                  type="number"
                  name="skinTypeSensitiveGood"
                  value={formData.skinTypeSensitiveGood}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-green-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="0"
                />
              </div>

              {/* 민감성 피부 - 나쁜 성분 */}
              <div>
                <label className="block text-sm font-semibold text-label-common_5 mb-2">민감성 피부 (나쁨)</label>
                <input
                  type="number"
                  name="skinTypeSensitiveBad"
                  value={formData.skinTypeSensitiveBad}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:outline-none focus:border-red-400 transition-colors bg-gray-50 focus:bg-white"
                  style={{ borderRadius: '8px' }}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 모달 내부 플로팅 푸터 버튼 */}
        <div className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <div className="flex justify-end mr-4">
            <div className="flex bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200 font-medium mr-3"
                style={{
                  backgroundColor: 'white'
                }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className="px-6 py-3 rounded-full transition-all duration-200 flex items-center space-x-2 font-medium ml-3"
                style={{
                  backgroundColor: isLoading ? '#9CA3AF' : '#604AFF',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = '#4F46E5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.backgroundColor = '#604AFF';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-white">저장 중...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white">저장</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;