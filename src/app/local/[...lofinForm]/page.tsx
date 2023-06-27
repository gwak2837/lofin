import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { PageProps } from '../../../common/types'
import { formatPrice, formatRatio } from '../../../common/utils'
import Charts from './Charts'
import StackedBarChart from './StackedBarChart'

type Response = {
  expenditures: any[]
}

async function getLofin(params: Record<string, string & string[]>) {
  const [dateFrom, dateTo, rawLocalCodes, rawFieldCodes, count] = params.lofinForm

  if (!dateFrom || !dateTo || !rawLocalCodes || !rawFieldCodes || !count) return notFound()

  const localCodes = decodeURIComponent(rawLocalCodes)
  const fieldCodes = decodeURIComponent(rawFieldCodes)

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (localCodes !== '0') {
    for (const localCode of localCodes.split(',')) {
      searchParams.append('localCodes', localCode)
    }
  }

  if (fieldCodes !== '0') {
    for (const fieldCode of fieldCodes.split(',')) {
      searchParams.append('fieldCodes', fieldCode)
    }
  }

  if (fieldCodes !== '0' && count !== '20') {
    searchParams.append('count', count)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure/local?${searchParams}`)
  if (response.status === 404) notFound()
  else if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response
}

export default async function Page({ params }: PageProps) {
  const lofin = await getLofin(params)

  const [dateFrom, dateTo, localCodes, fieldCodes, count] = params.lofinForm
  const isManyYears = dateFrom.slice(0, 4) !== dateTo.slice(0, 4)
  const isManyLocalCodes = decodeURIComponent(localCodes).split(',').length > 1
  const isManyFieldCodes = decodeURIComponent(fieldCodes).split(',').length > 1

  return fieldCodes === '0' ? (
    <>
      <h2 className="text-2xl m-6 text-center">지역예산진단</h2>
      <Charts expenditures={lofin.expenditures} />

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
            {lofin.expenditures.map((expenditure, i) => (
              <Link
                key={i}
                href={`/local/${dateFrom}/${dateTo}/${localCodes}/${expenditure.realm_code}/${count}`}
                legacyBehavior
              >
                <tr className="cursor-pointer hover:bg-slate-100">
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2 text-center">{expenditure.realm}</td>
                  <td className="p-2 text-right">
                    {formatRatio(+expenditure.nxndr_sum, +expenditure.budget_crntam_sum)}
                  </td>
                  <td className="p-2 text-right">{formatPrice(expenditure.budget_crntam_sum)}원</td>
                  <td className="p-2 text-right">{formatPrice(expenditure.nxndr_sum)}원</td>
                  <td className="p-2 text-right">{formatPrice(expenditure.cty_sum)}원</td>
                  <td className="p-2 text-right">{formatPrice(expenditure.signgunon_sum)}원</td>
                  <td className="p-2 text-right">{formatPrice(expenditure.etc_crntam_sum)}원</td>
                  <td className="p-2 text-right">{formatPrice(expenditure.expndtram_sum)}원</td>
                  <td className="p-2 text-right">{formatPrice(expenditure.orgnztnam_sum)}원</td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <>
      <h2 className="text-2xl mt-6 text-center">세부사업별 예산현액</h2>
      <h5 className="text-sm mt-2 text-center">단위: 백만</h5>

      <StackedBarChart data={lofin.expenditures} />

      <h2 className="text-2xl mt-12 mb-6 text-center">세부사업별 상세 예산</h2>
      <div className="overflow-x-auto">
        <table className="w-full my-2 whitespace-nowrap">
          <thead>
            <tr>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                순위
              </th>
              {isManyLocalCodes && (
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  지자체
                </th>
              )}
              {isManyYears && (
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  년도
                </th>
              )}
              {isManyFieldCodes && (
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  분야
                </th>
              )}
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                사업명
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
            {(lofin.expenditures as any[]).map((a, i) => (
              <Link key={a.id} href={`/business/false/${a.id}/0`} legacyBehavior>
                <tr className="cursor-pointer hover:bg-slate-100">
                  <td className="p-2 text-center">{i + 1}</td>
                  {isManyLocalCodes && <td className="p-2 text-center">{a.sfrnd_nm}</td>}
                  {isManyYears && (
                    <td className="p-2 text-center">{new Date(a.excut_de).getFullYear()}</td>
                  )}
                  {isManyFieldCodes && <td className="p-2 text-center">{a.field}</td>}
                  <td className="p-2">{a.detailBusinessName}</td>
                  <td className="p-2 text-right">{formatRatio(+a.nxndrSum, +a.budgetSum)}</td>
                  <td className="p-2 text-right">{formatPrice(+a.budgetSum)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.nxndrSum)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.citySum)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.sigunguSum)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.etcSum)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.expndtramSum)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.organizationSum)}원</td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
