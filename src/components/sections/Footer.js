"use client";

const Footer = () => {
  return (
    <footer className="pt-[40px] w-full">
      {/* 메인 Footer 정보 - 바비톡 원본과 완전히 동일 */}
      <div className="flex flex-col w-full pt-[40px] pb-[40px] justify-start items-start gap-[24px] border-t border-gray-200 bg-gray-50">
        <div className="desktop:px-[32px] tablet:px-[24px] px-[16px] w-full">
          
          {/* 로고 섹션 */}
          <div className="self-stretch flex-col justify-start items-start gap-2.5 flex mb-6">
            <div className="text-gray-500 text-xs font-medium tracking-[0.1em] opacity-60">
              TOKTOK
            </div>
          </div>
          
          {/* 메인 컨텐츠 - 두 열 레이아웃 */}
          <div className="flex tablet:flex-row flex-col w-full justify-center items-start gap-3">
            
            {/* 왼쪽 열 */}
            <div className="tablet:w-[50%] self-stretch flex-col justify-start items-start gap-[16px] inline-flex">
              <div className="self-stretch justify-start items-center gap-[6px] flex flex-wrap">
                <span className="text-label-common_5 leading-[150%] text-inherit text-xs font-semibold">주식회사 톡톡</span>
                <div className="w-px h-3 bg-divider-common_3"></div>
                <span className="text-label-common_5 leading-[150%] text-inherit text-xs font-semibold">대표이사 바이통진유</span>
                <div className="w-px h-3 bg-divider-common_3"></div>
                <span className="text-label-common_5 leading-[150%] text-inherit text-xs font-semibold">개인정보 관리책임자 바이통진유</span>
              </div>
              <div className="self-stretch text-label-common_3 text-xs font-normal leading-[1.5]">
                사업자등록번호 123-45-67890<br />
                통신판매업신고번호 2024-서울강남-12345
              </div>
              <div className="self-stretch text-label-common_3 text-xs font-normal leading-[1.5]">
                서울특별시 강남구 테헤란로 123 IT타워 10층<br />
                이메일 cs@toktok.com
              </div>
            </div>
            
            {/* 오른쪽 열 */}
            <div className="tablet:w-[50%] self-stretch flex-col justify-start items-end gap-[16px] inline-flex">
              <div className="self-stretch justify-start items-center gap-[6px] flex flex-wrap">
                <div className="cursor-pointer">
                  <span className="text-label-common_5 underline leading-[150%] text-inherit text-xs font-semibold">서비스 이용약관</span>
                </div>
                <div className="w-px h-3 bg-divider-common_3"></div>
                <div className="cursor-pointer">
                  <span className="text-label-common_5 underline leading-[150%] text-inherit text-xs font-semibold">개인정보 처리 방침</span>
                </div>
                <div className="w-px h-3 bg-divider-common_3"></div>
                <div className="cursor-pointer">
                  <span className="text-label-common_5 underline leading-[150%] text-inherit text-xs font-semibold">위치기반 서비스 이용약관</span>
                </div>
                <div className="w-px h-3 bg-divider-common_3"></div>
                <div className="cursor-pointer">
                  <span className="text-label-common_5 underline leading-[150%] text-inherit text-xs font-semibold">명예훼손 게시중단 요청</span>
                </div>
              </div>
              
              <div className="self-stretch justify-start items-center gap-4 inline-flex">
                <div className="w-[80px] h-[80px] bg-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-gray-600 text-xs font-medium">ISMS</div>
                </div>
                <div className="grow shrink basis-0">
                  <p className="text-label-common_3 leading-[150%] text-inherit text-xs font-normal">
                    [인증범위] TOKTOK 서비스 운영<br />
                    (심사받지 않은 물리적 인프라 제외)<br />
                    [유효기간] 2024.02.07 ~ 2027.02.06
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-start items-start gap-2">
                <button className="flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[8px] px-[8px] text-[12px] gap-[2px] border-[1.5px] border-outline-common_2 text-label-common_5" style={{ height: "32px" }}>
                  <span className="text-label-common_5 leading-[150%] text-inherit text-xs font-semibold">TOKTOK 알아보기</span>
                  <span className="material-symbols-rounded text-inherit" aria-hidden="true" style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: "16px" }}>
                    arrow_right
                  </span>
                </button>
                <button className="flex flex-none justify-center items-center font-semibold leading-[150%] rounded-[8px] px-[8px] text-[12px] gap-[2px] border-[1.5px] border-outline-common_2 text-label-common_5" style={{ height: "32px" }}>
                  <span className="text-label-common_5 leading-[150%] text-inherit text-xs font-semibold">병원 입점 문의</span>
                  <span className="material-symbols-rounded text-inherit" aria-hidden="true" style={{ fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: "16px" }}>
                    arrow_right
                  </span>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 