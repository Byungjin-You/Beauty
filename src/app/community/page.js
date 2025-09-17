'use client';

import { useState } from 'react';
import Header from '../components/Header';
import BottomNavigation from '../../components/sections/BottomNavigation';
import { blogPosts } from '../../data/blog-posts';

export default function ColumnPage() {
  const [visiblePosts, setVisiblePosts] = useState(4);

  const loadMorePosts = () => {
    setVisiblePosts(prev => prev + 4);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <Header />
      
      {/* 메인 컨텐츠 영역 */}
      <div className="pt-14 pb-20">
        {/* 제모 할인전 배너 - 최상단 */}
        <div className="px-4 py-4">
          <div className="w-full">
            <a 
              href="https://view.babitalk.com/crm_exhibition/web.html?id=378&utm_source=CRM&utm_medium=magazine_strip&utm_campaign=250731_378"
              target="_blank"
              rel="noopener"
              className="relative block w-full rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'rgb(255, 145, 138)', opacity: 1 }}
            >
              {/* 텍스트 영역 */}
              <div className="relative z-10" style={{ opacity: 1 }}>
                <div 
                  className="flex flex-col justify-start p-6"
                  style={{ 
                    outline: 'currentcolor',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    flexShrink: 0,
                    transform: 'none',
                    opacity: 1
                  }}
                >
                  <p 
                    className="text-white font-bold"
                    style={{
                      fontFamily: '"Pretendard Bold", "Pretendard Bold Placeholder", sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.4em',
                      color: 'rgb(255, 255, 255)'
                    }}
                  >
                    제모, 가장 저렴하게 받는 법!
                  </p>
                  <p 
                    className="text-white font-bold"
                    style={{
                      fontFamily: '"Pretendard Bold", "Pretendard Bold Placeholder", sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.4em',
                      color: 'rgb(255, 255, 255)'
                    }}
                  >
                    톡톡 제모 할인전
                  </p>
                </div>
              </div>
              
              {/* 배경 이미지 영역 */}
              <div className="absolute top-0 right-0 bottom-0" style={{ opacity: 1, width: '120px' }}>
                <div 
                  className="absolute inset-0 rounded-2xl"
                  style={{ position: 'absolute', borderRadius: 'inherit', inset: '0px' }}
                >
                  <img 
                    decoding="async"
                    width="640"
                    height="480"
                    sizes="120px"
                    srcSet="https://framerusercontent.com/images/1qYjDc7mltqCe93Ta7UK8aJVffk.png?scale-down-to=512 512w,https://framerusercontent.com/images/1qYjDc7mltqCe93Ta7UK8aJVffk.png 640w"
                    src="https://framerusercontent.com/images/1qYjDc7mltqCe93Ta7UK8aJVffk.png"
                    alt=""
                    className="block w-full h-full object-cover"
                    style={{ 
                      display: 'block', 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: 'inherit', 
                      objectPosition: 'center center', 
                      objectFit: 'cover' 
                    }}
                  />
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* 블로그 포스트 섹션 */}
        <div className="px-4 py-4">
          <div className="max-w-full mx-auto">
            <div className="grid grid-cols-1 gap-6">
              {blogPosts.slice(0, visiblePosts).map((post) => (
                <div key={post.id} className="block">
                  <a href={post.href} className="block border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      sizes="calc(100vw - 32px)"
                    />
                  </a>
                  
                  <a href={post.href} className="block p-4">
                    <h3 
                      className="text-lg font-semibold mb-2"
                      style={{
                        fontFamily: '"Pretendard SemiBold", "Pretendard SemiBold Placeholder", sans-serif',
                        fontSize: '18px',
                        lineHeight: '1.5em',
                        textAlign: 'left',
                        color: 'rgb(49, 49, 66)'
                      }}
                    >
                      {post.title}
                    </h3>
                    <p 
                      className="text-sm mb-2"
                      style={{
                        fontFamily: '"Pretendard Medium", "Pretendard Medium Placeholder", sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.5em',
                        textAlign: 'left',
                        color: 'rgb(126, 126, 143)'
                      }}
                    >
                      {post.subtitle}
                    </p>
                    <p 
                      className="text-xs"
                      style={{
                        fontFamily: '"Pretendard Medium", "Pretendard Medium Placeholder", sans-serif',
                        fontSize: '12px',
                        letterSpacing: '0px',
                        lineHeight: '1.5em',
                        textAlign: 'left',
                        color: 'rgb(163, 163, 175)'
                      }}
                    >
                      {post.date}
                    </p>
                  </a>
                </div>
              ))}
            </div>

            {/* 더보기 버튼 */}
            {visiblePosts < blogPosts.length && (
              <div className="flex justify-center mt-8" data-framer-name="load btn">
                <div className="inline-block">
                  <div
                    className="inline-block"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      borderRadius: '10px',
                      opacity: 1
                    }}
                    tabIndex="0"
                  >
                    <button
                      onClick={loadMorePosts}
                      className="flex items-center gap-2 px-6 py-3 hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: 'rgb(49, 49, 66)',
                        borderRadius: '200px',
                        opacity: 1,
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {/* 아이콘 */}
                      <div style={{ opacity: 1 }}>
                        <div style={{ opacity: 1 }}>
                          <div
                            style={{
                              imageRendering: 'pixelated',
                              flexShrink: 0,
                              fill: 'rgb(255, 255, 255)',
                              color: 'rgb(255, 255, 255)',
                              opacity: 1,
                              width: '11px',
                              height: '10px'
                            }}
                            aria-hidden="true"
                          >
                            <svg
                              style={{ width: '100%', height: '100%' }}
                              viewBox="0 0 11 10"
                              preserveAspectRatio="none"
                              width="100%"
                              height="100%"
                              fill="currentColor"
                            >
                              <path d="M5.5 1v8M1.5 5.5h8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* 텍스트 */}
                      <div
                        style={{
                          outline: 'currentcolor',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transform: 'none',
                          opacity: 1
                        }}
                      >
                        <p
                          style={{
                            fontFamily: '"Pretendard", "Pretendard Placeholder", sans-serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            letterSpacing: '0px',
                            lineHeight: '150%',
                            textAlign: 'center',
                            color: 'rgb(255, 255, 255)',
                            margin: 0
                          }}
                        >
                          더보기
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNavigation />
    </div>
  );
}