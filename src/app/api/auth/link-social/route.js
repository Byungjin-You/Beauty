import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import User from '../../../../../models/User-Social';
import jwt from 'jsonwebtoken';

/**
 * 소셜 계정 연동 API 엔드포인트
 * POST /api/auth/link-social
 * 
 * 기존 계정에 소셜 계정을 연동합니다.
 */

export async function POST(request) {
  try {
    await connectDB();

    // 인증 토큰 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: '인증 토큰이 필요합니다.'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      }, { status: 401 });
    }

    const {
      provider,           // 연동할 소셜 플랫폼
      providerId,         // 소셜 플랫폼의 사용자 ID
      providerEmail,      // 소셜 플랫폼의 이메일
      providerData,       // 소셜 플랫폼별 데이터
      accessToken         // 검증용 토큰
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

    // 현재 사용자 조회
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // 이미 연동된 소셜 계정인지 확인
    const existingSocialAccount = currentUser.getSocialAccount(provider);
    if (existingSocialAccount) {
      return NextResponse.json({
        success: false,
        message: `이미 ${provider} 계정이 연동되어 있습니다.`
      }, { status: 409 });
    }

    // 다른 사용자가 같은 소셜 계정을 사용하고 있는지 확인
    const existingUserWithSocial = await User.findOne({
      'socialAccounts.provider': provider,
      'socialAccounts.providerId': providerId,
      '_id': { $ne: currentUser._id }
    });

    if (existingUserWithSocial) {
      return NextResponse.json({
        success: false,
        message: `해당 ${provider} 계정은 이미 다른 사용자에게 연동되어 있습니다.`
      }, { status: 409 });
    }

    // TODO: 소셜 토큰 검증
    // const isValidToken = await validateSocialToken(provider, accessToken, providerId);
    // if (!isValidToken) {
    //   return NextResponse.json({
    //     success: false,
    //     message: '유효하지 않은 소셜 로그인 토큰입니다.'
    //   }, { status: 401 });
    // }

    // 소셜 계정 연동
    const normalizedData = normalizeSocialData(provider, providerData);
    currentUser.addOrUpdateSocialAccount(provider, providerId, providerEmail, normalizedData);
    
    // 소셜 데이터로 프로필 정보 업데이트 (기존 정보를 덮어쓰지 않고 보완)
    updateProfileSafely(currentUser, provider, normalizedData);
    
    await currentUser.save();

    // 새로운 JWT 토큰 생성 (필요시)
    const newToken = jwt.sign(
      {
        id: currentUser._id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role,
        accountType: currentUser.accountType,
        registrationStep: currentUser.registrationStep,
        isRegistrationCompleted: currentUser.isRegistrationCompleted
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: `${provider} 계정이 성공적으로 연동되었습니다.`,
      user: currentUser.toJSON(),
      token: newToken
    }, { status: 200 });

  } catch (error) {
    console.error('소셜 계정 연동 오류:', error);
    return NextResponse.json({
      success: false,
      message: '소셜 계정 연동 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

/**
 * 소셜 계정 연동 해제 API
 * DELETE /api/auth/link-social
 */
export async function DELETE(request) {
  try {
    await connectDB();

    // 인증 토큰 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: '인증 토큰이 필요합니다.'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      }, { status: 401 });
    }

    const { provider } = await request.json();

    if (!provider) {
      return NextResponse.json({
        success: false,
        message: '연동 해제할 소셜 플랫폼을 지정해주세요.'
      }, { status: 400 });
    }

    // 현재 사용자 조회
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // 연동된 소셜 계정 확인
    const socialAccountIndex = currentUser.socialAccounts.findIndex(
      account => account.provider === provider
    );

    if (socialAccountIndex === -1) {
      return NextResponse.json({
        success: false,
        message: `연동된 ${provider} 계정이 없습니다.`
      }, { status: 404 });
    }

    // 소셜 계정이 주 계정인 경우 연동 해제 제한
    if (currentUser.accountType === provider) {
      // 다른 인증 방법이 없는 경우 연동 해제 금지
      const hasPassword = !!currentUser.password;
      const hasOtherSocialAccounts = currentUser.socialAccounts.length > 1;
      
      if (!hasPassword && !hasOtherSocialAccounts) {
        return NextResponse.json({
          success: false,
          message: '주 로그인 방법입니다. 다른 로그인 방법을 먼저 설정해주세요.'
        }, { status: 409 });
      }
    }

    // 소셜 계정 연동 해제
    currentUser.socialAccounts.splice(socialAccountIndex, 1);
    await currentUser.save();

    return NextResponse.json({
      success: true,
      message: `${provider} 계정 연동이 해제되었습니다.`,
      user: currentUser.toJSON()
    }, { status: 200 });

  } catch (error) {
    console.error('소셜 계정 연동 해제 오류:', error);
    return NextResponse.json({
      success: false,
      message: '소셜 계정 연동 해제 중 오류가 발생했습니다.'
    }, { status: 500 });
  }
}

/**
 * 연동된 소셜 계정 목록 조회 API
 * GET /api/auth/link-social
 */
export async function GET(request) {
  try {
    await connectDB();

    // 인증 토큰 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: '인증 토큰이 필요합니다.'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return NextResponse.json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      }, { status: 401 });
    }

    // 현재 사용자 조회
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return NextResponse.json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      }, { status: 404 });
    }

    // 연동된 소셜 계정 정보 (보안 정보 제외)
    const linkedAccounts = currentUser.socialAccounts.map(account => ({
      provider: account.provider,
      providerEmail: account.providerEmail,
      connectedAt: account.connectedAt,
      canUnlink: currentUser.accountType !== account.provider || 
                 currentUser.socialAccounts.length > 1 || 
                 !!currentUser.password
    }));

    return NextResponse.json({
      success: true,
      accountType: currentUser.accountType,
      hasPassword: !!currentUser.password,
      linkedAccounts,
      availableProviders: ['kakao', 'apple', 'line', 'google']
    }, { status: 200 });

  } catch (error) {
    console.error('연동된 소셜 계정 조회 오류:', error);
    return NextResponse.json({
      success: false,
      message: '연동된 소셜 계정 조회 중 오류가 발생했습니다.'
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
        phone_number: rawData.phone_number
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
        locale: rawData.locale
      };

    default:
      return rawData;
  }
}

/**
 * 기존 프로필 정보를 보존하면서 안전하게 업데이트
 */
function updateProfileSafely(user, provider, socialData) {
  if (!user.profile) user.profile = {};

  switch (provider) {
    case 'kakao':
      if (!user.profile.displayName && socialData.nickname) {
        user.profile.displayName = socialData.nickname;
      }
      if (!user.profile.profileImage && socialData.profile_image_url) {
        user.profile.profileImage = socialData.profile_image_url;
      }
      if (!user.profile.gender && socialData.gender) {
        user.profile.gender = socialData.gender;
      }
      if (!user.profile.birthDate && socialData.birthday) {
        user.profile.birthDate = new Date(socialData.birthday);
      }
      if (!user.profile.phone && socialData.phone_number) {
        user.profile.phone = socialData.phone_number;
      }
      break;

    case 'apple':
      if (!user.profile.firstName && socialData.firstName) {
        user.profile.firstName = socialData.firstName;
      }
      if (!user.profile.lastName && socialData.lastName) {
        user.profile.lastName = socialData.lastName;
      }
      break;

    case 'line':
      if (!user.profile.displayName && socialData.displayName) {
        user.profile.displayName = socialData.displayName;
      }
      if (!user.profile.profileImage && socialData.pictureUrl) {
        user.profile.profileImage = socialData.pictureUrl;
      }
      if (!user.profile.statusMessage && socialData.statusMessage) {
        user.profile.statusMessage = socialData.statusMessage;
      }
      break;

    case 'google':
      if (!user.profile.firstName && socialData.firstName) {
        user.profile.firstName = socialData.firstName;
      }
      if (!user.profile.lastName && socialData.lastName) {
        user.profile.lastName = socialData.lastName;
      }
      if (!user.profile.profileImage && socialData.picture) {
        user.profile.profileImage = socialData.picture;
      }
      if (!user.profile.locale && socialData.locale) {
        user.profile.locale = socialData.locale;
      }
      break;
  }
}