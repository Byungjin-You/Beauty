import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();

    const { 
      token,
      selectedCategories,
      selectedSymptoms,
      treatmentType,
      selectedTreatments
    } = await request.json();

    // JWT 토큰 검증
    if (!token) {
      return NextResponse.json(
        { success: false, message: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // 사용자 찾기
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 관심 시술 정보 업데이트
    const updateData = {};
    
    if (selectedCategories) {
      updateData.selectedCategories = selectedCategories;
    }
    
    if (selectedSymptoms) {
      updateData.selectedSymptoms = selectedSymptoms;
    }
    
    if (treatmentType) {
      updateData.treatmentType = treatmentType;
    }
    
    if (selectedTreatments) {
      updateData.selectedTreatments = selectedTreatments;
    }

    // 사용자 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    const userResponse = updatedUser.toJSON();

    return NextResponse.json({
      success: true,
      message: '관심 시술 정보가 업데이트되었습니다.',
      user: userResponse
    }, { status: 200 });

  } catch (error) {
    console.error('관심 시술 업데이트 오류:', error);
    
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