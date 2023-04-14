import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../../common/constants'
import { PageProps } from '../../../../../../common/types'

type LocalResponse = {
  dateFrom: string
  dateTo: string
  localCode: string
  isWholeProvince: boolean
  expenditures: any[]
}

async function getLocalExpenditures(params: Record<string, string & string[]>) {
  const { dateFrom, dateTo, localCode, isWholeProvince } = params

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (localCode !== '0') {
    searchParams.append('localCode', localCode)

    if (isWholeProvince === 'true') {
      searchParams.append('isWholeProvince', isWholeProvince)
    }
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure/local?${searchParams}`)

  // if (!response.ok) throw new Error('Failed to fetch data') // `yarn build` not works
  if (!response.ok) return JSON.parse(await response.text()).message as string

  return (await response.json()) as LocalResponse | null
}

export default async function LocalExpendituresPage({ params }: PageProps) {
  const localResponse = await getLocalExpenditures(params)

  return (
    <>
      {localResponse && <h2 className="text-2xl m-6 text-center">결과</h2>}

      {localResponse && typeof localResponse === 'object' ? (
        <pre>{JSON.stringify(localResponse, null, 2)}</pre>
      ) : (
        <div className="mx-auto">{localResponse}</div>
      )}
    </>
  )
}
