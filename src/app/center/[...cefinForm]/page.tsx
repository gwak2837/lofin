import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { PageProps } from '../../../common/types'
import { formatPrice, formatVariationRatio } from '../../../common/utils'
import ClusteredBarChart from '../../../components/ClusteredBarChart'
import SortedBarChart from '../../../components/SortedBarChart'

async function getCefin(params: Record<string, string & string[]>) {
  const [yearFrom, yearTo, isField, rawFieldsOrSectors, rawOfficeNames, count] = params.cefinForm

  if (!yearFrom || !yearTo || !isField || !rawFieldsOrSectors || !rawOfficeNames || !count)
    return notFound()

  const fieldsOrSectors = decodeURIComponent(rawFieldsOrSectors)
  const officeNames = decodeURIComponent(rawOfficeNames)

  if (isField !== 'null' && fieldsOrSectors === '전체') return notFound()

  const searchParams = new URLSearchParams(`yearFrom=${yearFrom}&yearTo=${yearTo}`)

  if (isField !== 'null') {
    searchParams.append('isField', isField)
  }

  if (fieldsOrSectors !== '전체') {
    for (const fieldOrSector of fieldsOrSectors.split(',')) {
      searchParams.append('fieldsOrSectors', fieldOrSector)
    }
  }

  if (officeNames !== '전체') {
    for (const officeName of officeNames.split(',')) {
      searchParams.append('officeNames', officeName)
    }
  }

  if (count !== '30') {
    searchParams.append('count', count)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure/center?${searchParams}`)
  if (response.status === 404) notFound()
  else if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

export default async function CenterExpenditurePage({ params }: PageProps) {
  const cefin = await getCefin(params)

  const amchart = cefin.map((c: any) => ({
    ...c,
    y_yy_dfn_medi_kcur_amt: c.y_yy_dfn_medi_kcur_amt / 1_000_000,
    y_yy_medi_kcur_amt: c.y_yy_medi_kcur_amt / 1_000_000,
  }))

  const [yearFrom, yearTo, isField, rawFieldsOrSectors, rawOfficeNames, count] = params.cefinForm
  const fieldsOrSectors = decodeURIComponent(rawFieldsOrSectors)
  const officeNames = decodeURIComponent(rawOfficeNames)
  const isSameYear = yearFrom === yearTo
  const isMultiFieldOrSector = fieldsOrSectors.split(',').length !== 1
  const isMultiOfficeNames = officeNames.split(',').length !== 1

  return officeNames === '전체' ? (
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
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold ">
                <div className="flex gap-2 justify-center items-center">
                  국회확정금액
                  <Image src="/images/down-arrow.png" alt="Down Arrow" width="12" height="12" />
                </div>
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
              <Link
                key={i}
                href={`/center/${yearFrom}/${yearTo}/${isField}/${fieldsOrSectors}/${a.offc_nm}/${count}`}
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
    </>
  ) : (
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
              {isMultiOfficeNames && (
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  소관
                </th>
              )}
              {!isSameYear && (
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  기간
                </th>
              )}
              {(isField === 'null' || (isField === 'true' && isMultiFieldOrSector)) && (
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  분야
                </th>
              )}
              {(isField === 'null' || (isField === 'false' && isMultiFieldOrSector)) && (
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  부문
                </th>
              )}
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
            {(cefin as any[]).map((a, i) => (
              <Link key={a.id} href={`/business/true/${a.id}/0`} legacyBehavior>
                <tr className="cursor-pointer hover:bg-slate-100">
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2">{a.sactv_nm}</td>
                  {isMultiOfficeNames && <td className="p-2 text-center">{a.offc_nm}</td>}
                  {!isSameYear && <td className="p-2 text-center">{a.fscl_yyyy}</td>}
                  {(isField === 'null' || (isField === 'true' && isMultiFieldOrSector)) && (
                    <td className="p-2 text-center">{a.fld_nm}</td>
                  )}
                  {(isField === 'null' || (isField === 'false' && isMultiFieldOrSector)) && (
                    <td className="p-2 text-center">{a.sect_nm}</td>
                  )}
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
