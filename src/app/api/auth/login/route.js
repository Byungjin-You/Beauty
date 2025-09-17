import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: '등록되지 않은 이메일입니다.' },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await user.comparePassword(password);
    
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        registrationStep: user.registrationStep,
        isRegistrationCompleted: user.isRegistrationCompleted
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = user.toJSON();

    return NextResponse.json({
      success: true,
      message: '로그인에 성공했습니다.',
      user: userResponse,
      token
    }, { status: 200 });

  } catch (error) {
    console.error('로그인 오류:', error);
    
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 