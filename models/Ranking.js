import mongoose from 'mongoose';

const RankingSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['trending', 'category', 'skinType', 'age', 'brand'],
    index: true
  },
  themeId: {
    type: String,
    required: false, // 기존 데이터 호환성을 위해 false로 변경
    index: true
  },
  rank: {
    type: Number,
    required: true,
    min: 1,
    max: 200 // 최대값 증가
  },
  productId: {
    type: String,
    sparse: true // 브랜드 랭킹에는 없을 수 있음
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    required: true,
    min: 0
  },
  price: {
    type: String,
    trim: true
  },
  volume: {
    type: String,
    trim: true
  },
  rankChange: {
    type: {
      type: String,
      enum: ['up', 'down', 'new']
    },
    value: {
      type: Number,
      min: 1
    }
  },
  link: {
    type: String,
    trim: true
  },
  // 상세 페이지 정보
  brandLogo: {
    type: String,
    trim: true
  },
  categoryRanking: {
    type: String,
    trim: true
  },
  awards: [{
    title: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  aiAnalysis: {
    pros: [{
      name: String,
      count: Number
    }],
    cons: [{
      name: String,
      count: Number
    }]
  },
  ingredients: {
    total: Number,
    lowRisk: Number,
    mediumRisk: Number,
    highRisk: Number,
    undetermined: Number,
    avoidIngredients: Number,
    antiWrinkle: Number,
    brightening: Number,
    // Enhanced 크롤링 필드들
    fullIngredientsList: [String],
    purposeBasedIngredients: {
      type: Map,
      of: Number
    },
    componentStats: {
      total: Number,
      lowRisk: Number,
      mediumRisk: Number,
      highRisk: Number,
      undetermined: Number
    },
    qualityMetrics: {
      hasEnhancedData: Boolean,
      ingredientCount: Number,
      purposeCount: Number,
      dataCompleteness: Number
    },
    // 성분 분석 정보
    ingredientAnalysis: {
      allergyIngredients: mongoose.Schema.Types.Mixed, // "Free" 또는 Number
      antiAgingIngredients: Number,
      brighteningIngredients: Number,
      cautionIngredients: {
        total: Number,
        present: Number
      }
    }
  },
  skinTypeAnalysis: {
    oily: {
      good: Number,
      bad: Number
    },
    dry: {
      good: Number,
      bad: Number
    },
    sensitive: {
      good: Number,
      bad: Number
    }
  },
  // 브랜드 랭킹용 추가 필드들
  productCount: {
    type: Number,
    min: 0
  },
  avgRating: {
    type: Number,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    min: 0
  },
  // 크롤링 메타데이터
  crawlingMetadata: {
    timestamp: String,
    source: String,
    version: String,
    enhancedFeaturesEnabled: Boolean
  },
  // 메타 정보
  crawledAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'rankings'
});

// 복합 인덱스 생성 (themeId 기반)
RankingSchema.index({ themeId: 1, rank: 1 }, { unique: true });
RankingSchema.index({ category: 1, crawledAt: -1 });
RankingSchema.index({ themeId: 1, crawledAt: -1 });
RankingSchema.index({ brand: 1, category: 1 });

// 카테고리별 최신 랭킹 조회 메서드
RankingSchema.statics.getLatestRankings = async function(category, limit = 100) {
  return this.find({ 
    category, 
    isActive: true 
  })
  .sort({ rank: 1 })
  .limit(limit)
  .lean();
};

// 브랜드별 제품 수 업데이트 메서드
RankingSchema.statics.updateBrandStats = async function(brandName) {
  const products = await this.find({ brand: brandName, category: { $ne: 'brand' } });
  const avgRating = products.reduce((sum, product) => sum + product.rating, 0) / products.length;
  const totalReviews = products.reduce((sum, product) => sum + product.reviewCount, 0);
  
  await this.updateMany(
    { brand: brandName, category: 'brand' },
    {
      productCount: products.length,
      avgRating: parseFloat(avgRating.toFixed(2)),
      totalReviews
    }
  );
};

// 이전 랭킹과 비교하여 변동 계산 메서드
RankingSchema.statics.calculateRankChanges = async function(category, newRankings) {
  const previousRankings = await this.find({ 
    category, 
    crawledAt: { $lt: new Date() }
  }).sort({ crawledAt: -1 }).limit(100);

  const previousRankMap = new Map();
  previousRankings.forEach(item => {
    previousRankMap.set(`${item.brand}-${item.name}`, item.rank);
  });

  return newRankings.map(newItem => {
    const key = `${newItem.brand}-${newItem.name}`;
    const previousRank = previousRankMap.get(key);
    
    if (previousRank && previousRank !== newItem.rank) {
      const change = previousRank - newItem.rank;
      return {
        ...newItem,
        rankChange: {
          type: change > 0 ? 'up' : 'down',
          value: Math.abs(change)
        }
      };
    }
    
    return newItem;
  });
};

// JSON 변환 시 불필요한 필드 제거
RankingSchema.methods.toJSON = function() {
  const rankingObject = this.toObject();
  delete rankingObject.__v;
  return rankingObject;
};

// 이미 모델이 정의되어 있다면 기존 모델을 사용하고, 없다면 새로 생성
export default mongoose.models.Ranking || mongoose.model('Ranking', RankingSchema);
