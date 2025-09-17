import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TOKTOK - 화장품 성분과 정보 & 리뷰를 확인하세요",
  description: "화장품 성분 분석부터 실제 사용자 리뷰까지, 믿을 수 있는 뷰티 정보를 제공하는 TOKTOK입니다.",
  icons: {
    icon: [
      {
        url: '/images/favicon.ico',
        type: 'image/x-icon',
      },
      {
        url: '/images/favicon-128x128.png',
        type: 'image/png',
        sizes: '128x128',
      },
      {
        url: '/images/favicon-64x64.png',
        type: 'image/png',
        sizes: '64x64',
      },
      {
        url: '/images/favicon.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/images/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
    ],
    shortcut: '/images/favicon-64x64.png',
    apple: '/images/favicon-128x128.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        {/* 파비콘 설정 - 강력한 캐시 무효화 */}
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico?v=3&t={Date.now()}" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=3" />
        <link rel="icon" type="image/png" sizes="128x128" href="/images/favicon-128x128.png?v=3" />
        <link rel="icon" type="image/png" sizes="64x64" href="/images/favicon-64x64.png?v=3" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png?v=3" />
        <link rel="apple-touch-icon" sizes="128x128" href="/images/favicon-128x128.png?v=3" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=3" />
        
        {/* PWA 및 모바일 최적화 */}
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-TileImage" content="/images/favicon-128x128.png?v=3" />
        
        {/* Google Material Symbols CDN - 별 아이콘용 */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <link rel="stylesheet" href="/styles/babitalk-fonts.css" />
        <link rel="stylesheet" href="/styles/fontawesome.css" />
        <link rel="stylesheet" href="/styles/fontawesome-icons.css" />
        <link rel="stylesheet" href="/styles/babitalk-main.css" />
        <link rel="stylesheet" href="/styles/babitalk-components.css" />
      </head>
      <body className={`${inter.className} font-pretendard`}>
        {children}
      </body>
    </html>
  );
}
