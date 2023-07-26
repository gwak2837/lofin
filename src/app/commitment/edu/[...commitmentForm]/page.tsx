import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'
import { formatPrice } from '../../../../common/utils'

async function getCommitments(params: Record<string, string & string[]>) {
  const [basisDate, rawFiscalYears, rawLocalCodes] = params.commitmentForm

  if (!basisDate || !rawFiscalYears || !rawLocalCodes) return notFound()

  const fiscalYears = decodeURIComponent(rawFiscalYears)
  const localCodes = decodeURIComponent(rawLocalCodes)

  const searchParams = new URLSearchParams('electionCategory=1')

  if (basisDate !== '2023-02-22') {
    searchParams.append('basisDate', basisDate)
  }

  if (fiscalYears !== '2022') {
    for (const fiscalYear of fiscalYears.split(',')) {
      searchParams.append('fiscalYears', fiscalYear)
    }
  }

  if (localCodes !== '0') {
    for (const localCode of localCodes.split(',')) {
      searchParams.append('localCodes', localCode)
    }
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/commitment?${searchParams}`)
  if (response.status === 404) notFound()
  else if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

export default async function Page({ params }: PageProps) {
  const commitments = await getCommitments(params)

  const [basisDate, rawFiscalYears, rawLocalCodes] = params.commitmentForm

  return (
    <div className="">
      {/* 전체 예산집행비율 */}
      {/* 분야별 예산집행비율 */}
      <h3 className="text-xl m-6 text-center">공약별 상세 재정현황</h3>
      <div className="overflow-x-auto h-[100vh]">
        <table className="w-full whitespace-nowrap relative">
          <thead>
            <tr>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                <div className="flex gap-2 justify-center items-center">
                  번호
                  <Image src="/images/down-arrow.png" alt="Down Arrow" width="12" height="12" />
                </div>
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                제목
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                분야
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                부문
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                우선순위
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                집행비율
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                예산증감률
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                집행증감률
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                목표달성률
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                총 예산편성액
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                국비비율
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                총 집행액
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                국비비율
              </th>

              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                직전 기준일 총 예산편성액
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                국비비율
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                직전 기준일 총 집행액
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                국비비율
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                선택 회계년도 총 예산편성액
              </th>
              <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                선택 회계년도 총 집행액
              </th>
            </tr>
          </thead>
          <tbody>
            {(commitments as any[]).map((commitment, i) => (
              <Link key={i} href={`/business/2/${commitment.id}`} legacyBehavior>
                <tr className="cursor-pointer hover:bg-slate-100">
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2">{commitment.title}</td>
                  <td className="p-2 text-center">{commitment.field}</td>
                  <td className="p-2 text-center">{commitment.sector}</td>
                  <td className="p-2 text-center">{commitment.priority}</td>
                  <td className="p-2 text-right">
                    {formatRatio((100 * commitment.totalExecution) / commitment.totalExpenditure)}
                  </td>
                  <td className="p-2 text-right">
                    {formatRatio(
                      (100 * (commitment.totalExpenditure - commitment.prevTotalExpenditure)) /
                        commitment.prevTotalExpenditure
                    )}
                  </td>
                  <td className="p-2 text-right">
                    {formatRatio(
                      (100 * (commitment.totalExecution - commitment.prevTotalExecution)) /
                        commitment.prevTotalExecution
                    )}
                  </td>
                  <td className="p-2 text-right">
                    {formatRatio(
                      (100 * commitment.selectedExecution) / commitment.selectedExpenditure
                    )}
                  </td>
                  <td className="p-2 text-right">{formatMoney(commitment.totalExpenditure)}</td>
                  <td className="p-2 text-right">{formatRatio(commitment.expenditureGovRatio)}</td>
                  <td className="p-2 text-right">{formatMoney(commitment.totalExecution)}</td>
                  <td className="p-2 text-right">{formatRatio(commitment.executionGovRatio)}</td>
                  <td className="p-2 text-right">{formatMoney(commitment.prevTotalExpenditure)}</td>
                  <td className="p-2 text-right">
                    {formatRatio(commitment.prevExpenditureGovRatio)}
                  </td>
                  <td className="p-2 text-right">{formatMoney(commitment.prevTotalExecution)}</td>
                  <td className="p-2 text-right">
                    {formatRatio(commitment.prevExecutionGovRatio)}
                  </td>
                  <td className="p-2 text-right">{formatMoney(commitment.selectedExpenditure)}</td>
                  <td className="p-2 text-right">{formatMoney(commitment.selectedExecution)}</td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const formatKR = new Intl.NumberFormat('ko-KR').format

function formatMoney(a: any) {
  return a ? `${formatKR(a)}원` : '0원'
}

function formatRatio(a: number) {
  return a ? `${a.toFixed(1)}%` : '-'
}
