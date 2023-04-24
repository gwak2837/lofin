import Link from 'next/link'
import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { PageProps } from '../../../../../common/types'
import { formatPrice } from '../../../../../common/utils'
import ExpenditureRowLink from './ExpenditureRowLink'
import SemiCirclePieChart from './SemiCirclePieChart'
import HorizontalBarGraph from './SortedBarChart'

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
      {localExpenditures && <h2 className="text-2xl m-6 text-center">지역예산진단</h2>}

      {localExpenditures && typeof localExpenditures === 'object' ? (
        <>
          <h3 className="text-xl mt-6 text-center">분야별 예산현액 합계</h3>
          <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
          <HorizontalBarGraph data={localExpenditures.expenditures} />
          <SemiCirclePieChart id="local-expenditure" data={localExpenditures.expenditures} />

          <h3 className="text-xl m-6 text-center">분야별 상세 세출현황</h3>
          <div className="overflow-x-auto">
            <table className="w-full my-2 whitespace-nowrap">
              <thead>
                <tr>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    순위
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    분야
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    예산현액
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    국비
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    시도비
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    시군구비
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    기타
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    지출액
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    편성액
                  </th>
                </tr>
              </thead>
              <tbody>
                {localExpenditures.expenditures.map((expenditure, i) => (
                  <ExpenditureRowLink key={i} expenditure={expenditure} i={i} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center">{localExpenditures}</div>
      )}
    </>
  )
}
