import Image from 'next/image'
import Link from 'next/link'

import GoogleBard from './business/[...businessForm]/GoogleBard'

export default async function HomePage() {
  return (
    <main>
      <Link href="/" className="cursor-pointer">
        <Image
          src="/images/logo.webp"
          alt="logo"
          className="max-w-xs mx-auto"
          width="240"
          height="108"
        />
      </Link>

      <h2 className="text-2xl m-6 text-center">예산 데이터랩</h2>
      <div className="max-w-screen-md mx-auto my-2 grid gap-4 text-center">
        <Link href="/center">중앙정부 예산 도출</Link>
        <Link href="/local">지자체 예산 도출</Link>
        {/* <Link href="/analysis/flow">지역별 예산 흐름 분석</Link> */}
        <Link href="/analysis/ratio">중앙정부 · 지자체 예산 비율 분석</Link>
      </div>

      {/* <h2 className="text-2xl m-6 text-center">전문가 그룹 평가</h2>
      <div className="max-w-screen-md mx-auto my-2 grid gap-4 text-center">
        <Link href="/">전문가 정성 평가</Link>
        <Link href="/">전문가 정량 평가</Link>
      </div> */}

      <h2 className="text-2xl m-6 text-center">공약</h2>
      <div className="max-w-screen-md mx-auto my-2 grid gap-4 text-center">
        <Link href="/commitment/local">지자체장 공약</Link>
        <Link href="/commitment/edu">교육감 공약</Link>
        <Link href="/commitment/candidate">후보자 공약</Link>
        <Link href="/commitment/president">대통령 공약</Link>
      </div>
    </main>
  )
}
