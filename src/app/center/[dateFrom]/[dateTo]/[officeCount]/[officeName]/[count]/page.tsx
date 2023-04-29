import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../../../common/constants'
import { PageProps } from '../../../../../../../common/types'
import StackedBarChart from './StackedBarChart'

type Response = {
  expenditures: any[]
}

async function getLocalExpendituresByProject(params: Record<string, string & string[]>) {
  const { dateFrom, dateTo, officeName, count } = params

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (officeName !== '전체') {
    searchParams.append('officeName', officeName)
  }

  if (count && count !== '20') {
    searchParams.append('count', count)
  }

  const response = await fetch(
    `${NEXT_PUBLIC_BACKEND_URL}/expenditure/center/office?${searchParams}`
  )

  // if (!response.ok) throw new Error('Failed to fetch data') // `yarn build` not works
  if (!response.ok) return JSON.parse(await response.text()).message as string

  return (await response.json()) as Response | null
}

export default async function LocalExpendituresByProjectPage({ params }: PageProps) {
  const localExpenditures = await getLocalExpendituresByProject(params)

  return (
    <>
      {localExpenditures && (
        <>
          <h2 className="text-2xl mt-6 text-center">세부사업별 예산현액</h2>
          <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
        </>
      )}

      {localExpenditures && typeof localExpenditures === 'object' ? (
        <StackedBarChart data={localExpenditures.expenditures} />
      ) : (
        <div className="text-center">{localExpenditures}</div>
      )}
    </>
  )
}
