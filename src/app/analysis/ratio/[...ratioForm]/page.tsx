import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'

async function getDistrictAnalysis(params: Record<string, string & string[]>) {
  const [dateFrom, dateTo, localCode, isRealm] = params.ratioForm
  if (!dateFrom || !dateTo || !localCode || !isRealm) return notFound()

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (localCode !== '0') {
    searchParams.append('localCode', localCode)
  }

  if (isRealm !== 'false') {
    searchParams.append('isRealm', isRealm)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/analysis/ratio?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response | null
}

export default async function RatioAnalysisPage({ params }: PageProps) {
  const flowAnalysis = await getDistrictAnalysis(params)

  return (
    <div className="">
      <main className="">
        <pre className="overflow-x-scroll">{JSON.stringify(flowAnalysis, null, 2)}</pre>
      </main>
    </div>
  )
}
