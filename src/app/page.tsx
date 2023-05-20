import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  return (
    <main>
      <Link href="/" className="cursor-pointer">
        <Image
          src="/images/pickup-logo.png"
          alt="pickup-logo"
          className="max-w-xs mx-auto"
          width="2392"
          height="798"
        />
      </Link>

      <h2 className="text-2xl m-6 text-center">지역별 데이터랩</h2>
      <div className="max-w-screen-md mx-auto my-2 grid gap-4 text-center">
        <Link href="/local">예산 진단 지표 분석</Link>
        <Link href="/">우리 동네 사업 현황</Link>
      </div>

      <h2 className="text-2xl m-6 text-center">전문가 그룹 평가</h2>
      <div className="max-w-screen-md mx-auto my-2 grid gap-4 text-center">
        <Link href="/center">중앙부처 사업 도출</Link>
        <Link href="/">전문가 정성 평가</Link>
        <Link href="/">전문가 정량 평가</Link>
      </div>

      <h2 className="text-2xl m-6 text-center">데이터</h2>
      <div className="max-w-screen-md mx-auto my-2 grid gap-4 text-center">
        <Link href="/commitment">공약</Link>
        <Link href="/">중앙부처별 사업계획 예산</Link>
      </div>
    </main>
  )
}
