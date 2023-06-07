import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'
import FullyStackedBarChart from '../../../../components/FullyStackedBarChart'

type Response = {
  lofin: Record<string, any>[]
  cefin: Record<string, any>[]
}

async function getRatioAnalysis(params: Record<string, string & string[]>) {
  const [dateFrom, dateTo, localCode, isRealm] = params.ratioForm
  if (!dateFrom || !dateTo || !localCode || !isRealm) return notFound()

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (localCode !== '0') {
    searchParams.append('localCode', localCode)
  }

  if (isRealm !== 'false') {
    searchParams.append('isRealm', isRealm)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/amchart/ratio?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response
}

export default async function RatioAnalysisPage({ params }: PageProps) {
  const ratioAnalysis = await getRatioAnalysis(params)

  return (
    <main className="">
      <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
      <FullyStackedBarChart id="ratioAnalysis" data={ratioAnalysis} keyField="type" />
      {/* <pre className="overflow-x-scroll">{JSON.stringify(ratioAnalysis, null, 2)}</pre> */}
    </main>
  )
}
