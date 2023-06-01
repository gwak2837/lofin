import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'

async function getDistrictAnalysis(params: Record<string, string & string[]>) {
  const [year, localCode, isRealm] = params.relationForm
  if (!year || !localCode || !isRealm) return notFound()

  const searchParams = new URLSearchParams(`year=${year}&localCode=${localCode}&isRealm=${isRealm}`)

  console.log('👀 ~ searchParams:', searchParams)
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
