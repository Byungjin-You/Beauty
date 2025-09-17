import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';

// 다음 단계 결정 함수
function getNextStep(currentStep) {
  const steps = {
    'basic': 'terms',
    'terms': 'interests', 
    'interests': 'symptoms',
    'symptoms': 'treatment-type',
    'treatment-type': 'recommendations',
    'recommendations': 'completed',
    'completed': null
  };
  return steps[currentStep] || null;
}

export async function POST(request) {
  try {
    await connectDB();

    const { 
      name, 
      email, 
      password, 
      phone, 
      birthDate, 
      gender,
      agreements,
      selectedCategories,
      selectedSymptoms,
      treatmentType,
      selectedTreatments,
      registrationStep = 'basic'
    } = await request.json();

    // 기본 필수 정보 검증
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: '이름, 이메일, 비밀번호는 필수 입력 사항입니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '이미 등록된 이메일입니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 약관 동의 검증 (필수 약관)
    if (agreements && (!agreements.serviceTerms || !agreements.privacyPolicy)) {
      return NextResponse.json(
        { success: false, message: '필수 약관에 동의해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 데이터 구성
    const userData = {
      name,
      email,
      password,
      registrationStep,
      ...(phone && { phone }),
      ...(birthDate && { birthDate: new Date(birthDate) }),
      ...(gender && { gender }),
      ...(agreements && { 
        agreements: {
          ...agreements,
          agreedAt: new Date()
        }
      }),
      ...(selectedCategories && { selectedCategories }),
      ...(selectedSymptoms && { selectedSymptoms }),
      ...(treatmentType && { treatmentType }),
      ...(selectedTreatments && { selectedTreatments }),
      // 모든 단계가 완료된 경우
      isRegistrationCompleted: registrationStep === 'completed'
    };

    const user = await User.create(userData);

    // JWT 토큰 생성
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        name: user.name,
        registrationStep: user.registrationStep
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toJSON();

    return NextResponse.json({
      success: true,
      message: registrationStep === 'completed' 
        ? '회원가입이 완료되었습니다.' 
        : '기본 정보가 저장되었습니다.',
      user: userResponse,
      token,
      nextStep: getNextStep(registrationStep)
    }, { status: 201 });

  } catch (error) {
    console.error('회원가입 오류:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: '이미 등록된 이메일입니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 