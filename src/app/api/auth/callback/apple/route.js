import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Apple Sign-In Callback API
 * POST /api/auth/callback/apple
 * 
 * Apple에서 authorization code를 받아 처리
 */

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Apple에서 전송된 데이터 추출
    const code = formData.get('code');
    const state = formData.get('state');
    const id_token = formData.get('id_token');
    const user = formData.get('user');
    
    console.log('Apple Callback 데이터:', {
      code: code ? 'received' : 'missing',
      state,
      id_token: id_token ? 'received' : 'missing',
      user: user ? JSON.parse(user) : null
    });

    if (!code || !id_token) {
      return NextResponse.json({
        success: false,
        message: 'Apple 인증 코드 또는 ID 토큰이 누락되었습니다.'
      }, { status: 400 });
    }

    // Apple ID 토큰 검증
    const decodedToken = await verifyAppleIdToken(id_token);
    
    if (!decodedToken) {
      return NextResponse.json({
        success: false,
        message: 'Apple ID 토큰 검증에 실패했습니다.'
      }, { status: 401 });
    }

    // 사용자 정보 추출
    const appleUserId = decodedToken.sub;
    const email = decodedToken.email;
    const emailVerified = decodedToken.email_verified === 'true';
    
    // 추가 사용자 정보 (최초 로그인시에만 제공)
    let userInfo = {};
    if (user) {
      const userData = JSON.parse(user);
      userInfo = {
        firstName: userData.name?.firstName || '',
        lastName: userData.name?.lastName || '',
        email: userData.email || email
      };
    }

    // 프론트엔드로 리다이렉트 (사용자 정보와 함께)
    const redirectUrl = new URL('/auth/apple-callback', request.url);
    redirectUrl.searchParams.set('success', 'true');
    redirectUrl.searchParams.set('user_id', appleUserId);
    redirectUrl.searchParams.set('email', email || '');
    redirectUrl.searchParams.set('email_verified', emailVerified.toString());
    
    if (userInfo.firstName) {
      redirectUrl.searchParams.set('first_name', userInfo.firstName);
    }
    if (userInfo.lastName) {
      redirectUrl.searchParams.set('last_name', userInfo.lastName);
    }

    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Apple Callback 처리 오류:', error);
    
    const redirectUrl = new URL('/auth/apple-callback', request.url);
    redirectUrl.searchParams.set('success', 'false');
    redirectUrl.searchParams.set('error', error.message || 'Apple 로그인 처리 중 오류가 발생했습니다.');
    
    return NextResponse.redirect(redirectUrl);
  }
}

/**
 * Apple ID 토큰 검증
 * Apple의 공개키로 JWT 토큰 검증
 */
async function verifyAppleIdToken(idToken) {
  try {
    // JWT 헤더 디코딩
    const header = jwt.decode(idToken, { complete: true })?.header;
    
    if (!header || !header.kid) {
      throw new Error('Invalid JWT header');
    }

    // Apple 공개키 가져오기
    const publicKey = await getApplePublicKey(header.kid);
    
    if (!publicKey) {
      throw new Error('Apple public key not found');
    }

    // JWT 토큰 검증
    const decoded = jwt.verify(idToken, publicKey, {
      algorithms: ['RS256'],
      audience: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
      issuer: 'https://appleid.apple.com'
    });

    return decoded;

  } catch (error) {
    console.error('Apple ID 토큰 검증 오류:', error);
    return null;
  }
}

/**
 * Apple 공개키 가져오기
 * Apple의 JWKS 엔드포인트에서 공개키 조회
 */
async function getApplePublicKey(keyId) {
  try {
    // Apple JWKS 엔드포인트
    const response = await fetch('https://appleid.apple.com/auth/keys');
    const jwks = await response.json();
    
    // 해당 Key ID의 공개키 찾기
    const key = jwks.keys.find(k => k.kid === keyId);
    
    if (!key) {
      throw new Error(`Public key not found for kid: ${keyId}`);
    }

    // JWK를 PEM 형태로 변환
    const publicKey = jwkToPem(key);
    return publicKey;

  } catch (error) {
    console.error('Apple 공개키 조회 오류:', error);
    return null;
  }
}

/**
 * JWK를 PEM 형태로 변환
 */
function jwkToPem(jwk) {
  try {
    // n과 e 값을 Buffer로 변환
    const modulus = Buffer.from(jwk.n, 'base64');
    const exponent = Buffer.from(jwk.e, 'base64');
    
    // RSA 공개키 생성
    const publicKey = crypto.createPublicKey({
      key: {
        n: modulus,
        e: exponent,
        kty: 'RSA'
      },
      format: 'jwk'
    });
    
    // PEM 형태로 변환
    return publicKey.export({
      type: 'spki',
      format: 'pem'
    });

  } catch (error) {
    console.error('JWK to PEM 변환 오류:', error);
    return null;
  }
}

// GET 요청도 지원 (URL 파라미터 방식)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  if (error) {
    const redirectUrl = new URL('/auth/apple-callback', request.url);
    redirectUrl.searchParams.set('success', 'false');
    redirectUrl.searchParams.set('error', error);
    return NextResponse.redirect(redirectUrl);
  }
  
  // POST와 동일한 로직으로 처리하되, formData 대신 searchParams 사용
  // 간단한 구현을 위해 에러 처리만 수행
  const redirectUrl = new URL('/auth/apple-callback', request.url);
  redirectUrl.searchParams.set('success', 'false');
  redirectUrl.searchParams.set('error', 'GET 방식은 지원하지 않습니다. POST 방식을 사용해주세요.');
  
  return NextResponse.redirect(redirectUrl);
}