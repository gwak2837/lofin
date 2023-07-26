import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import CommitmentForm from './CommitmentForm'

async function getCommitmentFormOptions() {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/commitment/option?electionCategory=1`)
  if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

type Props = {
  children: ReactNode
}

export default async function Layout({ children }: Props) {
  const commitmentOptions = await getCommitmentFormOptions()

  return (
    <main>
      <div className="max-w-screen-md mx-auto my-2 flex gap-3 flex-wrap justify-center items-center">
        <Link href="/">
          <Image
            src="/images/logo.webp"
            alt="jikida-logo"
            className="max-w-xs cursor-pointer"
            width="240"
            height="108"
          />
        </Link>
        <Link href="/commitment/edu" className="hover:no-underline focus:no-underline">
          <h1 className="text-3xl whitespace-nowrap text-black ">교육감 공약 예산</h1>
        </Link>
      </div>

      <CommitmentForm options={commitmentOptions} />

      {children}
    </main>
  )
}
