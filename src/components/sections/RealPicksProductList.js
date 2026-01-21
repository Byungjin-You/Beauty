"use client";

import { useState, useEffect } from "react";

const RealPicksProductList = ({ categoryId, subcategoryId }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 카테고리 ID에 따른 themeId 매핑
  const categoryThemeMap = {
    skincare: "5104",
    skincare_all: "5104",
    skincare_toner: "5106",
    skincare_lotion: "5116",
    skincare_essence: "5126",
    skincare_face_oil: "5136",
    skincare_cream: "5138",
    skincare_eye_care: "5148",
    skincare_mist: "5150",
    skincare_gel: "5156",
    skincare_toner_pad: "5158",
    skincare_balm: "5168",
    cleansing: "5178",
    cleansing_all: "5178",
    cleansing_foam: "5180",
    cleansing_oil: "5194",
    cleansing_balm: "5221",
    mask: "5223",
    mask_all: "5223",
    mask_sheet: "5225",
    mask_wash_off: "5245",
    mask_sleeping: "5265",
    suncare: "5297",
    suncare_all: "5297",
    suncare_cream: "5299",
    suncare_stick: "5323",
    base_makeup: "5339",
    base_all: "5339",
    base_foundation: "5359",
    base_cushion: "5366",
    base_concealer: "5378",
    eye_makeup: "5414",
    eye_all: "5414",
    eye_shadow: "5416",
    eye_liner: "5423",
    eye_mascara: "5437",
    lip_makeup: "5446",
    lip_all: "5446",
    lip_stick: "5448",
    lip_tint: "5454",
    all: "5102",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const themeId = categoryThemeMap[subcategoryId] || categoryThemeMap[categoryId] || "5102";
        const response = await fetch(`/api/admin/rankings?themeId=${themeId}&limit=5`);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
          setProducts(result.data.slice(0, 5));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("제품 데이터 로드 실패:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, subcategoryId]);

  if (isLoading) {
    return (
      <div className="mt-[16px]">
        <div className="space-y-[12px]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-[16px] animate-pulse py-[10px]">
              <div className="w-[140px] h-[140px] bg-gray-200 rounded-[12px]"></div>
              <div className="flex-1 space-y-[10px]">
                <div className="h-[16px] bg-gray-200 rounded w-3/4"></div>
                <div className="h-[14px] bg-gray-200 rounded w-1/2"></div>
                <div className="h-[14px] bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mt-[16px] py-[40px] text-center">
        <p className="text-gray-400 text-[14px]">해당 카테고리의 제품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mt-[16px]">
      <div className="space-y-[12px]">
        {products.map((product, index) => (
          <a
            key={product.id || index}
            href={product.link || "#"}
            className="flex items-start gap-[16px] py-[10px] hover:bg-gray-50 rounded-[12px] transition-colors"
          >
            {/* 제품 이미지 - 화면의 반 정도 차지 */}
            <div className="flex-shrink-0">
              <div className="w-[140px] h-[140px] rounded-[12px] overflow-hidden bg-white" style={{ border: '1px solid #f5f5f5' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.png";
                  }}
                />
              </div>
            </div>

            {/* 제품 정보 */}
            <div className="flex-1 min-w-0 space-y-[4px]">
              {/* 브랜드명 + 제품명 */}
              <div className="leading-normal text-ellipsis block line-clamp-2">
                <span className="text-[14px] text-label-common_4 font-medium">
                  {product.brand}
                </span>
                <span className="text-[14px] text-label-common_5 font-medium ml-[8px]">
                  {product.name}
                </span>
              </div>

              {/* 별점 + 리뷰 수 */}
              <div className="flex items-center gap-[2px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" className="text-yellow-400">
                  <path fill="currentColor" d="M17.712 21.992c-.12 0-.25-.03-.36-.09l-5.347-2.958-5.347 2.959a.75.75 0 0 1-.79-.04.761.761 0 0 1-.31-.74l1.03-6.328-4.378-4.478c-.2-.2-.26-.5-.17-.76.09-.27.32-.46.6-.5l5.997-.92L11.315 2.4c.25-.53 1.11-.53 1.36 0l2.688 5.738 5.997.92c.28.04.51.24.6.5.09.269.02.559-.17.759l-4.358 4.478 1.03 6.328a.76.76 0 0 1-.74.88z"/>
                </svg>
                <span className="text-[12px] text-label-common_4">
                  {product.rating?.toFixed(2) || "0.00"}
                </span>
                <span className="text-[11px] text-label-common_3">
                  ({product.reviewCount?.toLocaleString() || 0})
                </span>
              </div>

              {/* 가격 / 용량 */}
              <div className="flex items-center gap-[6px]">
                {product.price && (
                  <span className="text-[14px] text-label-common_5 font-medium">{product.price}</span>
                )}
                {product.volume && (
                  <>
                    <span className="text-[12px] text-label-common_3">/</span>
                    <span className="text-[12px] text-label-common_3">{product.volume}</span>
                  </>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* 전체보기 버튼 */}
      <div className="mt-[16px]">
        <button
          className="inline-flex justify-center items-center appearance-none px-[16px] h-[44px] rounded-[8px] text-[14px] font-medium border border-outline-common_2 bg-white hover:bg-container-common_2 active:bg-container-common_2 text-label-common_5 w-full transition-colors duration-200"
          onClick={() => window.location.href = '/ranking'}
        >
          더 많은 제품보기
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" className="ml-[8px]">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RealPicksProductList;
