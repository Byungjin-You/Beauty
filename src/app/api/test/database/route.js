import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../../models/User';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    console.log('🔄 MongoDB 연결 테스트 시작...');
    
    // 1. 데이터베이스 연결 테스트
    const dbConnection = await connectDB();
    console.log('✅ MongoDB 연결 성공');
    
    // 2. 연결 상태 정보 수집
    const connectionState = mongoose.connection.readyState;
    const connectionStates = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // 3. 데이터베이스 정보 조회
    const dbName = mongoose.connection.db?.databaseName;
    const host = mongoose.connection.host;
    const port = mongoose.connection.port;
    
    // 4. 컬렉션 목록 조회
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // 5. User 컬렉션 문서 수 확인
    let userCount = 0;
    try {
      userCount = await User.countDocuments();
    } catch (error) {
      console.log('User 컬렉션 접근 중 오류:', error.message);
    }
    
    // 6. 간단한 쓰기/읽기 테스트
    const testData = {
      testField: 'MongoDB 연결 테스트',
      timestamp: new Date(),
      randomValue: Math.random()
    };
    
    // 테스트 컬렉션에 데이터 삽입
    const testCollection = mongoose.connection.db.collection('connection_test');
    const insertResult = await testCollection.insertOne(testData);
    
    // 방금 삽입한 데이터 조회
    const retrievedData = await testCollection.findOne({ _id: insertResult.insertedId });
    
    // 테스트 데이터 삭제 (정리)
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    
    console.log('✅ MongoDB 읽기/쓰기 테스트 성공');
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB 연결 및 동작 테스트 성공!',
      connectionInfo: {
        state: connectionStates[connectionState],
        stateCode: connectionState,
        database: dbName,
        host: host,
        port: port,
        mongooseVersion: mongoose.version
      },
      collections: {
        total: collections.length,
        names: collectionNames
      },
      testResults: {
        userCollectionCount: userCount,
        writeTest: insertResult.acknowledged,
        readTest: retrievedData !== null,
        testDataId: insertResult.insertedId
      },
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error) {
    console.error('❌ MongoDB 연결 테스트 실패:', error);
    
    return NextResponse.json({
      success: false,
      message: 'MongoDB 연결 테스트 실패',
      error: {
        name: error.name,
        message: error.message,
        code: error.code
      },
      troubleshooting: {
        checkList: [
          '1. MongoDB 서버가 실행 중인지 확인',
          '2. MONGODB_URI 환경 변수가 올바르게 설정되었는지 확인',
          '3. 네트워크 연결 상태 확인',
          '4. MongoDB 인증 정보 확인 (필요한 경우)',
          '5. 방화벽 설정 확인'
        ],
        commonSolutions: [
          'MongoDB 로컬 설치: brew install mongodb-community (Mac) 또는 apt install mongodb (Ubuntu)',
          'MongoDB 서비스 시작: brew services start mongodb-community (Mac) 또는 systemctl start mongod (Ubuntu)',
          'MongoDB Atlas 사용 시 IP 화이트리스트 확인'
        ]
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST 메서드로 샘플 사용자 생성 테스트
export async function POST(request) {
  try {
    console.log('🔄 샘플 사용자 생성 테스트 시작...');
    
    await connectDB();
    
    const { createSampleUser = false } = await request.json();
    
    if (!createSampleUser) {
      return NextResponse.json({
        success: false,
        message: 'createSampleUser 플래그를 true로 설정해주세요.'
      }, { status: 400 });
    }
    
    // 테스트용 샘플 사용자 데이터
    const sampleUserData = {
      name: '테스트 사용자',
      email: `test_${Date.now()}@example.com`, // 중복 방지를 위한 타임스탬프
      password: 'test123456',
      phone: '010-1234-5678',
      gender: 'other',
      agreements: {
        serviceTerms: true,
        privacyPolicy: true,
        marketingConsent: false,
        thirdPartyConsent: false,
        agreedAt: new Date()
      },
      selectedCategories: ['face', 'nose'],
      selectedSymptoms: ['볼살', '넓은코'],
      treatmentType: 'both',
      registrationStep: 'completed',
      isRegistrationCompleted: true
    };
    
    // 사용자 생성
    const newUser = await User.create(sampleUserData);
    console.log('✅ 샘플 사용자 생성 성공:', newUser._id);
    
    // 생성된 사용자 조회 (비밀번호 제외)
    const retrievedUser = await User.findById(newUser._id);
    
    return NextResponse.json({
      success: true,
      message: '샘플 사용자 생성 및 조회 성공!',
      user: retrievedUser.toJSON(),
      testInfo: {
        createdAt: newUser.createdAt,
        hashedPassword: '비밀번호가 해싱되어 저장됨',
        documentId: newUser._id
      },
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('❌ 샘플 사용자 생성 실패:', error);
    
    return NextResponse.json({
      success: false,
      message: '샘플 사용자 생성 실패',
      error: {
        name: error.name,
        message: error.message,
        validationErrors: error.errors ? Object.keys(error.errors) : null
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}