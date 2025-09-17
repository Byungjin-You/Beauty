// 치료 추천 시스템 알고리즘
import { 
  treatmentCategories, 
  symptomTreatmentMapping, 
  treatmentTypeRecommendations,
  difficultyColors,
  recoveryColors 
} from '../data/comprehensive-treatments';

/**
 * 사용자의 선택에 따라 맞춤형 치료법을 추천하는 메인 함수
 * @param {Array} selectedCategories - 선택된 관심부위 (예: ['face', 'eye'])
 * @param {Array} selectedSymptoms - 선택된 증상/고민 (예: ['볼살', '눈밑지방'])
 * @param {string} treatmentType - 치료 유형 ('시술', '수술', '둘 다 찾고 있어요')
 * @param {Object} userPreferences - 사용자 선호도 (예: { difficulty: 'low', recovery: 'fast' })
 * @returns {Object} 추천 결과
 */
export function getPersonalizedRecommendations(
  selectedCategories = [],
  selectedSymptoms = [],
  treatmentType = '둘 다 찾고 있어요',
  userPreferences = {}
) {
  try {
    // 1. 증상 기반 치료법 추출
    const symptomBasedTreatments = extractTreatmentsBySymptoms(selectedSymptoms);
    
    // 2. 치료 유형별 필터링
    const typeFilteredTreatments = filterByTreatmentType(symptomBasedTreatments, treatmentType);
    
    // 3. 카테고리별 그룹화
    const categorizedTreatments = categorizeTreatments(typeFilteredTreatments);
    
    // 4. 사용자 선호도에 따른 점수 계산 및 정렬
    const scoredTreatments = scoreAndSortTreatments(categorizedTreatments, userPreferences);
    
    // 5. 최종 추천 결과 생성
    const recommendations = generateRecommendations(
      scoredTreatments,
      selectedCategories,
      selectedSymptoms,
      treatmentType
    );
    
    return {
      success: true,
      recommendations,
      totalTreatments: Object.values(scoredTreatments).flat().length,
      categories: Object.keys(scoredTreatments),
      metadata: {
        selectedCategories,
        selectedSymptoms,
        treatmentType,
        userPreferences
      }
    };
    
  } catch (error) {
    console.error('추천 시스템 오류:', error);
    return {
      success: false,
      error: error.message,
      recommendations: {},
      totalTreatments: 0
    };
  }
}

/**
 * 선택된 증상들로부터 관련 치료법들을 추출
 */
function extractTreatmentsBySymptoms(selectedSymptoms) {
  const treatmentIds = new Set();
  
  selectedSymptoms.forEach(symptom => {
    if (symptomTreatmentMapping[symptom]) {
      symptomTreatmentMapping[symptom].forEach(treatmentId => {
        treatmentIds.add(treatmentId);
      });
    }
  });
  
  // 모든 치료법 데이터에서 해당 ID들을 찾아서 반환
  const treatments = [];
  
  Object.values(treatmentCategories).forEach(category => {
    Object.values(category.subcategories || {}).forEach(subcategory => {
      subcategory.treatments?.forEach(treatment => {
        if (treatmentIds.has(treatment.id)) {
          treatments.push({
            ...treatment,
            categoryId: category.id,
            subcategoryId: subcategory.id,
            categoryName: category.name,
            subcategoryName: subcategory.name
          });
        }
      });
    });
  });
  
  return treatments;
}

/**
 * 치료 유형에 따라 필터링
 */
function filterByTreatmentType(treatments, treatmentType) {
  const typeConfig = treatmentTypeRecommendations[treatmentType];
  
  if (!typeConfig) {
    return treatments; // 전체 반환
  }
  
  const primaryCategories = typeConfig.primary || [];
  const fallbackCategories = typeConfig.fallback || [];
  
  // 1차 우선순위 치료법
  const primaryTreatments = treatments.filter(treatment => 
    primaryCategories.includes(treatment.subcategoryId)
  );
  
  // 2차 우선순위 치료법 (1차가 부족할 경우)
  const fallbackTreatments = treatments.filter(treatment => 
    fallbackCategories.includes(treatment.subcategoryId)
  );
  
  // 1차 우선순위가 충분하면 1차만, 부족하면 2차까지 포함
  return primaryTreatments.length >= 5 
    ? primaryTreatments 
    : [...primaryTreatments, ...fallbackTreatments];
}

/**
 * 치료법들을 카테고리별로 그룹화
 */
function categorizeTreatments(treatments) {
  const categorized = {};
  
  treatments.forEach(treatment => {
    const key = treatment.subcategoryId;
    if (!categorized[key]) {
      categorized[key] = {
        name: treatment.subcategoryName,
        categoryName: treatment.categoryName,
        treatments: []
      };
    }
    categorized[key].treatments.push(treatment);
  });
  
  return categorized;
}

/**
 * 사용자 선호도에 따른 점수 계산 및 정렬
 */
function scoreAndSortTreatments(categorizedTreatments, userPreferences) {
  const {
    difficulty = 'all',      // 'low', 'medium', 'high', 'very_high', 'all'
    recovery = 'all',        // 'fast', 'medium', 'slow', 'all'
    duration = 'all',        // 'short', 'medium', 'long', 'all'
    budget = 'all'           // 'low', 'medium', 'high', 'all' (향후 확장용)
  } = userPreferences;
  
  Object.keys(categorizedTreatments).forEach(categoryKey => {
    const category = categorizedTreatments[categoryKey];
    
    category.treatments = category.treatments.map(treatment => {
      let score = 100; // 기본 점수
      
      // 난이도 선호도 점수
      if (difficulty !== 'all') {
        if (treatment.difficulty === difficulty) {
          score += 30;
        } else if (getDifficultyLevel(treatment.difficulty) > getDifficultyLevel(difficulty)) {
          score -= 20; // 더 어려운 경우 감점
        }
      }
      
      // 회복 기간 선호도 점수
      if (recovery !== 'all') {
        const recoveryScore = getRecoveryScore(treatment.recovery, recovery);
        score += recoveryScore;
      }
      
      // 시술 시간 선호도 점수
      if (duration !== 'all') {
        const durationScore = getDurationScore(treatment.duration, duration);
        score += durationScore;
      }
      
      return {
        ...treatment,
        score,
        preferenceMatch: {
          difficulty: difficulty === 'all' || treatment.difficulty === difficulty,
          recovery: recovery === 'all' || isRecoveryMatch(treatment.recovery, recovery),
          duration: duration === 'all' || isDurationMatch(treatment.duration, duration)
        }
      };
    });
    
    // 점수순으로 정렬
    category.treatments.sort((a, b) => b.score - a.score);
  });
  
  return categorizedTreatments;
}

/**
 * 최종 추천 결과 생성
 */
function generateRecommendations(scoredTreatments, selectedCategories, selectedSymptoms, treatmentType) {
  const recommendations = {
    topRecommendations: [], // 최고 추천 (상위 5개)
    categoryRecommendations: {}, // 카테고리별 추천
    alternativeOptions: [], // 대안 옵션들
    quickTreatments: [], // 빠른 시술들 (회복기간 짧음)
    comprehensiveTreatments: [] // 종합적 치료들 (효과 높음)
  };
  
  // 모든 치료법을 점수순으로 평면화
  const allTreatments = [];
  Object.values(scoredTreatments).forEach(category => {
    allTreatments.push(...category.treatments);
  });
  allTreatments.sort((a, b) => b.score - a.score);
  
  // 최고 추천 (상위 5개, 중복 제거)
  const topIds = new Set();
  recommendations.topRecommendations = allTreatments
    .filter(treatment => {
      if (topIds.has(treatment.id)) return false;
      topIds.add(treatment.id);
      return true;
    })
    .slice(0, 5)
    .map(treatment => enhanceTreatmentInfo(treatment));
  
  // 카테고리별 추천 (각 카테고리에서 상위 3개)
  Object.keys(scoredTreatments).forEach(categoryKey => {
    const category = scoredTreatments[categoryKey];
    recommendations.categoryRecommendations[categoryKey] = {
      name: category.name,
      categoryName: category.categoryName,
      treatments: category.treatments
        .slice(0, 3)
        .map(treatment => enhanceTreatmentInfo(treatment))
    };
  });
  
  // 빠른 시술들 (회복기간 3일 이하)
  recommendations.quickTreatments = allTreatments
    .filter(treatment => isQuickRecovery(treatment.recovery))
    .slice(0, 5)
    .map(treatment => enhanceTreatmentInfo(treatment));
  
  // 종합적 치료들 (수술 포함, 높은 효과)
  recommendations.comprehensiveTreatments = allTreatments
    .filter(treatment => treatment.categoryId === 'surgery')
    .slice(0, 5)
    .map(treatment => enhanceTreatmentInfo(treatment));
  
  return recommendations;
}

/**
 * 치료법 정보를 추가 정보와 함께 강화
 */
function enhanceTreatmentInfo(treatment) {
  return {
    ...treatment,
    difficultyColor: difficultyColors[treatment.difficulty] || '#6B7280',
    recoveryColor: recoveryColors[treatment.recovery] || '#6B7280',
    difficultyLabel: getDifficultyLabel(treatment.difficulty),
    recoveryLabel: getRecoveryLabel(treatment.recovery),
    durationLabel: getDurationLabel(treatment.duration),
    tags: generateTreatmentTags(treatment),
    estimatedCost: getEstimatedCost(treatment), // 향후 구현
    pros: getTreatmentPros(treatment),
    cons: getTreatmentCons(treatment),
    suitableFor: getSuitableFor(treatment)
  };
}

// 유틸리티 함수들
function getDifficultyLevel(difficulty) {
  const levels = { 'low': 1, 'medium': 2, 'high': 3, 'very_high': 4 };
  return levels[difficulty] || 0;
}

function getDifficultyLabel(difficulty) {
  const labels = {
    'low': '쉬움',
    'medium': '보통',
    'high': '어려움',
    'very_high': '매우 어려움'
  };
  return labels[difficulty] || '알 수 없음';
}

function getRecoveryLabel(recovery) {
  return recovery || '정보 없음';
}

function getDurationLabel(duration) {
  return duration || '정보 없음';
}

function getRecoveryScore(recovery, preference) {
  const fastRecovery = ['즉시', '1-2일', '3-5일'];
  const mediumRecovery = ['1주', '1-2주', '2-3주'];
  const slowRecovery = ['3-4주', '4-6주', '6-8주'];
  
  if (preference === 'fast' && fastRecovery.includes(recovery)) return 25;
  if (preference === 'medium' && mediumRecovery.includes(recovery)) return 20;
  if (preference === 'slow' && slowRecovery.includes(recovery)) return 15;
  return 0;
}

function getDurationScore(duration, preference) {
  // 시술 시간에 따른 점수 계산 (향후 구현)
  return 0;
}

function isRecoveryMatch(recovery, preference) {
  const fastRecovery = ['즉시', '1-2일', '3-5일'];
  const mediumRecovery = ['1주', '1-2주', '2-3주'];
  const slowRecovery = ['3-4주', '4-6주', '6-8주'];
  
  if (preference === 'fast') return fastRecovery.includes(recovery);
  if (preference === 'medium') return mediumRecovery.includes(recovery);
  if (preference === 'slow') return slowRecovery.includes(recovery);
  return true;
}

function isDurationMatch(duration, preference) {
  // 시술 시간 매칭 로직 (향후 구현)
  return true;
}

function isQuickRecovery(recovery) {
  return ['즉시', '1-2일', '3-5일'].includes(recovery);
}

function generateTreatmentTags(treatment) {
  const tags = [];
  
  if (treatment.difficulty === 'low') tags.push('쉬운 시술');
  if (isQuickRecovery(treatment.recovery)) tags.push('빠른 회복');
  if (treatment.categoryId === 'non_surgical') tags.push('비수술');
  if (treatment.subcategoryId === 'injectables') tags.push('주사치료');
  if (treatment.subcategoryId === 'laser_treatments') tags.push('레이저');
  if (treatment.duration && treatment.duration.includes('30분')) tags.push('짧은 시술');
  
  return tags;
}

function getEstimatedCost(treatment) {
  // 향후 구현 - 치료법별 예상 비용 범위
  return null;
}

function getTreatmentPros(treatment) {
  // 치료법별 장점 (향후 구현)
  const prosMap = {
    'botox_jaw': ['비수술', '즉시 일상 복귀', '자연스러운 효과'],
    'double_eyelid': ['영구적 효과', '자연스러운 라인', '젊어 보이는 인상'],
    'filler_nasolabial': ['즉시 효과', '자연스러운 볼륨', '시술 시간 짧음']
  };
  
  return prosMap[treatment.id] || ['전문의 시술', '검증된 방법'];
}

function getTreatmentCons(treatment) {
  // 치료법별 단점 (향후 구현)
  const consMap = {
    'botox_jaw': ['일시적 효과', '3-6개월마다 재시술 필요'],
    'double_eyelid': ['수술적 방법', '회복 기간 필요', '영구적 변화'],
    'jaw_reduction': ['전신마취 필요', '긴 회복 기간', '높은 비용']
  };
  
  return consMap[treatment.id] || [];
}

function getSuitableFor(treatment) {
  // 치료법이 적합한 대상 (향후 구현)
  return ['전문의 상담 후 결정'];
}

/**
 * 특정 부위에 대한 추천 치료법 검색
 */
export function getRecommendationsByCategory(category) {
  const treatments = [];
  
  Object.values(treatmentCategories).forEach(mainCategory => {
    Object.values(mainCategory.subcategories || {}).forEach(subcategory => {
      subcategory.treatments?.forEach(treatment => {
        if (treatment.category === category) {
          treatments.push({
            ...treatment,
            categoryName: mainCategory.name,
            subcategoryName: subcategory.name
          });
        }
      });
    });
  });
  
  return treatments.map(treatment => enhanceTreatmentInfo(treatment));
}

/**
 * 치료법 상세 정보 가져오기
 */
export function getTreatmentDetails(treatmentId) {
  let foundTreatment = null;
  
  Object.values(treatmentCategories).forEach(category => {
    Object.values(category.subcategories || {}).forEach(subcategory => {
      const treatment = subcategory.treatments?.find(t => t.id === treatmentId);
      if (treatment) {
        foundTreatment = {
          ...treatment,
          categoryName: category.name,
          subcategoryName: subcategory.name
        };
      }
    });
  });
  
  return foundTreatment ? enhanceTreatmentInfo(foundTreatment) : null;
}

export default {
  getPersonalizedRecommendations,
  getRecommendationsByCategory,
  getTreatmentDetails
}; 