import fetch from 'node-fetch'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../../../common/constants'
import { PageProps } from '../../../../../../../common/types'
import { formatPrice } from '../../../../../../../common/utils'
import EvaluationForm from '../../../../../EvaluationForm'

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
      <h2 className="text-2xl m-6 text-center">SMART ??????</h2>
      <EvaluationForm />

      <h2 className="text-2xl m-6 text-center">??????</h2>

      {(localGov || centerGov) && <h2 className="text-2xl m-6 text-center">?????? ??????</h2>}

      {centerGov && typeof centerGov === 'object' ? (
        <>
          <h3 className="text-xl m-4">?????????????????? ??????</h3>
          <div className="overflow-x-auto">
            <table className="w-full my-2 whitespace-nowrap">
              <thead>
                <tr>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ???????????????????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ?????????????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ???????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????????????????
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

      {localGov && typeof localGov === 'object' ? (
        <>
          <h3 className="text-xl m-4">?????????????????? ??????</h3>
          <div className="overflow-x-auto h-screen">
            <table className="w-full my-2 whitespace-nowrap">
              <thead>
                <tr>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ?????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ????????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ?????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ?????????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    ??????
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
                    <td className="p-2 text-right">{formatPrice(expenditure.budget_crntam)}???</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.nxndr)}???</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.cty)}???</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.signgunon)}???</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.etc_crntam)}???</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.expndtram)}???</td>
                    <td className="p-2 text-right">{formatPrice(expenditure.orgnztnam)}???</td>
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
    </>
  )
}
