import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '이름을 입력해주세요'],
    trim: true,
    maxlength: [50, '이름은 50자 이하로 입력해주세요']
  },
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      '올바른 이메일 형식을 입력해주세요'
    ]
  },
  password: {
    type: String,
    required: [true, '비밀번호를 입력해주세요'],
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다'],
    select: false // 기본적으로 비밀번호는 조회되지 않도록 설정
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9-+().\s]+$/, '올바른 전화번호 형식을 입력해주세요']
  },
  birthDate: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  interests: [{
    type: String,
    trim: true
  }], // 관심 시술들
  
  // K-Beauty 회원가입 관련 필드들
  agreements: {
    serviceTerms: { type: Boolean, default: false }, // 서비스 이용약관
    privacyPolicy: { type: Boolean, default: false }, // 개인정보 처리방침
    marketingConsent: { type: Boolean, default: false }, // 마케팅 수신 동의
    thirdPartyConsent: { type: Boolean, default: false }, // 제3자 정보 제공 동의
    agreedAt: { type: Date }
  },
  
  // 선택한 관심 부위/카테고리
  selectedCategories: [{
    type: String,
    enum: ['face', 'hair', 'skin', 'nose', 'eye', 'forahead', 'mouth', 'chest', 'bodyline', 'yzone', 'waxing', 'teeth', 'etc'],
    trim: true
  }],
  
  // 선택한 증상들
  selectedSymptoms: [{
    type: String,
    trim: true
  }],
  
  // 치료 유형 선호도
  treatmentType: {
    type: String,
    enum: ['surgery', 'procedure', 'both'], // 수술, 시술, 둘 다
    default: 'both'
  },
  
  // 선택한 추천 시술들
  selectedTreatments: [{
    treatmentId: { type: String },
    treatmentName: { type: String },
    category: { type: String },
    subcategory: { type: String },
    selectedAt: { type: Date, default: Date.now }
  }],
  
  // 회원가입 진행 단계
  registrationStep: {
    type: String,
    enum: ['basic', 'terms', 'interests', 'symptoms', 'treatment-type', 'recommendations', 'completed'],
    default: 'basic'
  },
  
  // 회원가입 완료 여부
  isRegistrationCompleted: {
    type: Boolean,
    default: false
  },
  
  avatar: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true // createdAt, updatedAt 자동 생성
});

// 비밀번호 저장 전 해싱
UserSchema.pre('save', async function(next) {
  // 비밀번호가 수정되지 않았다면 다음으로 진행
  if (!this.isModified('password')) {
    next();
  }

  // 비밀번호 해싱
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 비교 메서드
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JSON으로 변환 시 비밀번호 제거
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  return userObject;
};

// 이미 모델이 정의되어 있다면 기존 모델을 사용하고, 없다면 새로 생성
export default mongoose.models.User || mongoose.model('User', UserSchema); 