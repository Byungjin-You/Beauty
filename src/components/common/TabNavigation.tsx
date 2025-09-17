import React from 'react';

/**
 * TabNavigation의 props 인터페이스
 */
interface ITabNavigationProps {
  /** 탭 목록 */
  tabs: Array<{
    id: string;
    label: string;
    count?: number | null;
    active?: boolean;
  }>;
  /** 활성 탭 ID (activeTab prop을 사용하는 경우) */
  activeTab?: string;
  /** 탭 클릭 시 실행될 함수 */
  onTabClick: (tabId: string) => void;
  /** 컨테이너 최대 너비 */
  maxWidth?: string;
  /** 컨테이너 클래스명 추가 */
  className?: string;
}

/**
 * 병원 페이지에서 사용하는 공통 탭 네비게이션 컴포넌트
 * 
 * @param props - TabNavigation 컴포넌트 props
 * @returns 탭 네비게이션 컴포넌트
 */
const TabNavigation: React.FC<ITabNavigationProps> = ({
  tabs,
  activeTab,
  onTabClick,
  maxWidth = '1024px',
  className = ''
}) => {
  const isTabActive = (tab: typeof tabs[0]) => {
    // tab.active prop이 있으면 그것을 우선 사용, 없으면 activeTab과 비교
    return tab.active !== undefined ? tab.active : activeTab === tab.id;
  };

  return (
    <div className={`w-[100vw] sticky top-0 z-20 bg-background-common_1 border-b-[1px] border-b-divider-common_1 ${className}`} style={{ maxWidth }}>
      <div className="flex items-center gap-[8px] overflow-scroll scrollbar-hide desktop:px-[32px] tablet:px-[24px] px-[16px] py-[12px] w-auto">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab);
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`flex flex-none items-center justify-center tablet:h-[48px] h-[36px] min-w-[60px] tablet:px-[16px] px-[12px] tablet:rounded-[16px] rounded-[12px] ${
                isActive 
                  ? 'bg-container-plasticSurgery_3 text-white' 
                  : 'bg-white text-label-common_4'
              }`}
            >
              <span className="flex items-center justify-center gap-[2px] leading-[150%] text-inherit text-sm font-semibold">
                {tab.label}
                {tab.count !== null && tab.count !== undefined && (
                  <span className={`text-[14px] ${isActive ? 'text-white' : 'text-label-common_3'}`}>
                    ({tab.count})
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigation;
