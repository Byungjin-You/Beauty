import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../../models/User-Social';
import jwt from 'jsonwebtoken';

/**
 * 소셜 로그인 API 엔드포인트
 * POST /api/auth/social
 * 
 * 지원 플랫폼: 카카오, 애플, 라인, 구글
 */

export async function POST(request) {
  try {
    await connectDB();

    const { 
      provider,           // 'kakao', 'apple', 'line', 'google'
      providerId,         // 소셜 플랫폼의 사용자 ID
      providerEmail,      // 소셜 플랫폼의 이메일 (선택적)
      providerData,       // 소셜 플랫폼별 추가 데이터
      accessToken,        // 소셜 플랫폼의 액세스 토큰 (검증용)
      additionalData      // 추가 사용자 입력 데이터
    } = await request.json();

    // 필수 파라미터 검증
    if (!provider || !providerId) {
      return NextResponse.json({
        success: false,
        message: '필수 파라미터가 누락되었습니다. (provider, providerId)'
      }, { status: 400 });
    }

    // 지원하는 소셜 플랫폼 검증
    const supportedProviders = ['kakao', 'apple', 'line', 'google'];
    if (!supportedProviders.includes(provider)) {
      return NextResponse.json({
        success: false,
        message: `지원하지 않는 소셜 플랫폼입니다. 지원 플랫폼: ${supportedProviders.join(', ')}`
      }, { status: 400 });
    }

    // TODO: 각 소셜 플랫폼별 토큰 검증
    // const isValidToken = await validateSocialToken(provider, accessToken, providerId);
    // if (!isValidToken) {
    //   return NextResponse.json({
    //     success: false,
    //     message: '유효하지 않은 소셜 로그인 토큰입니다.'
    //   }, { status: 401 });
    // }

    // 소셜 플랫폼별 데이터 정규화
    const normalizedData = normalizeSocialData(provider, providerData);
    
    // 소셜 로그인으로 사용자 찾기 또는 생성
    let user = await User.findOrCreateSocialUser(
      provider,
      providerId,
      providerEmail,
      normalizedData,
      additionalData
    );

    // 로그인 기록 추가
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    
    user.addLoginHistory(provider, clientIP, userAgent);
    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountType: user.accountType,
        registrationStep: user.registrationStep,
        isRegistrationCompleted: user.isRegistrationCompleted
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 회원가입 완료 여부에 따른 메시지
    const isNewUser = user.createdAt.getTime() === user.updatedAt.getTime();
    let message = isNewUser ? '소셜 로그인으로 회원가입이 완료되었습니다.' : '소셜 로그인이 완료되었습니다.';
    
    if (!user.isRegistrationCompleted) {
      message += ' 추가 정보 입력을 위해 회원가입 과정을 계속 진행해주세요.';
    }

    return NextResponse.json({
      success: true,
      message,
      token,
      user: user.toJSON(),
      isNewUser,
      nextStep: getNextRegistrationStep(user)
    }, { status: 200 });

  } catch (error) {
    console.error('소셜 로그인 오류:', error);
    
    if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: '이미 등록된 이메일 주소입니다.'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: '소셜 로그인 처리 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

/**
 * 소셜 플랫폼별 데이터 정규화
 */
function normalizeSocialData(provider, rawData) {
  if (!rawData) return {};

  switch (provider) {
    case 'kakao':
      return {
        nickname: rawData.nickname,
        profile_image_url: rawData.profile_image_url,
        gender: rawData.gender,
        birthday: rawData.birthday,
        phone_number: rawData.phone_number,
        age_range: rawData.age_range
      };

    case 'apple':
      return {
        firstName: rawData.firstName,
        lastName: rawData.lastName,
        isPrivateEmail: rawData.isPrivateEmail || false
      };

    case 'line':
      return {
        displayName: rawData.displayName,
        pictureUrl: rawData.pictureUrl,
        statusMessage: rawData.statusMessage
      };

    case 'google':
      return {
        firstName: rawData.given_name || rawData.firstName,
        lastName: rawData.family_name || rawData.lastName,
        picture: rawData.picture,
        gender: rawData.gender,
        birthday: rawData.birthday,
        locale: rawData.locale,
        verified_email: rawData.verified_email
      };

    default:
      return rawData;
  }
}

/**
 * 다음 회원가입 단계 결정
 */
function getNextRegistrationStep(user) {
  if (user.isRegistrationCompleted) {
    return null; // 회원가입 완료
  }

  const steps = {
    'basic': 'terms',
    'terms': 'interests',
    'interests': 'symptoms',
    'symptoms': 'treatment-type',
    'treatment-type': 'recommendations',
    'recommendations': 'completed'
  };

  return steps[user.registrationStep] || 'terms';
}

/**
 * 소셜 플랫폼별 토큰 검증 (향후 구현)
 * TODO: 각 플랫폼의 토큰 검증 API 호출
 */
async function validateSocialToken(provider, accessToken, expectedUserId) {
  switch (provider) {
    case 'kakao':
      // 카카오 사용자 정보 조회 API 호출
      // return await validateKakaoToken(accessToken, expectedUserId);
      break;
      
    case 'apple':
      // Apple ID 토큰 검증
      // return await validateAppleIdToken(accessToken, expectedUserId);
      break;
      
    case 'line':
      // LINE 프로필 조회 API 호출
      // return await validateLineToken(accessToken, expectedUserId);
      break;
      
    case 'google':
      // Google 사용자 정보 조회 API 호출
      // return await validateGoogleToken(accessToken, expectedUserId);
      break;
      
    default:
      return false;
  }
  
  // 임시로 true 반환 (개발용)
  return true;
}

// TODO: 각 플랫폼별 토큰 검증 함수들 구현
/*
async function validateKakaoToken(accessToken, expectedUserId) {
  try {
    const response = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) return false;
    
    const userData = await response.json();
    return userData.id.toString() === expectedUserId;
  } catch (error) {
    console.error('카카오 토큰 검증 오류:', error);
    return false;
  }
}

async function validateAppleIdToken(idToken, expectedUserId) {
  // Apple ID 토큰은 JWT 형태로, 공개키로 검증 필요
  // 구현 복잡도가 높아 별도 라이브러리 사용 권장
  return true; // 임시
}

async function validateLineToken(accessToken, expectedUserId) {
  try {
    const response = await fetch('https://api.line.me/v2/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) return false;
    
    const userData = await response.json();
    return userData.userId === expectedUserId;
  } catch (error) {
    console.error('LINE 토큰 검증 오류:', error);
    return false;
  }
}

async function validateGoogleToken(accessToken, expectedUserId) {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    
    if (!response.ok) return false;
    
    const userData = await response.json();
    return userData.id === expectedUserId;
  } catch (error) {
    console.error('Google 토큰 검증 오류:', error);
    return false;
  }
}
*/