import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import localFont from 'next/font/local'
import { ReactNode } from 'react'

import {
  APPLICATION_NAME,
  APPLICATION_SHORT_NAME,
  AUTHOR,
  CANONICAL_URL,
  KEYWORDS,
  SUBJECT,
} from '../common/constants'
import GoogleAnalytics from '../components/GoogleAnalytics'
import KakaoScript from '../components/KakaoScript'
import ReactHotToast from '../components/ReactHotToast'
import ReactQuery from '../components/ReactQuery'
import Recoil from '../components/Recoil'

export const metadata: Metadata = {
  title: '지키다 - 공약·예산 지키미',
  description: '지자체 세부사업별 예산안 평가, 지역별 정책 공약 · 실천 방안 · 실천 개선안 마련',
  // description: '우리나라 예산이 정확하고 효율적으로 쓰이는지 확인해보세요',
}

const myFont = localFont({
  src: './PretendardVariable.woff2',
  fallback: [
    'Pretendard',
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'sans-serif',
  ],
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko-KR" className={myFont.className}>
      <head />

      <meta property="og:site_name" content={APPLICATION_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ko_KR" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image:alt" content={`${APPLICATION_SHORT_NAME} 로고`} />

      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#bae6fd" />
      <meta name="msapplication-TileColor" content="#0ea5e9" />
      <meta name="theme-color" content="#bae6fd" />

      <link rel="shortcut icon" href="/images/shortcut-icon.png" />
      <link rel="canonical" href={CANONICAL_URL} />
      <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
      <meta name="author" content={AUTHOR} />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="application-name" content={APPLICATION_SHORT_NAME} />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content={APPLICATION_SHORT_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="subject" content={SUBJECT} />
      <meta name="rating" content="general" />
      <meta name="robots" content="index,follow" />
      <meta name="revisit-after" content="3 days" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      <body className={myFont.className}>
        <Recoil>
          <ReactQuery>{children}</ReactQuery>
        </Recoil>
        <ReactHotToast />
      </body>

      <Analytics />
      <GoogleAnalytics />
      <KakaoScript />
    </html>
  )
}
