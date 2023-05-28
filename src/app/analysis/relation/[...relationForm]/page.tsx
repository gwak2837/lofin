import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'

async function getDistrictAnalysis(params: Record<string, string & string[]>) {
  const [localCode, localDateFrom, localDateTo, centerYear, isLocalRealm] = params.relationForm

  if (!localCode || !localDateFrom || !localDateTo || !centerYear || !isLocalRealm)
    return notFound()

  const searchParams = new URLSearchParams(
    `localCode=${localCode}&localDateFrom=${localDateFrom}&localDateTo=${localDateTo}&centerYear=${centerYear}&isLocalRealm=${isLocalRealm}`
  )
  console.log('👀 ~ searchParams:', searchParams.toString())

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/analysis/relation?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response | null
}

export default async function RelationAnalysisPage({ params }: PageProps) {
  const flowAnalysis = await getDistrictAnalysis(params)

  return (
    <div className="">
      <main className="">
        <pre className="overflow-x-scroll">{JSON.stringify(flowAnalysis, null, 2)}</pre>
      </main>
    </div>
  )
}
