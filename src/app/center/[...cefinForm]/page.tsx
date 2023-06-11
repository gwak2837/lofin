import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { PageProps } from '../../../common/types'
import { formatPrice, formatVariationRatio } from '../../../common/utils'
import ClusteredBarChart from '../../../components/ClusteredBarChart'
import SortedBarChart from '../../../components/SortedBarChart'

async function getCefin(params: Record<string, string & string[]>) {
  const [yearFrom, yearTo, isField, fieldsOrSectors, count, officeNames] = params.cefinForm
  if (!yearFrom || !yearTo) return notFound()

  const searchParams = new URLSearchParams(`yearFrom=${yearFrom}&yearTo=${yearTo}`)

  if (isField !== 'null') {
    searchParams.append('isField', isField)
  }

  if (fieldsOrSectors !== 'null') {
    for (const fieldOrSector of decodeURIComponent(fieldsOrSectors).split(',')) {
      searchParams.append('fieldsOrSectors', fieldOrSector)
    }
  }

  if (count !== '30') {
    searchParams.append('count', count)
  }

  if (officeNames && officeNames !== 'null') {
    for (const officeName of decodeURIComponent(officeNames).split(',')) {
      searchParams.append('officeNames', officeName)
    }
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure/center?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

export default async function CenterExpenditurePage({ params }: PageProps) {
  const cefinForm = params.cefinForm.join('/')
  const officeNames = params.cefinForm[5]

  const { cefin, amchart } = await getCefin(params)

  return officeNames ? (
    <>
      <h2 className="text-2xl mt-6 text-center">세부사업별 예산</h2>
      <h5 className="text-sm mt-2 text-center">단위: 백만</h5>

      <SortedBarChart
        id="123"
        data={amchart}
        keyField="sactv_nm"
        valueField="y_yy_dfn_medi_kcur_amt"
      />

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
                국회확정금액
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
            {(cefin as any[]).map((a, i) => (
              <tr key={i}>
                <td className="p-2 text-center">{i + 1}</td>
                <td className="p-2 text-center">{a.sactv_nm}</td>
                <td className="p-2 text-right">{formatPrice(+a.y_yy_dfn_medi_kcur_amt)}원</td>
                <td className="p-2 text-right">{formatPrice(+a.y_yy_medi_kcur_amt)}원</td>
                <td className="p-2 text-right">
                  {formatVariationRatio(+a.y_yy_dfn_medi_kcur_amt, +a.y_yy_medi_kcur_amt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <>
      <h2 className="text-2xl mt-12 mb-6 text-center">중앙정부 소관별 예산</h2>
      <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
      <ClusteredBarChart
        id="cluster"
        data={amchart}
        keyField="offc_nm"
        valueFields={[
          ['y_yy_dfn_medi_kcur_amt', '국회확정금액'],
          ['y_yy_medi_kcur_amt', '정부안금액'],
        ]}
      />

      <h2 className="text-2xl mt-12 mb-6 text-center">중앙정부 소관별 상세 예산</h2>
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
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                국회확정금액
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
            {(cefin as any[]).map((a, i) => (
              <Link key={i} href={`/center/${cefinForm}/${a.offc_nm}`} legacyBehavior>
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
    </>
  )
}
