import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'

async function getFlowAnalysis(params: Record<string, string & string[]>) {
  const [year, localCode, isRealm, centerRealmOrSector, localRealmOrSector] = params.flowForm

  if (!localCode || !isRealm || !centerRealmOrSector || !localRealmOrSector || !year)
    return notFound()

  const searchParams = new URLSearchParams(
    `localCode=${localCode}&isRealm=${isRealm}&centerRealmOrSector=${centerRealmOrSector}&localRealmOrSector=${localRealmOrSector}&year=${year}`
  )

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/analysis/flow?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response | null
}

export default async function FlowAnalysisPage({ params }: PageProps) {
  const flowAnalysis = await getFlowAnalysis(params)

  return (
    <div className="">
      <main className="">
        <pre className="overflow-x-scroll">{JSON.stringify(flowAnalysis, null, 2)}</pre>
      </main>
    </div>
  )
}
