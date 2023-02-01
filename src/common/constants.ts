// 자동
export const NODE_ENV = process.env.NODE_ENV as string
const NEXT_PUBLIC_VERCEL_URL = process.env.NEXT_PUBLIC_VERCEL_URL as string
const NEXT_PUBLIC_VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV as string

// 공통
export const PROJECT_ENV = process.env.PROJECT_ENV as string
export const REVALIDATION_KEY = process.env.REVALIDATION_KEY as string

export const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string

export const NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY = process.env
  .NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY as string

if (!NEXT_PUBLIC_BACKEND_URL) throw new Error('`NEXT_PUBLIC_BACKEND_URL` 환경 변수를 설정해주세요.')

if (!NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY)
  throw new Error('`NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` 환경 변수를 설정해주세요.')

// 개별
export const NEXT_PUBLIC_GA_ID = process.env.NEXT_PUBLIC_GA_ID as string

if (!NEXT_PUBLIC_GA_ID) throw new Error('`NEXT_PUBLIC_GA_ID` 환경 변수를 설정해주세요.')

export const APPLICATION_NAME = '중앙위원회 정책참여시스템' // = site.webmanifest name
export const APPLICATION_SHORT_NAME = '중앙위원회 정책참여시스템' // = site.webmanifest short_name
export const SUBJECT = '쿠팡 가격 변동 알리미'
export const KEYWORDS = `${APPLICATION_SHORT_NAME},coupang,price,alert,쿠팡,가격,알리미` // 최대 10개
export const AUTHOR = '곽태욱(Taeuk Gwak)'
export const CANONICAL_URL =
  NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? 'https://lofin.vercel.app'
    : NEXT_PUBLIC_VERCEL_ENV === 'preview'
    ? `https://${NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000'
