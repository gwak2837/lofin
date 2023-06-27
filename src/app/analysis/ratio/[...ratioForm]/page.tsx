import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'
import FullyStackedBarChart from '../../../../components/FullyStackedBarChart'

type Response = {
  lofin: Record<string, any>[]
  cefin: Record<string, any>[]
}

async function getRatioAnalytics(params: Record<string, string & string[]>) {
  const [dateFrom, dateTo, localCode, isField] = params.ratioForm
  if (!dateFrom || !dateTo || !localCode || !isField) return notFound()

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (localCode !== '0') {
    searchParams.append('localCode', localCode)
  }

  if (isField !== 'false') {
    searchParams.append('isField', isField)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/analytics/ratio?${searchParams}`)
  if (response.status === 404) notFound()
  else if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response
}

export default async function RatioAnalyticsPage({ params }: PageProps) {
  const ratioAnalytics = await getRatioAnalytics(params)

  return (
    <>
      <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
      <FullyStackedBarChart id="ratioAnalytics" data={ratioAnalytics} keyField="type" />
      {/* <pre className="overflow-x-scroll">{JSON.stringify(ratioAnalytics, null, 2)}</pre> */}
    </>
  )
}
