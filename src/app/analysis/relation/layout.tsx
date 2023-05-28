import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function RelationAnalysisLayout({ children }: Props) {
  return (
    <main>
      <div className="max-w-screen-md mx-auto my-2 flex flex-wrap justify-center items-center">
        <Link href="/">
          <Image
            src="/images/pickup-logo.png"
            alt="pickup-logo"
            className="max-w-xs cursor-pointer"
            width="2392"
            height="798"
          />
        </Link>
        <Link href="/analysis/relation" className="hover:no-underline focus:no-underline">
          <h2 className="text-2xl whitespace-nowrap text-black ">예산 연관성 분석</h2>
        </Link>
      </div>

      <Link href="/analysis/relation/1100000/2022-01-01/2022-12-31/2022/true">이동</Link>

      {children}
    </main>
  )
}
