import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'

async function getCommitments(params: Record<string, string & string[]>) {
  const [basisDate, rawFiscalYears, rawLocalCodes] = params.commitmentForm

  if (!basisDate || !rawFiscalYears || !rawLocalCodes) return notFound()

  const fiscalYears = decodeURIComponent(rawFiscalYears)
  const localCodes = decodeURIComponent(rawLocalCodes)

  const searchParams = new URLSearchParams()

  if (basisDate !== '2023-03-31') {
    searchParams.append('basisDate', basisDate)
  }

  if (fiscalYears !== '0') {
    for (const fiscalYear of fiscalYears.split(',')) {
      searchParams.append('fiscalYears', fiscalYear)
    }
  }

  if (localCodes !== '0') {
    for (const localCode of localCodes.split(',')) {
      searchParams.append('localCodes', localCode)
    }
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/commitment?${searchParams}`)
  if (response.status === 404) notFound()
  else if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

export default async function Page({ params }: PageProps) {
  const commitments = await getCommitments(params)

  return (
    <div className="">
      <pre className="overflow-x-scroll">{JSON.stringify(commitments, null, 2)}</pre>
    </div>
  )
}
