"use client";

import { useState, useEffect } from 'react';

export default function BeautyFilterModal({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('face');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // 카테고리별 증상 데이터
  const symptomsData = {
    face: [
      '볼살', '턱살/이중턱', '사각턱', '이마볼륨/납작이마', '관자놀이꺼짐', '광대크기', 
      '볼꺼짐', '볼처짐', '돌출입', '앞광대꺼짐/앞광대볼륨', '무턱/짧은턱', '턱근육', 
      '자갈턱', '주걱턱', '보조개', '윤곽라인/얼굴형', '두상교정', '인중길이', 
      '안면윤곽재수술', '침샘비대', '심부볼', '중안부'
    ],
    skin: [
      '피부처짐', '피부탄력', '보습', '팔자주름', '피부재생', '화이트닝', '모공', '기미', '피부색/색소침착',
      '목주름', '피부영양/피부결', '홍조', '점', '여드름', '손주름', '흉터', '주름/잔주름', '각질', '노화/황산화', '눈가주름',
      '미간주름', '여드름흉터', '사마귀', '한관종제거', '쥐젖제거', '비립종제거', '미인점', '주근깨'
    ],
    eye: [
      '겹쌍꺼풀', '눈밑꺼짐', '눈길이', '눈두덩이꺼짐', '졸린눈', '눈밑지방', '눈두덩이살', '작은눈', '사나운눈', '다크서클',
      '눈밑처짐', '처진눈꺼풀', '돌출한눈', '트임재수술', '눈재수술', '시력교정', '몽고주름', '하안검'
    ],
    nose: [
      '매부리코', '넓은코', '복코', '콧구멍', '들창코', '낮은코', '긴코', '휜코', '코끝처짐/처진코', '짧은코', '코재수술',
      '비후성비염', '비밸브협착증', '콧망울'
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

  // 카테고리 이름 매핑
  const categoryNames = {
    face: '얼굴형',
    skin: '피부',
    eye: '눈',
    nose: '코',
    mouth: '입술',
    chest: '가슴',
    bodyline: '체형/지방',
    waxing: '헤어/제모',
    teeth: '치아',
    etc: '기타'
  };

  // 카테고리 목록
  const categories = Object.keys(categoryNames);

  // 선택된 카테고리의 증상들 가져오기
  const currentSymptoms = symptomsData[selectedCategory] || [];

  // 증상 선택/해제 핸들러
  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev => {
      const isSelected = prev.includes(symptom);
      if (isSelected) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    const currentCategorySymptoms = currentSymptoms;
    const allSelected = currentCategorySymptoms.every(symptom => selectedSymptoms.includes(symptom));
    
    if (allSelected) {
      // 전체 해제
      setSelectedSymptoms(prev => prev.filter(symptom => !currentCategorySymptoms.includes(symptom)));
    } else {
      // 전체 선택
      const newSymptoms = [...selectedSymptoms];
      currentCategorySymptoms.forEach(symptom => {
        if (!newSymptoms.includes(symptom)) {
          newSymptoms.push(symptom);
        }
      });
      setSelectedSymptoms(newSymptoms);
    }
  };

  // 초기화
  const handleReset = () => {
    setSelectedSymptoms([]);
  };

  // 결과보기
  const handleApply = () => {
    // TODO: 선택된 증상으로 필터링 적용
    console.log('선택된 증상들:', selectedSymptoms);
    onClose();
  };

  // 백드롭 클릭 시 닫기
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black z-[50] opacity-50"
        style={{ pointerEvents: 'auto' }}
        onClick={handleBackdropClick}
        data-state="open"
        data-aria-hidden="true"
        aria-hidden="true"
      />
      
      {/* Modal Container - 모달 컨테이너 */}
      <div className="fixed inset-0 z-[51] flex items-end justify-center pointer-events-none">
        <div 
          className="tablet:w-[375px] w-[100vw] rounded-t-[16px] bg-white animate-slide-up pointer-events-auto"
          style={{
            animation: isOpen ? 'slideUp 0.3s ease-out' : 'slideDown 0.3s ease-in'
          }}
        >
          <style jsx>{`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            @keyframes slideDown {
              from {
                transform: translateY(0);
                opacity: 1;
              }
              to {
                transform: translateY(100%);
                opacity: 0;
              }
            }
          `}</style>

          {/* 헤더 */}
          <div className="flex justify-between p-[16px]">
            <h4 className="leading-[150%] text-inherit text-base font-semibold">성형 필터</h4>
            <button type="button" onClick={onClose}>
              <span 
                className="material-symbols-rounded text-inherit" 
                aria-hidden="true" 
                style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
              >
                close
              </span>
            </button>
          </div>

          {/* 탭 헤더 */}
          <div className="mx-[16px]">
            <div className="flex gap-[12px] border-b border-outline-common_2">
              <h3 className="inline-flex gap-[4px] h-[40px] cursor-pointer border-b-[3px] transition border-[#FF528D] leading-[150%] text-inherit text-lg font-semibold">
                <button className="transition text-[#FF528D]">뷰티고민</button>
              </h3>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="grid grid-cols-[110px,auto] h-[50vh]">
              {/* 왼쪽 카테고리 리스트 */}
              <ul className="flex flex-col gap-[12px] px-[12px] py-[16px] border-r border-outline-common_2 overflow-y-auto scrollbar-hide">
                {categories.map((categoryId) => (
                  <li key={categoryId} className="cursor-pointer">
                    <h4 
                      onClick={() => setSelectedCategory(categoryId)}
                      className={`flex w-full gap-[4px] items-start leading-[150%] text-inherit text-base font-semibold ${
                        selectedCategory === categoryId ? 'text-[#FF528D]' : 'text-label-common_3'
                      }`}
                    >
                      {categoryNames[categoryId]}
                    </h4>
                  </li>
                ))}
              </ul>

              {/* 오른쪽 증상 리스트 */}
              <div className="pt-[12px] overflow-y-auto scrollbar-hide">
                <ul>
                  {/* 전체 선택 */}
                  <li>
                    <div 
                      className="flex gap-[8px] py-[12px] px-[16px] items-center cursor-pointer"
                      onClick={handleSelectAll}
                    >
                      <CheckboxIcon 
                        checked={currentSymptoms.length > 0 && currentSymptoms.every(symptom => selectedSymptoms.includes(symptom))}
                      />
                      <span className="leading-[150%] text-inherit text-sm font-semibold">
                        {categoryNames[selectedCategory]} 전체
                      </span>
                    </div>
                  </li>

                  {/* 개별 증상들 */}
                  {currentSymptoms.map((symptom, index) => (
                    <li key={index}>
                      <div 
                        className="flex gap-[8px] py-[12px] px-[16px] items-center cursor-pointer"
                        onClick={() => handleSymptomToggle(symptom)}
                      >
                        <CheckboxIcon checked={selectedSymptoms.includes(symptom)} />
                        <span className="leading-[150%] text-inherit text-sm font-semibold">
                          {symptom}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 선택된 항목들 표시 */}
          {selectedSymptoms.length > 0 && (
            <div className="border-t border-outline-common_2">
              <div className="flex gap-[8px] pt-[12px] pl-[16px] overflow-auto">
                {selectedSymptoms.map((symptom, index) => (
                  <button
                    key={index}
                    onClick={() => handleSymptomToggle(symptom)}
                    className="flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[200px] px-[10px] text-[12px] gap-[2px] bg-container-common_2 text-label-common_5 border border-outline-common_2"
                    style={{ height: '32px' }}
                  >
                    {symptom}
                    <span 
                      className="material-symbols-rounded !text-[16px] text-label-common_4" 
                      aria-hidden="true" 
                      style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                    >
                      close
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className={selectedSymptoms.length === 0 ? "border-t border-outline-common_2" : ""}>
            <div className="grid grid-cols-[auto,1fr] gap-[8px] p-[16px]">
              <button 
                onClick={handleReset}
                className="text-label-common_6 flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px] text-label-common_3"
                style={{ height: '56px' }}
              >
                <span 
                  className="material-symbols-rounded text-inherit" 
                  aria-hidden="true" 
                  style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24' }}
                >
                  refresh
                </span>
                초기화
              </button>
              <button 
                onClick={handleApply}
                className="w-full flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[12px] px-[20px] text-[16px] gap-[6px]"
                style={{ 
                  height: '56px',
                  backgroundColor: '#FF528D',
                  color: 'white'
                }}
              >
                결과보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// 체크박스 아이콘 컴포넌트
function CheckboxIcon({ checked }) {
  if (checked) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
        <mask id="ic-checkbox-pink_svg__a" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: 'alpha' }}>
          <path fill="#D9D9D9" d="M0 0h16v16H0z"></path>
        </mask>
        <g mask="url(#ic-checkbox-pink_svg__a)">
          <path fill="#FF528D" d="M3.333 14q-.55 0-.941-.392A1.28 1.28 0 0 1 2 12.667V3.333q0-.55.392-.941Q2.783 2 3.333 2h9.334q.55 0 .941.392.392.391.392.941v9.334q0 .55-.392.941a1.28 1.28 0 0 1-.941.392z"></path>
          <path fill="#fff" d="m6.667 10.5 5.166-5.167L10.5 4 6.667 7.833 5.5 6.667 4.167 8z"></path>
        </g>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
      <mask id="ic-uncheckbox-gray_svg__a" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: 'alpha' }}>
        <path fill="#D9D9D9" d="M0 0h16v16H0z"></path>
      </mask>
      <g mask="url(#ic-uncheckbox-gray_svg__a)">
        <path fill="#fff" d="M3.333 14q-.55 0-.941-.392A1.28 1.28 0 0 1 2 12.667V3.333q0-.55.392-.941Q2.783 2 3.333 2h9.334q.55 0 .941.392.392.391.392.941v9.334q0 .55-.392.941a1.28 1.28 0 0 1-.941.392z"></path>
        <path fill="#A3A3AF" d="M3.333 14q-.55 0-.941-.392A1.28 1.28 0 0 1 2 12.667V3.333q0-.55.392-.941Q2.783 2 3.333 2h9.334q.55 0 .941.392.392.391.392.941v9.334q0 .55-.392.941a1.28 1.28 0 0 1-.941.392zm0-1.333h9.334V3.333H3.333z"></path>
      </g>
    </svg>
  );
}