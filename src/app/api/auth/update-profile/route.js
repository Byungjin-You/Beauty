import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';

// JWT 토큰 검증 함수
function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

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

    // JWT 토큰 검증
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const { 
      agreements,
      selectedCategories,
      selectedSymptoms,
      treatmentType,
      selectedTreatments,
      registrationStep,
      phone,
      birthDate,
      gender
    } = await request.json();

    // 사용자 찾기
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 업데이트할 데이터 구성
    const updateData = {};

    // 기본 정보 업데이트
    if (phone !== undefined) updateData.phone = phone;
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null;
    if (gender !== undefined) updateData.gender = gender;

    // 약관 동의 업데이트
    if (agreements) {
      // 필수 약관 검증
      if (agreements.serviceTerms === false || agreements.privacyPolicy === false) {
        return NextResponse.json(
          { success: false, message: '필수 약관에 동의해주세요.' },
          { status: 400 }
        );
      }
      
      updateData.agreements = {
        ...user.agreements,
        ...agreements,
        agreedAt: new Date()
      };
    }

    // K-Beauty 관련 정보 업데이트
    if (selectedCategories !== undefined) updateData.selectedCategories = selectedCategories;
    if (selectedSymptoms !== undefined) updateData.selectedSymptoms = selectedSymptoms;
    if (treatmentType !== undefined) updateData.treatmentType = treatmentType;
    if (selectedTreatments !== undefined) updateData.selectedTreatments = selectedTreatments;

    // 회원가입 단계 업데이트
    if (registrationStep !== undefined) {
      updateData.registrationStep = registrationStep;
      updateData.isRegistrationCompleted = registrationStep === 'completed';
    }

    // 사용자 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true, runValidators: true }
    );

    const userResponse = updatedUser.toJSON();

    return NextResponse.json({
      success: true,
      message: registrationStep === 'completed' 
        ? '회원가입이 완료되었습니다!' 
        : '정보가 업데이트되었습니다.',
      user: userResponse,
      nextStep: getNextStep(registrationStep || user.registrationStep)
    }, { status: 200 });

  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 사용자 정보 조회
export async function GET(request) {
  try {
    await connectDB();

    // JWT 토큰 검증
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자 정보 조회
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const userResponse = user.toJSON();

    return NextResponse.json({
      success: true,
      user: userResponse,
      nextStep: getNextStep(user.registrationStep)
    }, { status: 200 });

  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}