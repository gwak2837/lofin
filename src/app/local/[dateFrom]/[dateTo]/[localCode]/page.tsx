import Image from 'next/image'
import Link from 'next/link'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { PageProps } from '../../../../../common/types'
import { formatPrice, formatRatio } from '../../../../../common/utils'
import Charts from './Charts'

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

  const { dateFrom, dateTo, localCode } = params

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
                  <Link
                    key={i}
                    href={`/local/${dateFrom}/${dateTo}/${localCode}/${
                      expenditure.realm_code
                    }/${20}`}
                    legacyBehavior
                  >
                    <tr className="cursor-pointer hover:bg-slate-100">
                      <td className="p-2 text-center">{i + 1}</td>
                      <td className="p-2 text-center">{expenditure.realm}</td>
                      <td className="p-2 text-right">
                        {formatRatio(+expenditure.nxndr_sum, +expenditure.budget_crntam_sum)}
                      </td>
                      <td className="p-2 text-right">
                        {formatPrice(expenditure.budget_crntam_sum)}원
                      </td>
                      <td className="p-2 text-right">{formatPrice(expenditure.nxndr_sum)}원</td>
                      <td className="p-2 text-right">{formatPrice(expenditure.cty_sum)}원</td>
                      <td className="p-2 text-right">{formatPrice(expenditure.signgunon_sum)}원</td>
                      <td className="p-2 text-right">
                        {formatPrice(expenditure.etc_crntam_sum)}원
                      </td>
                      <td className="p-2 text-right">{formatPrice(expenditure.expndtram_sum)}원</td>
                      <td className="p-2 text-right">{formatPrice(expenditure.orgnztnam_sum)}원</td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
