import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { PageProps } from '../../../../../common/types'
import { formatPrice } from '../../../../../common/utils'

async function getExpenditures(params?: Record<string, any>) {
  if (!params) return null

  const localCode = params.localCode
  const date = params.date
  const count = params.count
  const projectCodes = params.projectCodes as string[]

  if (!localCode || !count || !date || !projectCodes || projectCodes.length === 0) return null

  const projectCodesString = projectCodes
    .map((projectCode) => `projectCodes=${projectCode}`)
    .join('&')

  const url = `${NEXT_PUBLIC_BACKEND_URL}/expenditure?localCode=${localCode}&date=${date}&${projectCodesString}&count=${count}`
  const response = await fetch(url)

  // not working: if (!response.ok) throw new Error('Failed to fetch data')
  if (!response.ok) return null

  return (await response.json()) as any[]
}

export default async function HomePage({ params }: PageProps) {
  const expenditures = await getExpenditures(params)

  return (
    <>
      {expenditures && expenditures[0] && (
        <>
          <h2 className="text-2xl m-6 text-center">결과</h2>
          <h3 className="text-xl m-4">지역: {expenditures[0].wdr_sfrnd_code_nm}</h3>
          <h3 className="text-xl m-4">
            집행일자: {new Date(expenditures[0].excut_de).toISOString().slice(0, 10)}
          </h3>
          <div className="overflow-x-auto h-screen">
            <table className="w-full my-2 whitespace-nowrap">
              <thead>
                <tr>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    순위
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    자치단체
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    회계구분
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    세부사업
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
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    분야
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    부문
                  </th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((expenditure, i) => (
                  <tr key={expenditure.id}>
                    <td className="p-2 text-center">{i + 1}</td>
                    <td className="p-2 text-center">{expenditure.sfrnd_nm_korean}</td>
                    <td className="p-2 text-center">{expenditure.accnut_se_nm}</td>
                    <td className="p-2 text-center">{expenditure.detail_bsns_nm}</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.budget_crntam)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.nxndr)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.cty)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.signgunon)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.etc_crntam)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.expndtram)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.orgnztnam)}원</td>
                    <td className="p-2 text-center">{expenditure.realm_nm}</td>
                    <td className="p-2 text-center">{expenditure.sect_nm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
