import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'
import StackedColumnChart from '../../../../components/StackedColumnChart'

async function getFlowAnalysis(params: Record<string, string & string[]>) {
  const [year, localCode, isRealm, centerRealmOrSector, localRealmOrSector] = params.flowForm

  if (!localCode || !isRealm || !centerRealmOrSector || !localRealmOrSector || !year)
    return notFound()

  const searchParams = new URLSearchParams(
    `localCode=${localCode}&isRealm=${isRealm}&centerRealmOrSector=${centerRealmOrSector}&localRealmOrSector=${localRealmOrSector}&year=${year}`
  )

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/analysis/flow?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

export default async function FlowAnalysisPage({ params }: PageProps) {
  const flowAnalysis = await getFlowAnalysis(params)

  const data = [
    { type: '중앙정부 분야별 예산' },
    {
      type: '지자체 분야별 예산',
      국비: Math.floor(+flowAnalysis.lofin.국비 / 1_000_000),
      시도비: Math.floor(+flowAnalysis.lofin.시도비 / 1_000_000),
      시군구비: Math.floor(+flowAnalysis.lofin.시군구비 / 1_000_000),
      기타: Math.floor(+flowAnalysis.lofin.기타 / 1_000_000),
    },
  ]

  const valueFields = ['국비', '시도비', '시군구비', '기타']

  for (const cefin of flowAnalysis.cefin) {
    valueFields.push(cefin.offc_nm)
    ;(data as any)[0][cefin.offc_nm] = Math.floor(+cefin.y_yy_dfn_medi_kcur_amt / 1_000)
  }

  console.log('👀 ~ data:', data)

  return (
    <div className="">
      <main className="">
        <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
        <StackedColumnChart
          data={data}
          id="flow-analysis"
          keyField="type"
          valueFields={valueFields}
        />
      </main>
    </div>
  )
}
