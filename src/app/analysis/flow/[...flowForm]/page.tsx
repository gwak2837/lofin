import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'
import { formatPrice, formatRatio, formatVariationRatio } from '../../../../common/utils'
import StackedColumnChart from '../../../../components/StackedColumnChart'

async function getFlowAnalytics(params: Record<string, string & string[]>) {
  const [dateFrom, dateTo, criteria, isField, cefinFieldsOrSectors, lofinFieldsOrSectors] =
    params.flowForm

  if (
    !dateFrom ||
    !dateTo ||
    !criteria ||
    !isField ||
    !cefinFieldsOrSectors ||
    !lofinFieldsOrSectors
  )
    return notFound()

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (isField !== 'false') {
    searchParams.append('isField', isField)
  }

  for (const cefinFieldOrSector of decodeURIComponent(cefinFieldsOrSectors).split(',')) {
    searchParams.append('centerFieldOrSector', cefinFieldOrSector)
  }

  for (const lofinFieldOrSector of decodeURIComponent(lofinFieldsOrSectors).split(',')) {
    searchParams.append('localFieldOrSector', lofinFieldOrSector)
  }

  if (criteria !== 'sido') {
    searchParams.append('criteria', criteria)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/analytics/flow?${searchParams}`)
  if (response.status === 404) notFound()
  else if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

export default async function Page({ params }: PageProps) {
  const { amchart, analytics } = await getFlowAnalytics(params)

  const centerYearFrom = params.flowForm[0].slice(0, 4)
  const centerYearTo = params.flowForm[1].slice(0, 4)
  const localDateFrom = params.flowForm[0]
  const localDateTo = params.flowForm[1]
  const isField = params.flowForm[3]
  const centerFieldOrSectors = decodeURIComponent(params.flowForm[4])
  const localFieldOrSectors = decodeURIComponent(params.flowForm[5])

  const cefinBullets = Object.keys(amchart[0]).filter((k) => k !== 'seriesName')
  const lofinBullets = Object.keys(amchart[1]).filter((k) => k !== 'seriesName')

  return (
    <>
      <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
      <StackedColumnChart
        data={amchart}
        id="amchart"
        keyField="seriesName"
        valueFields={[...cefinBullets, ...lofinBullets]}
      />

      {/* 인구수, 면적도 같이 보여주기 */}

      <h3 className="text-xl m-6 text-center">중앙정부 소관별 예산</h3>
      <div className="overflow-x-auto">
        <table className="w-full my-2 whitespace-nowrap">
          <thead>
            <tr>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                순위
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                소관
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold flex gap-2 justify-center items-center">
                국회확정금액
                <Image src="/images/down-arrow.png" alt="Down Arrow" width="12" height="12" />
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                정부안금액
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                증감율
              </th>
            </tr>
          </thead>
          <tbody>
            {(analytics.cefin as any[]).map((a, i) => (
              <Link
                key={i}
                href={`/center/${centerYearFrom}/${centerYearTo}/${isField}/${centerFieldOrSectors}/${a.offc_nm}/30`}
                legacyBehavior
              >
                <tr className="cursor-pointer hover:bg-slate-100">
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2 text-center">{a.offc_nm}</td>
                  <td className="p-2 text-right">{formatPrice(+a.y_yy_dfn_medi_kcur_amt)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.y_yy_medi_kcur_amt)}원</td>
                  <td className="p-2 text-right">
                    {formatVariationRatio(+a.y_yy_dfn_medi_kcur_amt, +a.y_yy_medi_kcur_amt)}
                  </td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="text-xl m-6 text-center">지자체별 예산</h3>
      <div className="overflow-x-auto">
        <table className="w-full my-2 whitespace-nowrap">
          <thead>
            <tr>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                순위
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                지자체
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
            {(analytics.lofin as any[]).map((a, i) => (
              <Link
                key={i}
                href={`/local/${localDateFrom}/${localDateTo}/${a.sfrnd_code}/${localFieldOrSectors}/20`}
                legacyBehavior
              >
                <tr className="cursor-pointer hover:bg-slate-100">
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2 text-center">{a.sfrnd_name}</td>
                  <td className="p-2 text-right">{formatRatio(+a.nxndr, +a.budget_crntam)}</td>
                  <td className="p-2 text-right">{formatPrice(+a.budget_crntam)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.nxndr)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.cty)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.signgunon)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.etc_crntam)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.expndtram)}원</td>
                  <td className="p-2 text-right">{formatPrice(+a.orgnztnam)}원</td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
