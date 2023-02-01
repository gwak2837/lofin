import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../common/constants'
import { PageProps } from '../common/types'
import { formatPrice } from '../common/utils'
import SearchForm from './SearchForm'

async function getExpenditures(searchParams?: Record<string, any>) {
  if (!searchParams) return null

  const localCode = searchParams.localCode
  const date = searchParams.date
  const projectCodes = searchParams.projectCodes as string[] | undefined
  const count = searchParams.count

  if (!localCode || !date || !projectCodes || projectCodes.length === 0) return null

  const projectCodesString = projectCodes
    .map((projectCode) => `projectCodes=${projectCode}`)
    .join('&')
  const countString = count ? `&count=${count}` : ''

  const url = `${NEXT_PUBLIC_BACKEND_URL}/expenditure?localCode=${localCode}&date=${date}&${projectCodesString}${countString}`
  return (await (await fetch(url)).json()) as any[]
}

export default async function HomePage({ searchParams }: PageProps) {
  const expenditures = await getExpenditures(searchParams)

  return (
    <main>
      <h2 className="text-2xl m-6 text-center">검색</h2>

      <SearchForm />

      {expenditures && (
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
                  <th>순위</th>
                  <th>자치단체</th>
                  <th>회계구분</th>
                  <th>세부사업</th>
                  <th>예산현액</th>
                  <th>국비</th>
                  <th>시도비</th>
                  <th>시군구비</th>
                  <th>기타</th>
                  <th>지출액</th>
                  <th>편성액</th>
                  <th>분야</th>
                  <th>부문</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((expenditure, i) => (
                  <tr key={expenditure.id}>
                    <td className="text-center">{i + 1}</td>
                    <td className="text-center">{expenditure.sfrnd_nm_korean}</td>
                    <td className="text-center">{expenditure.accnut_se_nm}</td>
                    <td className="text-center">{expenditure.detail_bsns_nm}</td>
                    <td className="text-right">{formatPrice(expenditure.budget_crntam)}원</td>
                    <td className="text-right">{formatPrice(expenditure.nxndr)}원</td>
                    <td className="text-right">{formatPrice(expenditure.cty)}원</td>
                    <td className="text-right">{formatPrice(expenditure.signgunon)}원</td>
                    <td className="text-right">{formatPrice(expenditure.etc_crntam)}원</td>
                    <td className="text-right">{formatPrice(expenditure.expndtram)}원</td>
                    <td className="text-right">{formatPrice(expenditure.orgnztnam)}원</td>
                    <td className="text-center">{expenditure.realm_nm}</td>
                    <td className="text-center">{expenditure.sect_nm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  )
}
