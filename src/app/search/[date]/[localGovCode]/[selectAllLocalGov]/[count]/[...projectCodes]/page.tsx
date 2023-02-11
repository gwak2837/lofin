import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../../../common/constants'
import { PageProps } from '../../../../../../../common/types'
import { formatPrice } from '../../../../../../../common/utils'

type LocalGovResponse = {
  date: string
  expenditures: any[]
}

async function getLocalGov(params: Record<string, string & string[]>) {
  const { date, localGovCode, selectAllLocalGov, count, projectCodes } = params

  const searchParams = new URLSearchParams(`date=${date}`)

  if (localGovCode !== 'null') {
    searchParams.append('localGovCode', localGovCode)

    if (selectAllLocalGov === 'true') {
      searchParams.append('selectAllLocalGov', selectAllLocalGov)
    }
  }

  if (count !== '20') {
    searchParams.append('count', count)
  }

  if (projectCodes[0] !== '000') {
    for (const projectCode of projectCodes) {
      searchParams.append('projectCodes', projectCode)
    }
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure?${searchParams}`)

  // if (!response.ok) throw new Error('Failed to fetch data') // `yarn build` not works
  if (!response.ok) return JSON.parse(await response.text()).message as string

  return (await response.json()) as LocalGovResponse | null
}

async function getCenterGov(params: Record<string, string & string[]>) {
  const { date, localGovCode, selectAllLocalGov, count, projectCodes } = params

  const searchParams = new URLSearchParams(`date=${date}`)

  if (localGovCode !== 'null') {
    searchParams.append('localGovCode', localGovCode)

    if (selectAllLocalGov === 'true') {
      searchParams.append('selectAllLocalGov', selectAllLocalGov)
    }
  }

  if (count !== '20') {
    searchParams.append('count', count)
  }

  if (projectCodes[0] !== '000') {
    for (const projectCode of projectCodes) {
      searchParams.append('projectCodes', projectCode)
    }
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure?${searchParams}`)

  // if (!response.ok) throw new Error('Failed to fetch data') // `yarn build` not works
  if (!response.ok) return JSON.parse(await response.text()).message as string

  return (await response.json()) as LocalGovResponse | null
}

export default async function SearchPage({ params }: PageProps) {
  const localResponse = getLocalGov(params)
  const centerResponse = getCenterGov(params)

  const [localGov, centerGov] = await Promise.all([localResponse, centerResponse])

  return (
    <>
      <h2 className="text-2xl m-6 text-center">SMART 평가</h2>

      {(localGov || centerGov) && <h2 className="text-2xl m-6 text-center">결과</h2>}

      {localGov && typeof localGov === 'object' ? (
        <>
          <h3 className="text-xl m-4">지방자치단체 재정</h3>
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
                {localGov.expenditures.map((expenditure, i) => (
                  <tr key={expenditure.id}>
                    <td className="p-2 text-center">{i + 1}</td>
                    <td className="p-2 text-center">{expenditure.sfrnd_name}</td>
                    <td className="p-2 text-center">{expenditure.accnut_se_nm}</td>
                    <td className="p-2 text-center">{expenditure.detail_bsns_nm}</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.budget_crntam)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.nxndr)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.cty)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.signgunon)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.etc_crntam)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.expndtram)}원</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.orgnztnam)}원</td>
                    <td className="p-2 text-center">{expenditure.realm_name}</td>
                    <td className="p-2 text-center">{expenditure.sect_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>{localGov}</div>
      )}

      {centerGov && typeof centerGov === 'object' ? (
        <>
          <h3 className="text-xl m-4">중앙행정기관 재정</h3>
          <div className="overflow-x-auto h-screen">
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
                    회계
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    계정
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    분야
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    부문
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    프로그램
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    단위사업
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    세부사업
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    경비구분
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    지출구분
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    조회기준
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    전년도국회확정금액
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    전년도최종금액
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    정부안금액
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    국회확정금액
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </>
      ) : (
        <div>{centerGov}</div>
      )}
    </>
  )
}
