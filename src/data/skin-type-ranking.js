// 피부 타입별 제품 랭킹 데이터
export const skinTypeRanking = [
  {
    id: 1,
    rank: 1,
    image: "/images/skin-product-1.jpg",
    brand: "아누아",
    name: "PDRN 히알루론산 캡슐 100 세럼",
    rating: 4.60,
    reviewCount: 6034,
    link: "/products/1"
  },
  {
    id: 2,
    rank: 2,
    image: "/images/skin-product-2.jpg",
    brand: "토리든",
    name: "다이브인 저분자 히알루론산 세럼",
    rating: 4.59,
    reviewCount: 65032,
    link: "/products/2"
  },
  {
    id: 3,
    rank: 3,
    image: "/images/skin-product-3.jpg",
    brand: "웰라쥬",
    name: "리얼 히알루로닉 블루 100 앰플",
    rating: 4.62,
    reviewCount: 21397,
    link: "/products/3"
  },
  {
    id: 4,
    rank: 4,
    image: "/images/skin-product-4.jpg",
    brand: "에스트라",
    name: "아토베리어365 크림",
    rating: 4.66,
    reviewCount: 9582,
    link: "/products/4"
  },
  {
    id: 5,
    rank: 5,
    image: "/images/skin-product-5.jpg",
    brand: "토니모리",
    name: "원더 세라마이드 모찌 토너",
    rating: 4.48,
    reviewCount: 14391,
    link: "/products/5"
  },
  {
    id: 6,
    rank: 6,
    image: "/images/skin-product-6.jpg",
    brand: "에스네이처",
    name: "아쿠아 오아시스 토너",
    rating: 4.73,
    reviewCount: 19488,
    link: "/products/6"
  },
  {
    id: 7,
    rank: 7,
    image: "/images/skin-product-7.jpg",
    brand: "에스네이처",
    name: "아쿠아 스쿠알란 수분크림",
    rating: 4.55,
    reviewCount: 33157,
    link: "/products/7"
  },
  {
    id: 8,
    rank: 8,
    image: "/images/skin-product-8.jpg",
    brand: "린제이",
    name: "모델링마스크 컵팩 [쿨티트리]",
    rating: 4.74,
    reviewCount: 18845,
    link: "/products/8"
  },
  {
    id: 9,
    rank: 9,
    image: "/images/skin-product-9.jpg",
    brand: "라운드랩",
    name: "1025 독도 토너",
    rating: 4.43,
    reviewCount: 90343,
    link: "/products/9"
  }
];

// 피부 타입 옵션들
export const skinTypes = [
  { id: 'dry', label: '건성', isDefault: true },
  { id: 'oily', label: '지성', isDefault: false },
  { id: 'normal', label: '중성', isDefault: false },
  { id: 'combination', label: '복합성', isDefault: false },
  { id: 'sensitive', label: '민감성', isDefault: false },
  { id: 'acne', label: '여드름', isDefault: false },
  { id: 'atopic', label: '아토피', isDefault: false }
];
