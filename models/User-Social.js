import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // ==========================================
  // 기본 사용자 정보 (모든 로그인 방식 공통)
  // ==========================================
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // ==========================================
  // 이메일 로그인 전용 필드
  // ==========================================
  password: {
    type: String,
    required: function() {
      return this.accountType === 'email';
    },
    minlength: 6
  },
  
  // ==========================================
  // 계정 타입 및 소셜 로그인 정보
  // ==========================================
  accountType: {
    type: String,
    enum: ['email', 'kakao', 'apple', 'line', 'google'],
    required: true,
    default: 'email'
  },
  
  // 소셜 로그인 계정 정보 (다중 계정 연동 지원)
  socialAccounts: [{
    provider: {
      type: String,
      enum: ['kakao', 'apple', 'line', 'google'],
      required: true
    },
    providerId: {
      type: String,
      required: true
    },
    providerEmail: {
      type: String,
      trim: true
    },
    connectedAt: {
      type: Date,
      default: Date.now
    },
    // 각 소셜 플랫폼별 추가 정보
    providerData: {
      // 카카오: nickname, profile_image_url, gender, birthday, phone_number
      // Apple: firstName, lastName, isPrivateEmail
      // LINE: displayName, pictureUrl, statusMessage
      // Google: firstName, lastName, picture, gender, birthday, locale
      type: mongoose.Schema.Types.Mixed
    }
  }],
  
  // ==========================================
  // 프로필 정보 (통합)
  // ==========================================
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    displayName: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String, // URL
      trim: true
    },
    statusMessage: {
      type: String,
      trim: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say'
    },
    birthDate: {
      type: Date
    },
    phone: {
      type: String,
      trim: true
    },
    locale: {
      type: String,
      default: 'ko-KR'
    }
  },
  
  // ==========================================
  // 앱별 사용자 설정 및 동의 정보
  // ==========================================
  agreements: {
    serviceTerms: { type: Boolean, default: false },
    privacyPolicy: { type: Boolean, default: false },
    marketingConsent: { type: Boolean, default: false },
    thirdPartyConsent: { type: Boolean, default: false },
    agreedAt: { type: Date }
  },
  
  // K-Beauty 앱 전용 필드들
  selectedCategories: [{
    type: String,
    enum: ['face', 'hair', 'skin', 'nose', 'eye', 'forahead', 'mouth', 'chest', 'bodyline', 'yzone', 'waxing', 'teeth', 'etc'],
    trim: true
  }],
  selectedSymptoms: [{
    type: String,
    trim: true
  }],
  treatmentType: {
    type: String,
    enum: ['surgery', 'procedure', 'both'],
    default: 'both'
  },
  selectedTreatments: [{
    treatmentId: { type: String, required: true },
    treatmentName: { type: String, required: true },
    category: { type: String },
    subcategory: { type: String },
    selectedAt: { type: Date, default: Date.now }
  }],
  
  // ==========================================
  // 계정 상태 및 보안
  // ==========================================
  isEmailVerified: {
    type: Boolean,
    default: function() {
      // 소셜 로그인은 기본적으로 이메일 인증됨으로 간주
      return this.accountType !== 'email';
    }
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginHistory: [{
    provider: String,
    loginAt: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String
  }],
  
  // ==========================================
  // 회원가입 과정 관리
  // ==========================================
  registrationStep: {
    type: String,
    enum: ['basic', 'terms', 'interests', 'symptoms', 'treatment-type', 'recommendations', 'completed'],
    default: 'basic'
  },
  isRegistrationCompleted: {
    type: Boolean,
    default: false
  },
  
  // ==========================================
  // 계정 관리
  // ==========================================
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deactivatedAt: {
    type: Date
  },
  
  // ==========================================
  // 메타데이터
  // ==========================================
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { updatedAt: 'updatedAt' }
});

// ==========================================
// 인덱스 설정
// ==========================================
// email 인덱스는 스키마 정의에서 unique: true, index: true로 이미 설정됨
userSchema.index({ 'socialAccounts.provider': 1, 'socialAccounts.providerId': 1 });
userSchema.index({ accountType: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// ==========================================
// 가상 필드 (Virtual Fields)
// ==========================================
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`.trim();
  }
  return this.name || this.profile.displayName || '';
});

// ==========================================
// 인스턴스 메서드
// ==========================================

// 비밀번호 검증 (이메일 로그인용)
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    throw new Error('No password set for social login account');
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// 소셜 계정 추가/업데이트
userSchema.methods.addOrUpdateSocialAccount = function(provider, providerId, providerEmail, providerData) {
  const existingAccount = this.socialAccounts.find(acc => 
    acc.provider === provider && acc.providerId === providerId
  );
  
  if (existingAccount) {
    // 기존 계정 업데이트
    existingAccount.providerEmail = providerEmail;
    existingAccount.providerData = providerData;
    existingAccount.connectedAt = new Date();
  } else {
    // 새 계정 추가
    this.socialAccounts.push({
      provider,
      providerId,
      providerEmail,
      providerData,
      connectedAt: new Date()
    });
  }
};

// 특정 소셜 계정 조회
userSchema.methods.getSocialAccount = function(provider) {
  return this.socialAccounts.find(acc => acc.provider === provider);
};

// 로그인 기록 추가
userSchema.methods.addLoginHistory = function(provider, ipAddress, userAgent) {
  this.loginHistory.unshift({
    provider,
    loginAt: new Date(),
    ipAddress,
    userAgent
  });
  
  // 최근 10개만 유지
  if (this.loginHistory.length > 10) {
    this.loginHistory = this.loginHistory.slice(0, 10);
  }
  
  this.lastLogin = new Date();
};

// 프로필 정보 통합 업데이트 (소셜 로그인 데이터 기반)
userSchema.methods.updateProfileFromSocial = function(provider, socialData) {
  switch (provider) {
    case 'kakao':
      if (socialData.nickname) this.profile.displayName = socialData.nickname;
      if (socialData.profile_image_url) this.profile.profileImage = socialData.profile_image_url;
      if (socialData.gender) this.profile.gender = socialData.gender;
      if (socialData.birthday) this.profile.birthDate = new Date(socialData.birthday);
      if (socialData.phone_number) this.profile.phone = socialData.phone_number;
      break;
      
    case 'apple':
      if (socialData.firstName) this.profile.firstName = socialData.firstName;
      if (socialData.lastName) this.profile.lastName = socialData.lastName;
      if (!this.name && (socialData.firstName || socialData.lastName)) {
        this.name = `${socialData.firstName || ''} ${socialData.lastName || ''}`.trim();
      }
      break;
      
    case 'line':
      if (socialData.displayName) {
        this.profile.displayName = socialData.displayName;
        if (!this.name) this.name = socialData.displayName;
      }
      if (socialData.pictureUrl) this.profile.profileImage = socialData.pictureUrl;
      if (socialData.statusMessage) this.profile.statusMessage = socialData.statusMessage;
      break;
      
    case 'google':
      if (socialData.firstName) this.profile.firstName = socialData.firstName;
      if (socialData.lastName) this.profile.lastName = socialData.lastName;
      if (socialData.picture) this.profile.profileImage = socialData.picture;
      if (socialData.gender) this.profile.gender = socialData.gender;
      if (socialData.birthday) this.profile.birthDate = new Date(socialData.birthday);
      if (socialData.locale) this.profile.locale = socialData.locale;
      if (!this.name && (socialData.firstName || socialData.lastName)) {
        this.name = `${socialData.firstName || ''} ${socialData.lastName || ''}`.trim();
      }
      break;
  }
};

// ==========================================
// 스태틱 메서드
// ==========================================

// 소셜 로그인으로 사용자 찾기 또는 생성
userSchema.statics.findOrCreateSocialUser = async function(provider, providerId, providerEmail, providerData, additionalData = {}) {
  // 1. 소셜 계정으로 기존 사용자 찾기
  let user = await this.findOne({
    'socialAccounts.provider': provider,
    'socialAccounts.providerId': providerId
  });
  
  if (user) {
    // 기존 사용자 - 소셜 계정 정보 업데이트
    user.addOrUpdateSocialAccount(provider, providerId, providerEmail, providerData);
    user.updateProfileFromSocial(provider, providerData);
    await user.save();
    return user;
  }
  
  // 2. 이메일로 기존 사용자 찾기 (계정 연동)
  if (providerEmail) {
    user = await this.findOne({ email: providerEmail });
    if (user) {
      // 기존 이메일 계정에 소셜 계정 연동
      user.addOrUpdateSocialAccount(provider, providerId, providerEmail, providerData);
      user.updateProfileFromSocial(provider, providerData);
      await user.save();
      return user;
    }
  }
  
  // 3. 새 사용자 생성
  const newUserData = {
    email: providerEmail || `${provider}_${providerId}@temp.example.com`,
    name: additionalData.name || providerData.nickname || providerData.displayName || 'User',
    accountType: provider,
    socialAccounts: [{
      provider,
      providerId,
      providerEmail,
      providerData,
      connectedAt: new Date()
    }],
    isEmailVerified: !!providerEmail, // 이메일이 있으면 검증된 것으로 간주
    ...additionalData
  };
  
  user = new this(newUserData);
  user.updateProfileFromSocial(provider, providerData);
  await user.save();
  
  return user;
};

// 이메일로 사용자 찾기 (모든 계정 타입 지원)
userSchema.statics.findByEmail = async function(email) {
  return this.findOne({
    $or: [
      { email: email },
      { 'socialAccounts.providerEmail': email }
    ]
  });
};

// ==========================================
// 미들웨어
// ==========================================

// 비밀번호 해싱 (이메일 회원가입시)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// updatedAt 자동 업데이트
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// ==========================================
// JSON 변환시 민감한 정보 제거
// ==========================================
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.__v;
  
  // 소셜 계정 정보에서 민감한 데이터 제거
  if (userObject.socialAccounts) {
    userObject.socialAccounts = userObject.socialAccounts.map(acc => ({
      provider: acc.provider,
      connectedAt: acc.connectedAt,
      providerEmail: acc.providerEmail
      // providerId와 providerData는 보안상 제외
    }));
  }
  
  return userObject;
};

// 이미 모델이 정의되어 있다면 기존 모델을 사용하고, 없다면 새로 생성
export default mongoose.models.User || mongoose.model('User', userSchema);