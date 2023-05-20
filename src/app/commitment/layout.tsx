import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

import CommitmentForm from './CommitmentForm'

type Props = {
  children: ReactNode
}

export default function CommitmentLayout({ children }: Props) {
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
        <Link href="/local" className="hover:no-underline focus:no-underline">
          <h2 className="text-2xl whitespace-nowrap text-black ">후보자 공약</h2>
        </Link>
      </div>

      <CommitmentForm />

      {children}
    </main>
  )
}
