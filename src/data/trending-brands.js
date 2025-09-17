// 요즘 뜨는 브랜드 데이터
export const trendingBrands = [
  {
    id: 1,
    rank: 1,
    brandName: "토리든",
    brandImage: "/images/brand-torriden.jpg",
    rankChange: null,
    products: [
      {
        id: "product-1",
        name: "다이브인 저분자 히알루론산 세럼",
        brand: "토리든",
        image: "/images/trending-brand-product-1.jpg",
        rating: 4.59,
        reviewCount: 65032,
        link: "/products/1"
      },
      {
        id: "product-2",
        name: "다이브인 저분자 히알루론산 수딩 크림",
        brand: "토리든",
        image: "/images/trending-brand-product-2.jpg",
        rating: 4.66,
        reviewCount: 20408,
        link: "/products/2"
      },
      {
        id: "product-3",
        name: "다이브인 저분자 히알루론산 토너",
        brand: "토리든",
        image: "/images/trending-brand-product-3.jpg",
        rating: 4.68,
        reviewCount: 27480,
        link: "/products/3"
      }
    ]
  },
  {
    id: 2,
    rank: 2,
    brandName: "에스네이처",
    brandImage: "/images/brand-snature.jpg",
    rankChange: null,
    products: [
      {
        id: "product-4",
        name: "아쿠아 오아시스 토너",
        brand: "에스네이처",
        image: "/images/trending-brand-product-4.jpg",
        rating: 4.73,
        reviewCount: 19488,
        link: "/products/4"
      },
      {
        id: "product-5",
        name: "아쿠아 스쿠알란 수분크림",
        brand: "에스네이처",
        image: "/images/trending-brand-product-5.jpg",
        rating: 4.55,
        reviewCount: 33157,
        link: "/products/5"
      },
      {
        id: "product-6",
        name: "아쿠아 스쿠알란 세럼",
        brand: "에스네이처",
        image: "/images/trending-brand-product-6.jpg",
        rating: 4.70,
        reviewCount: 8695,
        link: "/products/6"
      }
    ]
  },
  {
    id: 3,
    rank: 3,
    brandName: "아누아",
    brandImage: "/images/brand-anua.jpg",
    rankChange: { type: 'up', value: 2 },
    products: [
      {
        id: "product-7",
        name: "PDRN 히알루론산 캡슐 100 세럼",
        brand: "아누아",
        image: "/images/trending-brand-product-7.jpg",
        rating: 4.60,
        reviewCount: 6034,
        link: "/products/7"
      },
      {
        id: "product-8",
        name: "PDRN 히알루론산 100 수분 크림",
        brand: "아누아",
        image: "/images/trending-brand-product-8.jpg",
        rating: 4.63,
        reviewCount: 2189,
        link: "/products/8"
      },
      {
        id: "product-9",
        name: "어성초 77 수딩 토너",
        brand: "아누아",
        image: "/images/trending-brand-product-9.jpg",
        rating: 4.49,
        reviewCount: 1245,
        link: "/products/9"
      }
    ]
  }
];
