import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { PageProps } from '../../../../../common/types'

type Response = {
  expenditures: any[]
}

async function getLocalExpenditures(params: Record<string, string & string[]>) {
  const { dateFrom, dateTo, localCode } = params

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (localCode !== '0') {
    searchParams.append('localCode', localCode)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure/local?${searchParams}`)

  // if (!response.ok) throw new Error('Failed to fetch data') // `yarn build` not works
  if (!response.ok) return JSON.parse(await response.text()).message as string

  return (await response.json()) as Response | null
}

export default async function LocalExpendituresPage({ params }: PageProps) {
  const localExpenditures = await getLocalExpenditures(params)

  return (
    <>
      {localExpenditures && <h2 className="text-2xl m-6 text-center">결과</h2>}

      {localExpenditures && typeof localExpenditures === 'object' ? (
        <pre>{JSON.stringify(localExpenditures, null, 2)}</pre>
      ) : (
        <div className="text-center">{localExpenditures}</div>
      )}
    </>
  )
}
