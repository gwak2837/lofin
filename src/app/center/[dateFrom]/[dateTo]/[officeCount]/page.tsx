import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { PageProps } from '../../../../../common/types'
import ClusteredBarChart from '../../../../../components/ClusteredBarChart'
import ExpenditureRowLink from './ExpenditureRowLink'

type Response = {
  expenditures: any[]
}

async function getCenterExpenditures(params: Record<string, string & string[]>) {
  const { dateFrom, dateTo, officeCount } = params

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (officeCount !== '30') {
    searchParams.append('count', officeCount)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/expenditure/center?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response | null
}

export default async function CenterExpenditurePage({ params }: PageProps) {
  const centerExpenditures = await getCenterExpenditures(params)
  const chartData =
    centerExpenditures?.expenditures.map((expenditure) => ({
      offc_nm: expenditure.offc_nm,
      y_prey_first_kcur_amt_sum: Math.floor(+expenditure.y_prey_first_kcur_amt_sum / 1000),
      y_yy_dfn_medi_kcur_amt_sum: Math.floor(+expenditure.y_yy_dfn_medi_kcur_amt_sum / 1000),
      y_yy_medi_kcur_amt_sum: Math.floor(+expenditure.y_yy_medi_kcur_amt_sum / 1000),
    })) ?? []

  return (
    <>
      {centerExpenditures ? (
        <>
          <h2 className="text-2xl mt-6 text-center">중앙부처예산진단</h2>
          <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
          <ClusteredBarChart
            id="cluster"
            data={chartData}
            keyField="offc_nm"
            valueFields={[
              ['y_yy_dfn_medi_kcur_amt_sum', '국회확정금액'],
              ['y_yy_medi_kcur_amt_sum', '정부안금액'],
              ['y_prey_first_kcur_amt_sum', '전년도국회확정금액'],
            ]}
          />

          <h3 className="text-xl mt-6 text-center">소관별 상세 예산편성현황</h3>
          <h5 className="text-sm mt-2 text-center">단위: 백만</h5>
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
                    전년도최종금액
                  </th>
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    전년도국회확정금액
                  </th>
                </tr>
              </thead>
              <tbody>
                {centerExpenditures.expenditures.map((expenditure, i) => (
                  <ExpenditureRowLink key={i} expenditure={expenditure} i={i} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center">{centerExpenditures}</div>
      )}
    </>
  )
}
