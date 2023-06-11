import Image from 'next/image'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../../../common/constants'
import { PageProps } from '../../../../../../../common/types'
import { formatPrice, formatRatio, formatVariationRatio } from '../../../../../../../common/utils'
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

  return (await response.json()) as Response
}

export default async function LocalExpendituresByProjectPage({ params }: PageProps) {
  const localExpenditures = await getLocalExpendituresByProject(params)

  return (
    <>
      <h2 className="text-2xl mt-6 text-center">세부사업별 예산현액</h2>
      <h5 className="text-sm mt-2 text-center">단위: 백만</h5>

      <StackedBarChart data={localExpenditures.expenditures} />

      <h2 className="text-2xl mt-12 mb-6 text-center">세부사업별 상세 예산</h2>
      <div className="overflow-x-auto">
        <table className="w-full my-2 whitespace-nowrap">
          <thead>
            <tr>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                순위
              </th>
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
            {(localExpenditures.expenditures as any[]).map((a, i) => (
              <tr key={i}>
                <td className="p-2 text-center">{i + 1}</td>
                <td className="p-2 text-center">{a.detailBusinessName}</td>
                <td className="p-2 text-right">{formatRatio(+a.nxndrSum, +a.budgetSum)}</td>
                <td className="p-2 text-right">{formatPrice(+a.budgetSum)}원</td>
                <td className="p-2 text-right">{formatPrice(+a.nxndrSum)}원</td>
                <td className="p-2 text-right">{formatPrice(+a.citySum)}원</td>
                <td className="p-2 text-right">{formatPrice(+a.sigunguSum)}원</td>
                <td className="p-2 text-right">{formatPrice(+a.etcSum)}원</td>
                <td className="p-2 text-right">{formatPrice(+a.expndtramSum)}원</td>
                <td className="p-2 text-right">{formatPrice(+a.organizationSum)}원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

// {
//       detailBusinessName: '소방차량 유지관리',
//       budgetSum: '5620627000',
//       nxndrSum: '0',
//       citySum: '5620627000',
//       sigunguSum: '0',
//       etcSum: '0',
//       expndtramSum: '1674190812',
//       organizationSum: '5620627000'
//     }
