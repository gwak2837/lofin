import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import CommitmentForm from './CommitmentForm'

async function getElectionOptions() {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/candidate`)
  if (!response.ok) throw new Error(await response.text())

  const result = await response.json()

  return result.candidates.map((candidate: any) => {
    const { id, sgId, sgName, sigunguName, sidoName, wiwName, partyName, krName } = candidate

    const partyName_ = partyName ? partyName + ' ' : ''
    const sigungu_ = wiwName || sidoName !== sigunguName ? sigunguName + ' ' : ''

    return {
      label: `${partyName_}${krName}: ${sgId} ${sidoName} ${sigungu_}${sgName}`,
      value: id,
    }
  })
}

type Props = {
  children: ReactNode
}

export default async function CommitmentLayout({ children }: Props) {
  const electionOptions = await getElectionOptions()

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
        <Link href="/commitment/candidate" className="hover:no-underline focus:no-underline">
          <h2 className="text-2xl whitespace-nowrap text-black ">후보자 공약</h2>
        </Link>
      </div>

      <CommitmentForm electionOptions={electionOptions} />

      {children}
    </main>
  )
}
