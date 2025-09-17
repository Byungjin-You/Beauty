// 어드민 랭킹 관리용 데이터
export const adminRankings = {
  trending: [
    {
      id: 1,
      rank: 1,
      image: "/images/product-1.jpg",
      brand: "토리든",
      name: "다이브인 저분자 히알루론산 세럼",
      rating: 4.59,
      reviewCount: 65032,
      category: "세럼",
      rankChange: { type: 'up', value: 2 }
    },
    {
      id: 2,
      rank: 2,
      image: "/images/product-2.jpg",
      brand: "라운드랩",
      name: "1025 독도 토너",
      rating: 4.43,
      reviewCount: 90343,
      category: "토너",
      rankChange: { type: 'down', value: 1 }
    },
    // ... 더 많은 제품들 (100개까지 확장 가능)
  ],
  category: [
    {
      id: 1,
      rank: 1,
      image: "/images/product-1.jpg",
      brand: "토리든",
      name: "다이브인 저분자 히알루론산 세럼",
      rating: 4.59,
      reviewCount: 65032,
      category: "세럼"
    },
    // ... 카테고리별 랭킹
  ],
  skinType: [
    {
      id: 1,
      rank: 1,
      image: "/images/skin-product-1.jpg",
      brand: "아누아",
      name: "PDRN 히알루론산 캡슐 100 세럼",
      rating: 4.60,
      reviewCount: 6034,
      skinType: "건성"
    },
    // ... 피부 타입별 랭킹
  ],
  age: [
    {
      id: 1,
      rank: 1,
      image: "/images/product-1.jpg",
      brand: "토리든",
      name: "다이브인 저분자 히알루론산 세럼",
      rating: 4.59,
      reviewCount: 65032,
      ageGroup: "10대"
    },
    // ... 연령대별 랭킹
  ],
  brand: [
    {
      id: 1,
      rank: 1,
      brandImage: "/images/brand-torriden.jpg",
      brandName: "토리든",
      productCount: 15,
      avgRating: 4.62,
      totalReviews: 250000
    },
    {
      id: 2,
      rank: 2,
      brandImage: "/images/brand-snature.jpg",
      brandName: "에스네이처",
      productCount: 12,
      avgRating: 4.58,
      totalReviews: 180000
    },
    // ... 브랜드별 랭킹
  ]
};

// 탭 정의
export const rankingTabs = [
  { 
    id: 'trending', 
    label: '급상승', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  { 
    id: 'category', 
    label: '카테고리별', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  },
  { 
    id: 'skinType', 
    label: '피부별', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  { 
    id: 'age', 
    label: '연령대별', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    id: 'brand', 
    label: '브랜드', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    )
  }
];
