import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'
import StackedColumnChart from '../../../../components/StackedColumnChart'

async function getFlowAnalysis(params: Record<string, string & string[]>) {
  const [dateFrom, dateTo, centerRealmOrSectors, localRealmOrSectors, isRealm, criteria] =
    params.flowForm

  if (!dateFrom || !dateTo || !centerRealmOrSectors || !localRealmOrSectors) return notFound()

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  for (const centerRealmOrSector of centerRealmOrSectors.split(',')) {
    searchParams.append('centerRealmOrSector', centerRealmOrSector)
  }

  for (const localRealmOrSector of localRealmOrSectors.split(',')) {
    searchParams.append('localRealmOrSector', localRealmOrSector)
  }

  if (isRealm !== 'false') {
    searchParams.append('isRealm', isRealm)
  }

  if (criteria !== 'sido') {
    searchParams.append('criteria', criteria)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/amchart/flow?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

export default async function FlowAnalysisPage({ params }: PageProps) {
  const flowAnalysis = await getFlowAnalysis(params)

  const cefinBullets = Object.keys(flowAnalysis[0]).filter((k) => k !== 'seriesName')
  const lofinBullets = Object.keys(flowAnalysis[1]).filter((k) => k !== 'seriesName')

  return (
    <div className="">
      <main className="">
        <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
        <StackedColumnChart
          data={flowAnalysis}
          id="flow-analysis"
          keyField="seriesName"
          valueFields={[...cefinBullets, ...lofinBullets]}
        />
      </main>
    </div>
  )
}
