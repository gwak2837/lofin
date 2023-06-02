import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../../../common/constants'
import { PageProps } from '../../../../../../../common/types'
import StackedBarChart from './StackedBarChart'

type Response = {
  expenditures: any[]
}

async function getLocalExpendituresByProject(params: Record<string, string & string[]>) {
  const { dateFrom, dateTo, localCode, projectCode, count } = params

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (localCode !== '0') {
    searchParams.append('localCode', localCode)
  }

  if (count && count !== '20') {
    searchParams.append('count', count)
  }

  if (projectCode && projectCode !== '0') {
    searchParams.append('realmCode', projectCode)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure/local/realm?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response | null
}

export default async function LocalExpendituresByProjectPage({ params }: PageProps) {
  const localExpenditures = await getLocalExpendituresByProject(params)

  return (
    localExpenditures && (
      <>
        <h2 className="text-2xl mt-6 text-center">세부사업별 예산현액</h2>
        <h5 className="text-sm mt-2 text-center">단위: 백만</h5>

        <StackedBarChart data={localExpenditures.expenditures} />
      </>
    )
  )
}
