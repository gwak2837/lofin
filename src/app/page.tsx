import Image from 'next/image'
import Link from 'next/link'

import GoogleBard from './business/[...businessForm]/GoogleBard'

export default async function HomePage() {
  return (
    <main className="p-2">
      <Link href="/" className="cursor-pointer">
        <Image
          src="/images/logo.webp"
          alt="logo"
          className="max-w-xs mx-auto"
          width="240"
          height="108"
        />
      </Link>

      <h2 className="text-2xl m-6 text-center">예산 지키기</h2>
      <div className="max-w-screen-md mx-auto my-2 grid grid-cols-[repeat(auto-fit,minmax(256px,1fr))] gap-2 text-center">
        <Link href="/center" className="border p-8  hover:bg-sky-100">
          중앙정부 예산 도출
        </Link>
        <Link href="/local" className="border p-8 hover:bg-sky-100">
          지자체 예산 도출
        </Link>
        {/* <Link href="/analysis/flow">지역별 예산 흐름 분석</Link> */}
        <Link href="/analysis/ratio" className="border p-8  hover:bg-sky-100">
          중앙정부 · 지자체 예산 비율 분석
        </Link>
      </div>

      {/* <h2 className="text-2xl m-6 text-center">전문가 그룹 평가</h2>
      <div className="max-w-screen-md mx-auto my-2 grid gap-4 text-center">
        <Link href="/">전문가 정성 평가</Link>
        <Link href="/">전문가 정량 평가</Link>
      </div> */}

      <h2 className="text-2xl m-6 text-center">공약 지키기</h2>
      <div className="max-w-screen-md mx-auto my-2 grid grid-cols-[repeat(auto-fit,minmax(256px,1fr))] gap-2 text-center">
        <Link href="/commitment/local" className="border p-8  hover:bg-sky-100">
          지자체장 공약
        </Link>
        <Link href="/commitment/edu" className="border p-8  hover:bg-sky-100">
          교육감 공약
        </Link>
        <Link href="/commitment/candidate" className="border p-8  hover:bg-sky-100">
          후보자 공약
        </Link>
        <Link href="/commitment/president" className="border p-8  hover:bg-sky-100">
          대통령 공약
        </Link>
      </div>
    </main>
  )
}
