'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../../../components/Header';

/**
 * 후기 상세페이지 컴포넌트
 */
export default function ReviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  // 더미 후기 데이터 (실제로는 API에서 가져올 데이터)
  const allReviews = [
    {
      id: 1,
      title: "가슴확대(보형물)",
      content: "진짜 평생 새가슴으로 살아서 그런가 큰 가슴에 대한 니즈가 진짜 극심했거든요. 근데 일단 저는 골격이 큰 편이라서 340이나 360 두고 고민을 했는데요? 원장님께서 골격상 좀 더 큰걸 추천해 주셔서 380cc로 받았어요. 진짜 솔직히 수술비가 좀 부담스럽긴 했지만 확실히 큰 가슴에 대한 욕심이 있었고 또 어머니도 워낙 큰가슴이셨어서 나름 유전적으로도 받쳐주지 않을까 싶었습니다. 수술은 잠에서 깨보니 끝나있었고 정말 몸이 좀 아팠지만 그래도 진짜 가슴이 커진걸보니까 너무 좋았어요 ! 앞으로 관리 잘해야겠어요!",
      rating: 5,
      username: "돼지된듯",
      gender: "여자",
      isVerified: true,
      timeAgo: "15시간 전",
      beforeImage: "https://images.babitalk.com/reviews/blur/blur1.png",
      afterImages: [
        "https://images.babitalk.com/reviews/0cd76c20b875150597cfe940ba8b1112/small/d161dec4e41a28f6297771c9ac9fde00/1.jpg",
        "https://images.babitalk.com/reviews/0cd76c20b875150597cfe940ba8b1112/small/0d5b1c4c7f720f698946c7f6ab08f687/0.jpg",
        "https://images.babitalk.com/reviews/0cd76c20b875150597cfe940ba8b1112/small/0d5b1c4c7f720f698946c7f6ab08f687/2.jpg"
      ],
      additionalImageCount: 4,
      date: "2025.07.02",
      helpfulCount: 125,
      treatmentType: "가슴성형",
      treatmentTime: "수술시기 선택안함",
      doctorName: "김기갑 원장",
      doctorImage: "https://images.babitalk.com/doctor/2127/951d6945b93fdc3fb235ddf448dbca72/face.png",
      doctorSpecialty: "전문의",
      hospitalImage: "https://images.babitalk.com/images/969ff1725e7312450422cdcf4632d9b2/logo_1617340671.jpg",
      hospitalLocation: "서울 신사",
      procedureMethod: "코끝(자가조직), 콧대(보형물)",
      procedureCost: "1,639,000원",
      popularity: 10,
      procedureInfo: {
        name: "이름부터U&U-모티바",
        price: "11,500,000원",
        image: "https://images.babitalk.com/images/10670d8ab3da583cbef605021f64fca1/banner_img_1743907244.jpg"
      },
      relatedReviews: [
        {
          id: 101,
          title: "콧대(보형물), 코끝(보형물), 콧대 남자성형, 코끝 남자성형",
          rating: 5,
          content: "히트성형외과 한상철원장님께 남자 코성형 받은 후기입니다. ...",
          image: "https://images.babitalk.com/reviews/3fa1feabd3c4664d756455d31f1d031a/small/d161dec4e41a28f6297771c9ac9fde00/1.jpg"
        },
        {
          id: 102,
          title: "비염/축농증 기능코, 코끝(자가조직), 콧대(자가조직), 코절골술",
          rating: 5,
          content: "여러 병원을 상담한 끝에 마인드 성형외과 이강우 원장님께 코수술을 받았습니다. ...",
          image: "https://images.babitalk.com/reviews/0d5d39ede97b90d564ccee89e90aea22/small/d161dec4e41a28f6297771c9ac9fde00/6.jpg"
        },
        {
          id: 103,
          title: "내측절개 콧볼, 눈밑지방재배치, 쌍꺼풀 눈재수술, 절개 눈매교정, 절개 쌍꺼풀, 코끝(자가조직), 코절골술, 콧대(보형물), 풀페이스 지방분해/윤곽주사",
          rating: 5,
          content: "얼굴 대칭도 잘 안 맞고 얼굴 하나하나 마음에 안 들어서 완전 다 바꾸고 싶은 마음에 ...",
          image: "https://images.babitalk.com/reviews/f8d1cedfb1b1cf6ff0c4a4475882a5ee/small/d161dec4e41a28f6297771c9ac9fde00/2.jpg"
        }
      ]
    },
    {
      id: 2,
      title: "코성형(코끝+콧대)",
      content: "코 성형 너무 만족스러워요! 자연스럽게 잘 나왔고 의사선생님도 친절하시고 직원분들도 다 친절하셔서 좋았어요.",
      rating: 4,
      username: "코성형고민남",
      gender: "남자",
      isVerified: false,
      timeAgo: "2일 전",
      beforeImage: "https://images.babitalk.com/reviews/blur/blur2.png",
      afterImages: [
        "https://images.babitalk.com/reviews/blur/blur2.png",
        "https://images.babitalk.com/reviews/blur/blur1.png",
        "https://images.babitalk.com/reviews/blur/blur3.png"
      ],
      additionalImageCount: 2,
      date: "2025.06.28",
      helpfulCount: 89,
      treatmentType: "코성형",
      treatmentTime: "수술 후 3개월",
      doctorName: "이민수 원장",
      doctorImage: "https://images.babitalk.com/doctor/2127/951d6945b93fdc3fb235ddf448dbca72/face.png",
      doctorSpecialty: "전문의",
      hospitalImage: "https://images.babitalk.com/images/969ff1725e7312450422cdcf4632d9b2/logo_1617340671.jpg",
      hospitalLocation: "서울 강남",
      procedureMethod: "코끝(자가조직), 콧대(보형물)",
      procedureCost: "3,800,000원",
      popularity: 8,
      procedureInfo: {
        name: "자연코성형 패키지",
        price: "3,800,000원",
        image: "https://images.babitalk.com/images/10670d8ab3da583cbef605021f64fca1/banner_img_1743907244.jpg"
      },
      relatedReviews: [
        {
          id: 201,
          title: "코끝(자가조직), 콧대(보형물)",
          rating: 4,
          content: "코성형 받은 지 한 달 됐는데 자연스럽게 잘 나온 것 같아요...",
          image: "https://images.babitalk.com/reviews/3fa1feabd3c4664d756455d31f1d031a/small/d161dec4e41a28f6297771c9ac9fde00/1.jpg"
        }
      ]
    }
  ];

  // 프로필 이미지 가져오기 함수
  const getProfileImage = (gender) => {
    if (gender === "남자") {
      return "/images/profile-male.png";
    } else if (gender === "여자") {
      return "/images/profile-female.png";
    } else {
      return "/images/logo.svg"; // Default image
    }
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    window.location.href = `/hospital/${params.id}/reviews`;
  };

  // 컴포넌트 마운트 시 후기 데이터 로드
  useEffect(() => {
    const reviewId = parseInt(params.reviewId);
    const foundReview = allReviews.find(r => r.id === reviewId);
    setReview(foundReview);
    setLoading(false);
  }, [params.reviewId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-common_1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-container-plasticSurgery_3 mx-auto mb-4"></div>
          <p className="text-label-common_3">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-background-common_1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-label-common_3">후기를 찾을 수 없습니다.</p>
          <button 
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-container-plasticSurgery_3 text-white rounded-lg"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* 메인 컨텐츠 */}
      <div className="relative w-full desktop:px-[32px] tablet:px-[24px] px-[16px] tablet:pt-0 pt-14">
        
        {/* 상단 헤더 */}
        <div className="false flex flex-none items-center sticky top-0 desktop:ml-[-32px] tablet:ml-[-24px] ml-[-16px] w-screen max-w-[1024px] desktop:h-[72px] h-[56px] desktop:px-[32px] tablet:px-[24px] px-[16px] desktop:gap-[16px] gap-[12px] bg-background-common_1 z-10 transition">
          <span 
            onClick={handleGoBack}
            className="material-symbols-rounded text-icon-common_4 cursor-pointer" 
            style={{fontVariationSettings:"'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}
          >
            arrow_back
          </span>
          <div className="grow shrink basis-0">
            <h3 className="text-label-common_5 leading-[150%] text-inherit text-lg font-semibold">
              시술후기
            </h3>
          </div>
        </div>

        {/* User info and rating */}
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-label-common_5 leading-[150%] text-inherit text-base font-semibold">{review.username}</h4>
                {review.isVerified && (
                  <div className="inline-flex items-center gap-0.5 rounded border border-solid h-[16px] px-[4px] bg-container-plasticSurgery_1 border-none text-right text-[10px] font-semibold leading-[150%] text-nowrap h-inherit text-label-plasticSurgery_2 undefined">
                    <span translate="no" className="material-symbols-rounded text-inherit" aria-hidden="true" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: '12px', color: 'rgb(96, 74, 255)', visibility: 'visible'}}>verified_user</span>
                    <span className="text-inherit leading-[150%] text-inherit text-[10px] font-semibold">실제 시술 인증</span>
                  </div>
                )}
              </div>
              <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">{review.timeAgo}</p>
            </div>
            <div className="flex items-center justify-start gap-0.5">
              {[...Array(5)].map((_, i) => (
                <img key={i} src="/images/reviews/ic_rating_active.svg" alt="ic_rating_active" className="w-4" />
              ))}
            </div>
          </div>
          <hr className="my-4 h-px bg-divider-common_1" />

          {/* Image gallery */}
          <div className="mb-6 pb-2">
            <div className="overflow-x-scroll scrollbar-hide desktop:mr-[-32px] tablet:mr-[-24px] mr-[-16px]" style={{cursor: 'auto'}}>
              <div className="flex flex-row justify-start max-w-[960px] tablet:gap-3 gap-2" style={{cursor: 'auto'}}>
                <figure className="false col-start-3 row-start-2 h-full w-auto relative w-fit cursor-pointer border border-solid border-[rgba(0,0,0,0.04)] rounded-2xl">
                  <img className="max-w-[160px] h-[160px] rounded-2xl object-cover" draggable="false" width="231" height="231" alt="review_thumbnail_1" src={review.afterImages[0]} />
                  <figcaption className="max-w-9 max-h-9 rounded-[16px_0px_16px_0px] absolute inset-0 w-full h-full flex justify-center items-center bg-background-plasticSurgery_2">
                    <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">후</h6>
                  </figcaption>
                </figure>
                <figure className="false col-start-3 row-start-2 h-full w-auto relative w-fit cursor-pointer border border-solid border-[rgba(0,0,0,0.04)] rounded-2xl">
                  <img className="max-w-[160px] h-[160px] rounded-2xl object-cover" draggable="false" width="231" height="231" alt="review_thumbnail_1" src={review.afterImages[1]} />
                  <figcaption className="max-w-9 max-h-9 rounded-[16px_0px_16px_0px] absolute inset-0 w-full h-full flex justify-center items-center bg-container-common_5/70">
                    <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">전</h6>
                  </figcaption>
                </figure>
                <figure className="desktop:mr-[32px] tablet:mr-[24px] mr-[16px] col-start-3 row-start-2 h-full w-auto relative w-fit cursor-pointer border border-solid border-[rgba(0,0,0,0.04)] rounded-2xl">
                  <img className="max-w-[160px] h-[160px] rounded-2xl object-cover" draggable="false" width="231" height="231" alt="review_thumbnail_1" src={review.afterImages[2]} />
                  <figcaption className="max-w-9 max-h-9 rounded-[16px_0px_16px_0px] absolute inset-0 w-full h-full flex justify-center items-center bg-background-plasticSurgery_2">
                    <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">후</h6>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>

          {/* Review content */}
          <div className="flex flex-col">
            <p className="relative text-label-common_5 break-words whitespace-pre-line mb-[16px] w-full leading-[150%] text-inherit text-sm font-normal">
              {review.content}
            </p>

            {/* Event card */}
            <div className="mt-[32px] mb-4 p-4 flex flex-col gap-x-4 gap-y-3 bg-background-common_1 rounded-2xl border border-solid border-outline-common_2">
              <span className="text-label-common_4 leading-[150%] text-inherit text-sm font-semibold">직접 시술받은 이벤트</span>
              <div className="flex flex-wrap items-center gap-[12px]">
                <img src="https://images.babitalk.com/images/f4be4f35e2f242f38b2932b52c6998db/banner_img_1749789879.jpg" className="w-[56px] h-[56px] rounded-[12px]" alt="event" />
                <div className="flex flex-col gap-[2px]">
                  <h6 className="leading-[150%] text-inherit text-sm font-medium">자려한첫코성형 깜짝특가</h6>
                  <div className="flex items-center gap-[4px] flex-wrap">
                    <h4 className="leading-[150%] text-inherit text-base font-semibold">1,089,000원</h4>
                    <h4 className="text-label-plasticSurgery_2 leading-[150%] text-inherit text-base font-semibold">47%</h4>
                    <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">VAT 포함</p>
                  </div>
                </div>
                <div className="flex gap-[10px] tablet:ml-auto tablet:w-auto w-full">
                  <button className="flex-none tablet:w-auto w-[120px] flex flex-none justify-center items-center font-semibold leaning-[150%]] rounded-[12px] px-[20px] text-[16px] gap-[6px] border-[1.5px] border-outline-plasticSurgery_2 text-label-plasticSurgery_2" style={{height: '56px'}}>
                    이벤트 보기
                  </button>
                  <button className="tablet:w-auto w-[calc(100%-10px-120px)] flex flex-none justify-center items-center font-semibold leaning-[150%]] rounded-[12px] px-[20px] text-[16px] gap-[6px] bg-background-plasticSurgery_2 text-white" style={{height: '56px'}}>
                    이벤트 상담 신청
                  </button>
                </div>
              </div>
              
              {/* 구분선 */}
              <div className="w-full h-[1px] bg-divider-common_1 my-[12px]"></div>
              
              {/* Procedure info */}
              <div className="flex items-center">
                <span translate="no" className="material-symbols-rounded text-icon-common_4 mr-1" aria-hidden="true" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: '20px', visibility: 'visible'}}>local_hospital</span>
                <span className="text-label-common_4 mr-4 min-w-[52px] leading-[150%] text-inherit text-sm font-semibold">시술 방법</span>
                <span className="text-label-common_5 leading-[150%] text-inherit text-sm font-semibold">{review.procedureMethod}</span>
              </div>
              <div className="flex items-center">
                <span translate="no" className="material-symbols-rounded text-icon-common_4 mr-1" aria-hidden="true" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: '20px', visibility: 'visible'}}>payments</span>
                <span className="text-label-common_4 mr-4 min-w-[52px] leading-[150%] text-inherit text-sm font-semibold">시술 비용</span>
                <span className="text-label-common_5 leading-[150%] text-inherit text-sm font-semibold">{review.procedureCost}</span>
              </div>
              <div className="flex items-center">
                <span translate="no" className="material-symbols-rounded text-icon-common_4 mr-1" aria-hidden="true" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: '20px', visibility: 'visible'}}>calendar_today</span>
                <span className="text-label-common_4 mr-4 min-w-[52px] leading-[150%] text-inherit text-sm font-semibold">시술 시기</span>
                <span className="text-label-common_5 leading-[150%] text-inherit text-sm font-semibold">수술시기 선택안함</span>
              </div>
              <p className="text-label-common_3 mx-auto leading-[150%] text-inherit text-[13px] font-medium">방법 및 비용은 개인의 상황에 따라 달라질 수 있어요</p>
            </div>

            {/* Doctor and Hospital info */}
            <div className="mt-[32px] mb-10 divide-y divide-divider-common_1 flex flex-col items-start gap-3 self-stretch border border-outline-thumbnail bg-background-common_2 px-[18px] py-4 rounded-2xl border-solid">
              <div className="flex flex-col w-full cursor-pointer">
                <span className="mt-3 text-label-common_4 leading-[150%] text-inherit text-sm font-semibold">시술받은 의사</span>
                <div className="mt-2 flex items-center">
                  <img alt="search_doctor_image" loading="lazy" width="56" height="56" decoding="async" data-nimg="1" className="w-14 h-14 rounded-full object-cover mr-3" src={review.doctorImage} style={{color: 'transparent'}} />
                  <div>
                    <span className="text-label-common_5 leading-[150%] text-inherit text-sm font-semibold">{review.doctorName}</span>
                    <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">{review.doctorSpecialty}</p>
                  </div>
                  <span translate="no" className="material-symbols-rounded ml-auto" aria-hidden="true" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', color: 'rgb(163, 163, 175)', fontSize: '16px'}}>arrow_forward_ios</span>
                </div>
              </div>
              <div className="flex flex-col w-full cursor-pointer">
                <span className="mt-3 text-label-common_4 leading-[150%] text-inherit text-sm font-semibold">시술받은 병원</span>
                <div className="mt-2 flex items-center">
                  <img alt="search_doctor_image" loading="lazy" width="56" height="56" decoding="async" data-nimg="1" className="w-14 h-14 rounded-full object-cover mr-3" src={review.hospitalImage} style={{color: 'transparent'}} />
                  <div>
                    <span className="text-label-common_5 leading-[150%] text-inherit text-sm font-semibold">아이디병원</span>
                    <p className="text-label-common_3 leading-[150%] text-inherit text-[13px] font-medium">{review.hospitalLocation}</p>
                  </div>
                  <span translate="no" className="material-symbols-rounded ml-auto" aria-hidden="true" style={{fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24', color: 'rgb(163, 163, 175)', fontSize: '16px'}}>arrow_forward_ios</span>
                </div>
              </div>
            </div>
            
            {/* Divider section */}
            <div className="relative desktop:left-[-32px] tablet:left-[-24px] left-[-16px] w-screen max-w-[1024px] h-[8px] bg-container-common_2 undefined"></div>

            {/* Related reviews */}
            <div className="mb-[40px]">
              <div className="w-full justify-start items-center gap-1 inline-flex" style={{paddingTop: '16px', paddingBottom: '8px'}}>
                <div className="grow shrink basis-0 flex-col justify-center items-start gap-1 inline-flex">
                  <div className="self-stretch justify-start items-center gap-1 inline-flex">
                    <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                      <div className="self-stretch justify-start items-start gap-1 inline-flex">
                        <div className="flex gap-[4px] items-center justify-start w-full grow shrink basis-0 text-label-common_5 text-lg font-bold">
                          같은 카테고리 인기 시술 후기
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-[16px]">
                {review.relatedReviews.map((relatedReview, index) => (
                  <div key={relatedReview.id} className={`flex gap-[12px] cursor-pointer ${index < review.relatedReviews.length - 1 ? 'mb-[20px]' : ''}`}>
                    <div className="relative flex-none w-[90px] h-[90px] rounded-2xl !bg-container-common_3" style={{background: `url("${relatedReview.image}") 0% 0% / cover`}}>
                      <figcaption className="w-[28px] h-[28px] rounded-[16px_0px_16px_0px] absolute inset-0 flex justify-center items-center bg-background-plasticSurgery_2">
                        <h6 className="text-label-common_1 leading-[150%] text-inherit text-sm font-medium">후</h6>
                      </figcaption>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <h4 className="text-label-common_6 line-clamp-1 leading-[150%] text-inherit text-base font-semibold">{relatedReview.title}</h4>
                      <div className="flex items-center justify-start gap-0.5">
                        {[...Array(relatedReview.rating)].map((_, i) => (
                          <img key={i} src="/images/reviews/ic_rating_active.svg" alt="ic_rating_active" className="w-4" />
                        ))}
                      </div>
                      <div>
                        <p className="line-clamp-2 text-label-common_5 leading-[150%] text-inherit text-sm font-normal">
                          {relatedReview.content}
                        </p>
                        <p className="text-label-common_3 mt-0.5 leading-[150%] text-inherit text-sm font-normal">..더보기</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <div className="fixed bottom-[40px] left-0 right-0 tablet:px-[24px] px-[16px] z-10" style={{opacity: 1, willChange: 'auto'}}>
        <div className="flex items-center gap-[10px] rounded-[12px] mb-[24px] overflow-hidden cursor-pointer max-w-[720px] mx-auto bg-background-plasticSurgery_2 px-[16px] py-[8px]">
          <div className="tablet:w-[48px] tablet:h-[48px] w-[40px] h-[40px] bg-outline-common_2 rounded-[10px]" style={{backgroundImage: 'url("https://images.babitalk.com/images/fc1a16d2b2310cd1f60548fce06e899d/banner_img_1752548198.jpg")', backgroundSize: 'cover', backgroundPosition: 'center center'}}></div>
          <span className="text-white leading-[150%] text-inherit text-sm font-semibold">지금 본 후기, 그대로 시술받기</span>
          <button className="ml-auto flex flex-none justify-center items-center font-semibold leaning-[150%]] rounded-[200px] px-[10px] text-[12px] gap-[2px] bg-container-common_2 text-label-common_5 border border-outline-common_2" style={{height: '32px'}}>
            이벤트 보기
            <span translate="no" className="material-symbols-rounded text-inherit" aria-hidden="true" style={{fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24', fontSize: '8px'}}>arrow_forward_ios</span>
          </button>
        </div>
      </div>
    </div>
  );
}
