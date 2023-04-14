import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../../../common/constants'
import { PageProps } from '../../../../../../../common/types'

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
    searchParams.append('projectCode', projectCode)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure/local/realm?${searchParams}`)

  // if (!response.ok) throw new Error('Failed to fetch data') // `yarn build` not works
  if (!response.ok) return JSON.parse(await response.text()).message as string

  return (await response.json()) as Response | null
}

export default async function LocalExpendituresByProjectPage({ params }: PageProps) {
  const localExpenditures = await getLocalExpendituresByProject(params)

  return (
    <>
      {localExpenditures && <h2 className="text-2xl m-6 text-center">세부분야별 예산액</h2>}

      {localExpenditures && typeof localExpenditures === 'object' ? (
        <pre>{JSON.stringify(localExpenditures, null, 2)}</pre>
      ) : (
        <div className="text-center">{localExpenditures}</div>
      )}
    </>
  )
}
