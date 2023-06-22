import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

import CefinForm from './CefinForm'

type Props = {
  children: ReactNode
}

export default function CenterExpenditureLayout({ children }: Props) {
  return (
    <main>
      <div className="max-w-screen-md mx-auto my-2 flex flex-wrap justify-center items-center">
        <Link href="/">
          <Image
            src="/images/logo.webp"
            alt="jikida-logo"
            className="max-w-xs cursor-pointer"
            width="240"
            height="108"
          />
        </Link>
        <Link href="/center" className="hover:no-underline focus:no-underline">
          <h2 className="text-2xl whitespace-nowrap text-black ">중앙정부 예산 도출</h2>
        </Link>
      </div>

      <CefinForm />

      {children}
    </main>
  )
}
