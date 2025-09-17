"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import { getPersonalizedRecommendations } from '../../../../utils/treatmentRecommendation';
import { 
  treatmentCategories, 
  symptomTreatmentMapping,
  treatmentTypeRecommendations
} from '../../../../data/comprehensive-treatments';

export default function RecommendationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [selectedTreatments, setSelectedTreatments] = useState([]); // 선택된 시술들
  const [expandedTreatment, setExpandedTreatment] = useState(null); // 펼쳐진 시술
  const [isInterestChangeMode, setIsInterestChangeMode] = useState(false); // 관심 시술 변경 모드
  const [userPreferences, setUserPreferences] = useState({
    difficulty: 'all',
    recovery: 'all',
    duration: 'all'
  });

  useEffect(() => {
    loadUserDataAndGenerateRecommendations();
  }, []);

  useEffect(() => {
    if (userInfo.selectedSymptoms && selectedSymptom) {
      generateRecommendations();
    }
  }, [userPreferences, selectedSymptom]);

  // 추천 결과가 변경될 때마다 첫 번째 항목을 기본으로 펼치기
  useEffect(() => {
    const filteredRecommendations = getFilteredRecommendations();
    if (filteredRecommendations.length > 0) {
      setExpandedTreatment(filteredRecommendations[0].id);
    }
  }, [recommendations, selectedSymptom, userInfo.selectedType]);

  // 카테고리나 사용자 정보가 변경될 때 첫 번째 증상 자동 선택
  useEffect(() => {
    if (selectedCategory && userInfo.selectedSymptoms) {
      const categorySymptoms = getSymptomsByCategory(selectedCategory, userInfo.selectedSymptoms);
      if (categorySymptoms.length > 0) {
        // 선택된 증상이 없거나 해당 카테고리에 속하지 않으면 첫 번째 증상 선택
        if (!selectedSymptom || !categorySymptoms.includes(selectedSymptom)) {
          setSelectedSymptom(categorySymptoms[0]);
        }
      }
    }
  }, [selectedCategory, userInfo.selectedSymptoms]);

  const loadUserDataAndGenerateRecommendations = async () => {
    try {
      // 관심 시술 변경 모드 확인
      const changeMode = localStorage.getItem('isInterestChangeMode') === 'true';
      setIsInterestChangeMode(changeMode);
      
      // 로컬스토리지에서 사용자 데이터 가져오기
      const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
      const selectedSymptoms = JSON.parse(localStorage.getItem('selectedSymptoms') || '[]');
      const selectedType = localStorage.getItem('selectedType') || '둘 다 찾고 있어요';
      const formData = JSON.parse(localStorage.getItem('tempRegisterData') || '{}');
      const agreements = JSON.parse(localStorage.getItem('agreements') || '{}');

      const userData = {
        selectedCategories,
        selectedSymptoms,
        selectedType,
        formData,
        agreements
      };

      setUserInfo(userData);

      // 디폴트로 첫 번째 카테고리 선택
      if (selectedCategories.length > 0) {
        setSelectedCategory(selectedCategories[0]);
        
        // 첫 번째 카테고리의 첫 번째 증상 선택
        const firstCategorySymptoms = getSymptomsByCategory(selectedCategories[0], selectedSymptoms);
        if (firstCategorySymptoms.length > 0) {
          setSelectedSymptom(firstCategorySymptoms[0]);
        }
      }
      
      // 추천 시스템 실행
      const result = await getPersonalizedRecommendations(
        selectedCategories,
        selectedSymptoms,
        selectedType,
        userPreferences
      );

      setRecommendations(result);
    } catch (error) {
      console.error('추천 생성 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!userInfo.selectedSymptoms) return;
    
    setLoading(true);
    try {
      const result = await getPersonalizedRecommendations(
        userInfo.selectedCategories,
        userInfo.selectedSymptoms,
        userInfo.selectedType,
        userPreferences
      );
      setRecommendations(result);
    } catch (error) {
      console.error('추천 재생성 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (includeSelectedTreatments = false) => {
    try {
      setLoading(true);
      
      // 관심 시술 변경 모드인지 확인
      const isInterestChangeMode = localStorage.getItem('isInterestChangeMode') === 'true';
      
      // 로컬스토리지에서 사용자 데이터 가져오기
      const selectedCategories = JSON.parse(localStorage.getItem('selectedCategories') || '[]');
      const selectedSymptoms = JSON.parse(localStorage.getItem('selectedSymptoms') || '[]');
      const selectedType = localStorage.getItem('selectedType') || '둘 다 찾고 있어요';
      const formData = JSON.parse(localStorage.getItem('tempRegisterData') || '{}');
      const agreements = JSON.parse(localStorage.getItem('agreements') || '{}');

      // agreements 데이터 검증 및 기본값 설정 (필드명 매핑)
      const validAgreements = {
        serviceTerms: agreements.terms === true || agreements.serviceTerms === true,
        privacyPolicy: agreements.privacy === true || agreements.privacyPolicy === true,
        marketingConsent: agreements.marketing === true || agreements.marketingConsent === true,
        thirdPartyConsent: agreements.thirdParty === true || agreements.thirdPartyConsent === true,
        agreedAt: agreements.agreedAt || new Date().toISOString()
      };

      // 필수 회원가입 정보가 없는 경우 처리
      if (!formData.email || !formData.password) {
        // 회원가입 정보가 없으면 처음부터 다시 시작
        router.push('/auth/register');
        return;
      }

      // name이 없는 경우 이메일에서 추출하거나 기본값 설정
      const userName = formData.name || formData.email?.split('@')[0] || '사용자';

      // 선택된 시술 정보 구성
      const treatmentData = includeSelectedTreatments && selectedTreatments.length > 0 
        ? selectedTreatments.map(treatmentId => {
            const treatment = filteredRecommendations.find(t => t.id === treatmentId);
            return treatment ? {
              treatmentId: treatment.id,
              treatmentName: treatment.name,
              category: treatment.categoryName,
              subcategory: treatment.subcategoryName
            } : null;
          }).filter(Boolean)
        : [];

      // 필수 약관 동의 검증
      if (!validAgreements.serviceTerms || !validAgreements.privacyPolicy) {
        // localStorage 클리어하고 처음부터 시작
        localStorage.removeItem('selectedCategories');
        localStorage.removeItem('selectedSymptoms');
        localStorage.removeItem('selectedType');
        localStorage.removeItem('tempRegisterData');
        localStorage.removeItem('agreements');
        
        // 회원가입 첫 페이지로 이동
        router.push('/auth/register');
        return;
      }

      let response;

      if (isInterestChangeMode) {
        // 관심 시술 변경 모드: 기존 사용자 정보 업데이트
        const token = localStorage.getItem('token');
        
        const updateData = {
          token,
          selectedCategories,
          selectedSymptoms,
          treatmentType: selectedType === '수술만 찾고 있어요' ? 'surgery' 
                       : selectedType === '시술만 찾고 있어요' ? 'procedure' 
                       : 'both',
          selectedTreatments: treatmentData
        };

        response = await fetch('/api/auth/update-interests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });
      } else {
        // 신규 회원가입 모드: 새 사용자 생성
        const registrationData = {
          name: userName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          birthDate: formData.birthDate,
          gender: formData.gender,
          agreements: validAgreements,
          selectedCategories,
          selectedSymptoms,
          treatmentType: selectedType === '수술만 찾고 있어요' ? 'surgery' 
                       : selectedType === '시술만 찾고 있어요' ? 'procedure' 
                       : 'both',
          selectedTreatments: treatmentData,
          registrationStep: 'completed'
        };

        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData)
        });
      }

      const data = await response.json();

      if (data.success) {
        if (isInterestChangeMode) {
          // 관심 시술 변경 모드: 업데이트된 사용자 정보 저장
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          
          // 관심 시술 변경 관련 임시 데이터 정리
          localStorage.removeItem('selectedCategories');
          localStorage.removeItem('selectedSymptoms');
          localStorage.removeItem('selectedType');
          localStorage.removeItem('tempRegisterData');
          localStorage.removeItem('agreements');
          localStorage.removeItem('isInterestChangeMode');
        } else {
          // 신규 회원가입 모드: 토큰과 사용자 정보 저장
          if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }

          // 회원가입 관련 임시 데이터 정리
          localStorage.removeItem('selectedCategories');
          localStorage.removeItem('selectedSymptoms');
          localStorage.removeItem('selectedType');
          localStorage.removeItem('tempRegisterData');
          localStorage.removeItem('agreements');
        }

        // 다른 컴포넌트에 사용자 데이터 변경을 알리는 커스텀 이벤트 발생
        window.dispatchEvent(new Event('userDataChanged'));

        // 홈으로 이동
        router.push('/');
      } else {
        // 회원가입 오류 발생 시 로그만 남기고 조용히 처리
        console.error('회원가입 실패:', data.message);
      }
    } catch (error) {
      // 네트워크 오류 발생 시 로그만 남기고 조용히 처리
      console.error('회원가입 네트워크 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 시술 선택/해제 핸들러
  const handleTreatmentToggle = (treatmentId) => {
    setSelectedTreatments(prev => {
      if (prev.includes(treatmentId)) {
        // 이미 선택된 경우 제거
        return prev.filter(id => id !== treatmentId);
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, treatmentId];
      }
    });
  };

  // 아코디언 토글 핸들러
  const handleAccordionToggle = (treatmentId) => {
    setExpandedTreatment(prev => prev === treatmentId ? null : treatmentId);
  };

  // 카테고리명 매핑
  const categoryNames = {
    face: '얼굴형',
    hair: '헤어',
    skin: '피부',
    nose: '코',
    eye: '눈',
    forahead: '이마',
    mouth: '입술',
    chest: '가슴',
    bodyline: '바디라인',
    yzone: 'Y존',
    waxing: '제모',
    teeth: '치아',
    etc: '기타'
  };

  // 선택된 카테고리들의 이름 가져오기
  const getSelectedCategoryNames = () => {
    return userInfo.selectedCategories?.map(cat => categoryNames[cat] || cat) || [];
  };

  // 특정 카테고리의 증상들 가져오기
  const getSymptomsByCategory = (category, allSymptoms) => {
    const symptomsData = {
      face: [
        '볼살', '턱살/이중턱', '사각턱', '이마볼륨/납작이마', '관자놀이꺼짐', '광대크기', 
        '볼꺼짐', '볼처짐', '돌출입', '앞광대꺼짐/앞광대볼륨', '무턱/짧은턱', '턱근육', 
        '자갈턱', '주걱턱', '보조개', '윤곽라인/얼굴형', '두상교정', '인중길이', 
        '안면윤곽재수술', '침샘비대', '심부볼', '중안부'
      ],
      hair: [
        '탈모', '헤어라인/넓은이마', '헤어라인정리'
      ],
      skin: [
        '피부처짐', '피부탄력', '보습', '팔자주름', '피부재생', '화이트닝', '모공', '기미', '피부색/색소침착',
        '목주름', '피부영양/피부결', '홍조', '점', '여드름', '손주름', '흉터', '주름/잔주름', '각질', '노화/황산화', '눈가주름',
        '미간주름', '여드름흉터', '사마귀', '한관종제거', '쥐젖제거', '비립종제거', '미인점', '주근깨'
      ],
      nose: [
        '매부리코', '넓은코', '복코', '콧구멍', '들창코', '낮은코', '긴코', '휜코', '코끝처짐/처진코', '짧은코', '코재수술',
        '비후성비염', '비밸브협착증', '콧망울'
      ],
      eye: [
        '겹쌍꺼풀', '눈밑꺼짐', '눈길이', '눈두덩이꺼짐', '졸린눈', '눈밑지방', '눈두덩이살', '작은눈', '사나운눈', '다크서클',
        '눈밑처짐', '처진눈꺼풀', '돌출한눈', '트임재수술', '눈재수술', '시력교정', '몽고주름', '하안검'
      ],
      forahead: [
        '이마주름', '이마볼륨/납작이마', '헤어라인/넓은이마', '좁은이마', '눈썹뼈돌출'
      ],
      mouth: [
        '입꼬리처짐', '입술크기', '얇은입술', '돌출입', '입술볼륩', '구순구개열', '입술재수술'
      ],
      chest: [
        '큰가슴', '가슴처짐', '작은가슴', '부유방', '함몰유두', '여유증', '유륜크기/유륜축소', '작은유륜/유륜확대', '짝가슴/가슴비대칭', '유두크기', '가슴재수술'
      ],
      bodyline: [
        '승모근/어깨라인', '엉덩이볼륨', '힙업', '허벅지살', '허벅지근육', '등살', '샐룰라이트', '팔뚝살', '옆구리/러브핸들', '종아리알/종아리근육',
        '체지방', '뱃살', '종아리라인', '엉덩이라인/힙라인', '지방흡입재수술', '붓기', '바이오본드'
      ],
      yzone: [
        '질모양/이쁜이수술', '비키니라인', '성기확대/남성성형', '요실금', '질이완'
      ],
      waxing: [
        '겨드랑이털', '속눈썹숱', '눈썹숱', '발가락털/발등털', '수엽/제모', '바디제모', '바디모발이식', '수염이식'
      ],
      teeth: [
        '라미네이트', '치아색깔', '임플란트', '스케일링', '교정', '돌출입', '잇몸라인', '치아간격', '충치치료'
      ],
      etc: [
        '피로회복', '관자놀이근육', '다한증/손땀', '액취증/겨드랑이냄새', '이갈이', '반영구화장', '아이라인문신제거', '눈썹반영구제거',
        '팔꿈치미백', '겨드랑이미백', '엉덩이미백', '무릎미백', '항문미백', '문제성발톱(내성발톱)', '필러제거', '꽃가루알러지'
      ]
    };

    // 사용자가 선택한 증상들 중에서 해당 카테고리에 속하는 것들만 필터링
    // 선택한 순서를 유지하기 위해 allSymptoms를 기준으로 필터링
    return allSymptoms.filter(symptom => 
      symptomsData[category]?.includes(symptom)
    );
  };

  // 현재 선택된 카테고리의 증상들
  const getCurrentCategorySymptoms = () => {
    return getSymptomsByCategory(selectedCategory, userInfo.selectedSymptoms || []);
  };

  // 치료법 ID로부터 전체 치료법 정보 가져오기
  const getTreatmentDetails = (treatmentIds) => {
    const treatments = [];
    
    Object.values(treatmentCategories).forEach(category => {
      Object.values(category.subcategories || {}).forEach(subcategory => {
        subcategory.treatments?.forEach(treatment => {
          if (treatmentIds.includes(treatment.id)) {
            treatments.push({
              ...treatment,
              categoryId: category.id,
              subcategoryId: subcategory.id,
              categoryName: category.name,
              subcategoryName: subcategory.name,
              difficultyColor: getDifficultyColor(treatment.difficulty),
              recoveryColor: getRecoveryColor(treatment.recovery),
              difficultyLabel: getDifficultyLabel(treatment.difficulty),
              recoveryLabel: treatment.recovery,
              durationLabel: treatment.duration,
              tags: generateTreatmentTags(treatment)
            });
          }
        });
      });
    });
    
    return treatments;
  };

  // 유틸리티 함수들
  const getDifficultyColor = (difficulty) => {
    const colors = {
      'low': '#10B981',
      'medium': '#F59E0B',
      'high': '#EF4444',
      'very_high': '#7C2D12'
    };
    return colors[difficulty] || '#6B7280';
  };

  const getRecoveryColor = (recovery) => {
    const colors = {
      '즉시': '#10B981',
      '1-2일': '#84CC16',
      '3-5일': '#F59E0B',
      '1주': '#F59E0B',
      '1-2주': '#EF4444',
      '2-3주': '#EF4444',
      '3-4주': '#DC2626',
      '4-6주': '#7C2D12',
      '6-8주': '#7C2D12'
    };
    return colors[recovery] || '#6B7280';
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      'low': '쉬움',
      'medium': '보통',
      'high': '어려움',
      'very_high': '매우 어려움'
    };
    return labels[difficulty] || '알 수 없음';
  };

  const generateTreatmentTags = (treatment) => {
    const tags = [];
    
    // 수술/시술 구분 태그 추가
    if (treatment.categoryId === 'surgery') {
      tags.push('수술');
    } else if (treatment.categoryId === 'non_surgical') {
      tags.push('시술');
    } else if (treatment.categoryId === 'specialized') {
      tags.push('전문치료');
    }
    
    if (treatment.difficulty === 'low') tags.push('쉬운 시술');
    if (['즉시', '1-2일', '3-5일'].includes(treatment.recovery)) tags.push('빠른 회복');
    if (treatment.subcategoryId === 'injectables') tags.push('주사치료');
    if (treatment.subcategoryId === 'laser_treatments') tags.push('레이저');
    if (treatment.subcategoryId === 'energy_based_treatments') tags.push('에너지치료');
    if (treatment.duration && treatment.duration.includes('30분')) tags.push('짧은 시술');
    
    return tags;
  };

  // 필터링된 추천 결과 가져오기
  const getFilteredRecommendations = () => {
    if (!selectedSymptom) {
      return recommendations?.recommendations?.topRecommendations || [];
    }
    
    // 선택된 증상에 맞는 치료법 ID들 추출
    const treatmentIds = symptomTreatmentMapping[selectedSymptom] || [];
    
    // 치료법 상세 정보 가져오기 (치료 유형 필터링 적용)
    const allTreatments = getTreatmentDetails(treatmentIds);
    
    // 사용자가 선택한 치료 유형에 따라 필터링
    if (!userInfo.selectedType || userInfo.selectedType === '둘 다 찾고 있어요') {
      return allTreatments;
    }
    
    // treatmentTypeRecommendations를 사용하여 정확한 필터링
    const typeConfig = treatmentTypeRecommendations[userInfo.selectedType];
    
    if (!typeConfig) {
      return allTreatments;
    }
    
    const allowedSubcategories = [...(typeConfig.primary || []), ...(typeConfig.fallback || [])];
    
    // 선택한 치료 유형에 맞는 치료법만 필터링
    const filteredTreatments = allTreatments.filter(treatment => 
      allowedSubcategories.includes(treatment.subcategoryId)
    );
    
    return filteredTreatments;
  };

  // 카테고리 선택 핸들러
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const categorySymptoms = getSymptomsByCategory(category, userInfo.selectedSymptoms || []);
    
    // 현재 선택된 증상이 새로운 카테고리에 속하는지 확인
    if (selectedSymptom && categorySymptoms.includes(selectedSymptom)) {
      // 현재 선택된 증상이 새 카테고리에 속한다면 그대로 유지
      return;
    }
    
    // 현재 선택된 증상이 새 카테고리에 속하지 않거나 선택된 증상이 없다면 무조건 첫 번째 증상 선택
    if (categorySymptoms.length > 0) {
      setSelectedSymptom(categorySymptoms[0]);
    } else {
      setSelectedSymptom('');
    }
  };

  // 증상 선택 핸들러 (단일 선택)
  const handleSymptomSelect = (symptom) => {
    setSelectedSymptom(symptom);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#FF528D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">맞춤 추천을 생성하고 있습니다...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendations?.success) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-500 mb-4">추천 생성에 실패했습니다.</p>
            <button 
              onClick={() => router.back()}
              className="px-6 py-2 bg-[#FF528D] text-white rounded-lg"
            >
              이전으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCategorySymptoms = getCurrentCategorySymptoms();
  const filteredRecommendations = getFilteredRecommendations();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      <Header />
      
      <div className="flex-1 flex flex-col">
        {/* 뒤로가기 영역 - treatment-type 페이지와 동일한 간격 */}
        <div className="pt-20 px-4 pb-6">
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

        {/* 메인 콘텐츠 */}
        <div className="flex-1 px-4">
          <div className="mb-8">
            {/* 메인 텍스트와 페이지네이션 */}
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-semibold leading-[150%] text-inherit" style={{ color: '#313142' }}>
                {isInterestChangeMode ? (
                  <>
                    새로운 관심 시술을<br />
                    선택해보세요
                  </>
                ) : (
                  <>
                    내 고민에 맞는<br />
                    수술 및 시술 정보를 찾았어요
                  </>
                )}
              </h1>
              <div className="text-[#FF528D] text-sm font-semibold">4/4</div>
            </div>
            
            {/* 서브 텍스트 - treatment-type 페이지와 동일한 스타일 */}
            <div className="space-y-1">
              <p className="text-[13px] font-normal leading-[150%]" style={{ color: '#7E7E8F' }}>
                관심 수술 및 시술을 선택하면
              </p>
              <p className="text-[13px] font-normal leading-[150%]" style={{ color: '#7E7E8F' }}>
                홈에서 맞춤 정보를 추천 받을 수 있어요.
              </p>
            </div>
          </div>

          {/* 고민 부위 탭 */}
          <div className="mb-4">
            {/* 탭 헤더 */}
            <div 
              className="flex border-b border-gray-200 mb-4 overflow-x-auto scrollbar-hide"
              style={{ 
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {getSelectedCategoryNames().map((categoryName, index) => {
                const categoryKey = userInfo.selectedCategories[index];
                const isSelected = selectedCategory === categoryKey;
                return (
                  <button
                    key={categoryKey}
                    onClick={() => handleCategorySelect(categoryKey)}
                    className={`px-4 py-3 text-base font-medium transition-all relative whitespace-nowrap flex-shrink-0 ${
                      isSelected
                        ? 'text-[#FF6B35]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {categoryName}
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 선택한 증상 태그들 */}
            <div 
              className="flex gap-2 overflow-x-auto scrollbar-hide"
              style={{ 
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {currentCategorySymptoms.map((symptom, index) => {
                const isSelected = selectedSymptom === symptom;
                return (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomSelect(symptom)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0 ${
                      isSelected
                        ? 'bg-white text-[#FF528D] border-[#FF528D]'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 추천 시술 목록 */}
          <div className="flex-1 pb-32 overflow-y-auto">
            <div className="space-y-4">
              
              {filteredRecommendations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {!selectedSymptom ? (
                    <p>증상을 선택하면 맞춤 시술을 추천해드립니다.</p>
                  ) : (
                    <p>선택한 증상에 맞는 시술이 없습니다.<br />다른 증상을 선택해보세요.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRecommendations.map((treatment, index) => (
                    <TreatmentCard
                      key={treatment.id}
                      treatment={treatment}
                      rank={index + 1}
                      isSelected={selectedTreatments.includes(treatment.id)}
                      isExpanded={expandedTreatment === treatment.id}
                      onToggle={() => handleTreatmentToggle(treatment.id)}
                      onAccordionToggle={() => handleAccordionToggle(treatment.id)}
                    />
                  ))}
                </div>
              )}
              
                            {/* 안내사항 */}
              <div className="mt-8 px-4">
                <div className="flex items-start space-x-2">
                  <span className="text-xs text-gray-500 flex-shrink-0">*</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    위 정보는 의학적인 판단이나 진단이 아닌 참고용 정보이며,
                    의료기관, 환자 등에 따라 차이가 있을 수 있으므로
                    시술 여부 및 횟수 등을 결정할 때에는 반드시 의료기관과
                    상담하여 정해주세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 완료 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4">
        <div className="flex gap-4">
          {/* 건너뛰기 버튼 - 더 작은 크기 */}
          <button
            onClick={() => handleCompleteRegistration(false)}
            disabled={loading}
            className="flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] transition-all duration-200"
            style={{ 
              height: '56px',
              width: '120px',
              backgroundColor: loading ? '#EFEFEF' : 'white',
              color: loading ? '#BDBDD4' : '#FF8BB8',
              border: `2px solid ${loading ? '#EFEFEF' : '#FF8BB8'}`,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '처리중...' : isInterestChangeMode ? '변경 안함' : '건너뛰기'}
          </button>
          
          {/* 추천받고 시작 버튼 - 더 큰 크기 */}
          <button
            onClick={() => handleCompleteRegistration(true)}
            disabled={loading || selectedTreatments.length === 0}
            className="flex-1 flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] transition-all duration-200"
            style={{ 
              height: '56px',
              backgroundColor: loading || selectedTreatments.length === 0 ? '#EFEFEF' : '#FF528D',
              color: loading || selectedTreatments.length === 0 ? '#BDBDD4' : 'white',
              cursor: loading || selectedTreatments.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '처리중...' : isInterestChangeMode ? '관심 시술 변경 완료' : '홈에서 추천받고 시작하기'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 치료법 카드 컴포넌트 (아코디언 UI)
function TreatmentCard({ treatment, rank, isSelected, isExpanded, onToggle, onAccordionToggle }) {
  return (
    <div 
      className={`rounded-lg transition-all cursor-pointer ${
        isSelected 
          ? 'border-2 border-[#FF528D] bg-white' 
          : 'border border-gray-200 bg-white hover:shadow-md'
      }`}
      onClick={onToggle}
    >
      {/* 아코디언 헤더 */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {/* 순위 */}
          <div className="flex-shrink-0 w-6 flex justify-start">
            <span className="text-lg font-bold text-[#FF528D]">{rank}</span>
          </div>
          
          {/* 제목 */}
          <h3 className="text-lg font-semibold text-gray-900">{treatment.name}</h3>
        </div>

        {/* 아코디언 화살표 */}
        <div 
          className="flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            onAccordionToggle();
          }}
        >
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* 아코디언 콘텐츠 */}
      {isExpanded && (
        <div className="pl-13 pr-4 pb-4">
          <div className="space-y-3">
            {/* 시술 설명 */}
            {treatment.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">시술 설명</h4>
                <p className="text-sm font-semibold text-label-plasticSurgery_2">{treatment.description}</p>
              </div>
            )}

            {/* 카테고리 정보 */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">분류</h4>
              <p className="text-sm font-semibold text-label-plasticSurgery_2">
                {treatment.categoryName} • {treatment.subcategoryName}
              </p>
            </div>

            {/* 치료 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">회복 기간</h4>
                <p className="text-sm font-semibold text-label-plasticSurgery_2">{treatment.recoveryLabel}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">시술 시간</h4>
                <p className="text-sm font-semibold text-label-plasticSurgery_2">{treatment.durationLabel}</p>
              </div>
            </div>

            {/* 태그들 */}
            {treatment.tags && treatment.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">특징</h4>
                <div className="flex flex-wrap gap-1">
                  {treatment.tags.slice(0, 5).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 