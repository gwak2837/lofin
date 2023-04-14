import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

import LocalExpenditureForm from './LocalExpenditureForm'

type Props = {
  children: ReactNode
}

export default function SearchLayout({ children }: Props) {
  return (
    <main>
      <div className="max-w-screen-md mx-auto my-2 flex justify-center items-center">
        <Link href="/">
          <Image
            src="/images/pickup-logo.png"
            alt="pickup-logo"
            className="max-w-xs cursor-pointer"
            width="2392"
            height="798"
          />
        </Link>
        <h2 className="text-2xl my-6">예산 진단 지표 분석</h2>
      </div>
      <LocalExpenditureForm />

      {children}
    </main>
  )
}
