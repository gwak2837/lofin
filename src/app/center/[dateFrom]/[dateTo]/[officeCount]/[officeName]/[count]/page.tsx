import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../../../common/constants'
import { PageProps } from '../../../../../../../common/types'
import SortedBarChart from './SortedBarChart'

type Response = {
  expenditures: any[]
}

async function getCenterExpendituresByOffice(params: Record<string, string & string[]>) {
  const { dateFrom, dateTo, officeName, count } = params

  const searchParams = new URLSearchParams(
    `dateFrom=${dateFrom}&dateTo=${dateTo}&officeName=${decodeURIComponent(officeName)}`
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
  console.log('👀 ~ centerExpenditures:', centerExpenditures)

  return (
    <>
      {centerExpenditures && (
        <>
          <h2 className="text-2xl mt-6 text-center">세부사업별 국회확정금액</h2>
          <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
        </>
      )}

      {centerExpenditures && typeof centerExpenditures === 'object' ? (
        <SortedBarChart id="123" data={centerExpenditures.expenditures} />
      ) : (
        <div className="text-center">{centerExpenditures}</div>
      )}
    </>
  )
}
