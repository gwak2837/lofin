import CenterExpenditureForm from './CenterExpenditureForm'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function CenterExpenditureLayout({ children }: Props) {
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
        <h2 className="text-2xl whitespace-nowrap">중앙 부처 사업 도출</h2>
      </div>
      <CenterExpenditureForm />

      {children}
    </main>
  )
}
