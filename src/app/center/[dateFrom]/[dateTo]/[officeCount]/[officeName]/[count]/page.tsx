import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../../../common/constants'
import { PageProps } from '../../../../../../../common/types'
import SortedBarChart from '../../../../../../../components/SortedBarChart'

type Response = {
  expenditures: any[]
}

async function getCenterExpendituresByOffice(params: Record<string, string & string[]>) {
  const { dateFrom, dateTo, officeName, count } = params
  console.log('👀 ~ officeName:', officeName)

  const searchParams = new URLSearchParams(
    `dateFrom=${dateFrom}&dateTo=${dateTo}&officeName=${officeName}`
  )

  if (count !== '30') {
    searchParams.append('count', count)
  }

  const response = await fetch(
    `${NEXT_PUBLIC_BACKEND_URL}/expenditure/center/office?${searchParams}`
  )
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response | null
}

export default async function CenterExpendituresByOfficePage({ params }: PageProps) {
  const centerExpenditures = await getCenterExpendituresByOffice(params)

  const data = centerExpenditures?.expenditures.map((expenditure) => ({
    sactv_nm: expenditure.sactv_nm,
    y_yy_dfn_medi_kcur_amt_sum: Math.floor(+expenditure.y_yy_dfn_medi_kcur_amt_sum / 1_000),
  }))

  return (
    <>
      {centerExpenditures && (
        <>
          <h2 className="text-2xl mt-6 text-center">세부사업별 국회확정금액</h2>
          <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
        </>
      )}

      {data && (
        <SortedBarChart
          id="123"
          data={data}
          keyField="sactv_nm"
          valueField="y_yy_dfn_medi_kcur_amt_sum"
        />
      )}
    </>
  )
}
