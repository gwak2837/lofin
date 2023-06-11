import Image from 'next/image'
import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { PageProps } from '../../../../../common/types'
import Charts from './Charts'
import ExpenditureRowLink from './ExpenditureRowLink'

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
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response
}

export default async function LocalExpendituresPage({ params }: PageProps) {
  const localExpenditures = await getLocalExpenditures(params)

  const a = localExpenditures.expenditures.reduce((acc, cur) => acc + +cur.orgnztnam_sum, 0)
  console.log('👀 ~ a:', a)

  return (
    <>
      {localExpenditures && (
        <>
          <h2 className="text-2xl m-6 text-center">지역예산진단</h2>
          <Charts expenditures={localExpenditures.expenditures} />

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
                    국비 비율
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold flex gap-2 justify-center items-center">
                    예산현액
                    <Image src="/images/down-arrow.png" alt="Down Arrow" width="12" height="12" />
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
      )}
    </>
  )
}
