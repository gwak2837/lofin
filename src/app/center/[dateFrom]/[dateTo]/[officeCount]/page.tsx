import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { PageProps } from '../../../../../common/types'
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

  return (
    <>
      {centerExpenditures && <h2 className="text-2xl m-6 text-center">중앙부처예산진단</h2>}

      {centerExpenditures ? (
        <>
          <h3 className="text-xl m-6 text-center">소관별 상세 세출현황</h3>
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
