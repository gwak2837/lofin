import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

import FlowForm from './FlowForm'

type Props = {
  children: ReactNode
}

export default function FlowAnalyticsLayout({ children }: Props) {
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
        <Link href="/analysis/flow" className="hover:no-underline focus:no-underline">
          <h2 className="text-2xl whitespace-nowrap text-black ">지역별 예산 흐름 분석</h2>
        </Link>
      </div>

      <FlowForm />

      {children}
    </main>
  )
}
