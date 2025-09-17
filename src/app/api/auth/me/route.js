import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: user.toJSON()
      }, { status: 200 });

    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('사용자 정보 조회 오류:', error);
    
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: '인증 토큰이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const { 
        name, 
        phone, 
        birthDate, 
        gender, 
        interests,
        selectedCategories,
        selectedSymptoms,
        treatmentType,
        selectedTreatments,
        agreements
      } = await request.json();
      
      const updateData = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (birthDate) updateData.birthDate = new Date(birthDate);
      if (gender) updateData.gender = gender;
      if (interests) updateData.interests = interests;
      if (selectedCategories) updateData.selectedCategories = selectedCategories;
      if (selectedSymptoms) updateData.selectedSymptoms = selectedSymptoms;
      if (treatmentType) updateData.treatmentType = treatmentType;
      if (selectedTreatments) updateData.selectedTreatments = selectedTreatments;
      if (agreements) updateData.agreements = agreements;

      const user = await User.findByIdAndUpdate(
        decoded.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: '사용자를 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '사용자 정보가 업데이트되었습니다.',
        user: user.toJSON()
      }, { status: 200 });

    } catch (jwtError) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('사용자 정보 업데이트 오류:', error);
    
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 