"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';

export default function SymptomsPage() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const maxSelection = 10;

  // 카테고리별 증상 데이터
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

    // 다른 카테고리들도 필요시 추가 가능
  };

  // 카테고리 ID를 한글명으로 매핑
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

  useEffect(() => {
    // localStorage에서 선택된 카테고리 가져오기
    const savedCategories = localStorage.getItem('selectedCategories');
    if (savedCategories) {
      setSelectedCategories(JSON.parse(savedCategories));
    }
  }, []);

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      const isSelected = prev.includes(symptom);
      
      if (isSelected) {
        // 이미 선택된 경우 제거
        return prev.filter(item => item !== symptom);
      } else {
        // 새로 선택하는 경우
        if (prev.length >= maxSelection) {
          // 최대 선택 개수에 도달한 경우, 가장 오래된 것을 제거하고 새 것을 추가
          return [...prev.slice(1), symptom];
        } else {
          // 아직 여유가 있는 경우 추가
          return [...prev, symptom];
        }
      }
    });
  };

  const handleNext = () => {
    if (selectedSymptoms.length > 0) {
      // 선택된 증상을 localStorage에 저장
      localStorage.setItem('selectedSymptoms', JSON.stringify(selectedSymptoms));
      // 다음 단계로 이동
      router.push('/auth/register/treatment-type');
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
                해당되는 고민과 증상을<br />
                모두 선택해주세요.
              </h1>
              <div className="text-[#FF528D] text-sm font-semibold">2/4</div>
            </div>
            
            {/* 서브 텍스트 - 로그인/회원가입 페이지와 동일한 스타일 */}
            <p className="text-[13px] font-normal leading-[150%]" style={{ color: '#7E7E8F' }}>
              최대 {maxSelection}개까지 선택할 수 있어요.
            </p>
          </div>

          {/* 증상 선택 영역 */}
          <div className="flex-1 mb-8 pb-20 px-2">
            {selectedCategories.length > 0 ? (
              <div className="space-y-8">
                {selectedCategories.map((categoryId) => {
                  const symptoms = symptomsData[categoryId] || [];
                  const categoryName = categoryNames[categoryId] || categoryId;
                  
                  if (symptoms.length === 0) return null;
                  
                  return (
                    <div key={categoryId} className="space-y-2">
                      {/* 카테고리 제목 */}
                      <h3 className="text-lg font-semibold text-gray-800 px-2 mb-4">
                        {categoryName}
                      </h3>
                      
                      {/* 증상 태그들 */}
                      <div className="flex flex-wrap gap-[12px] px-2">
                        {symptoms.map((symptom, index) => {
                          const isSelected = selectedSymptoms.includes(symptom);
                          return (
                            <button
                              key={index}
                              onClick={() => handleSymptomToggle(symptom)}
                              className={`min-w-[42px] flex flex-none justify-center items-center text-label-common_4 leading-[150%] text-sm font-medium rounded-[8px] px-[12px] py-[8px] gap-[2px] transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-white border border-[#FF528D]' 
                                  : 'bg-white border border-outline-common_2'
                              }`}
                              style={{
                                color: isSelected ? '#FF528D' : '#555555'
                              }}
                            >
                              {symptom}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 text-lg">
                    선택된 고민 부위가 없습니다
                  </p>
                  <p className="text-gray-300 text-sm mt-2">
                    이전 단계에서 고민 부위를 먼저 선택해주세요
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 플로팅 하단 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white px-4 py-4">
          <button
            onClick={handleNext}
            disabled={selectedSymptoms.length === 0}
            className="w-full flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] transition-all duration-200"
            style={{ 
              height: '56px',
              backgroundColor: selectedSymptoms.length > 0 ? '#FF528D' : '#EFEFEF',
              color: selectedSymptoms.length > 0 ? 'white' : '#BDBDD4',
              cursor: selectedSymptoms.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            다음 단계로
          </button>
        </div>
      </div>
    </div>
  );
} 