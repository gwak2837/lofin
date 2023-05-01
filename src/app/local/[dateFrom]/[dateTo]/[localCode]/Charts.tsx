'use client'

import { useState } from 'react'

import SemiCirclePieChart from '../../../../../components/SemiCirclePieChart'
import SortedBarChart from '../../../../../components/SortedBarChart'

type Props = {
  expenditures: Record<string, any>[]
}

export default function Charts({ expenditures }: Props) {
  const [i, setI] = useState(0)

  const data = expenditures.map((expenditure) => ({
    realm: expenditure.realm,
    budget_crntam_sum: Math.floor(+expenditure.budget_crntam_sum / 1_000_000),
  }))

  return (
    <>
      <div className="grid grid-cols-[1fr_auto_1fr]">
        <button className="disabled:text-gray-300" disabled={i <= 0} onClick={() => setI(i - 1)}>
          {'<'}
        </button>
        <div>
          {i === 0 ? (
            <h3 className="text-xl mt-6 text-center">분야별 예산현액 합계</h3>
          ) : (
            <h3 className="text-xl my-6 text-center">분야별 예산현액 비율</h3>
          )}
          {i === 0 && <h5 className="text-sm mt-2 text-center">단위: 백만</h5>}
        </div>
        <button className="disabled:text-gray-300" disabled={i >= 1} onClick={() => setI(i + 1)}>
          {'>'}
        </button>
      </div>
      {i === 0 && (
        <SortedBarChart
          id="local-expenditure-bar"
          data={data}
          keyField="realm"
          valueField="budget_crntam_sum"
        />
      )}
      {i === 1 && (
        <SemiCirclePieChart
          id="local-expenditure-circle"
          data={data}
          keyField="realm"
          valueField="budget_crntam_sum"
        />
      )}
    </>
  )
}
