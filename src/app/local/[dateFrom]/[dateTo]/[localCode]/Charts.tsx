'use client'

import { useState } from 'react'

import SemiCirclePieChart from './SemiCirclePieChart'
import SortedBarChart from './SortedBarChart'

type Props = {
  expenditures: any
}

export default function Charts({ expenditures }: Props) {
  const [i, setI] = useState(0)

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
      {i === 0 && <SortedBarChart id="local-expenditure-bar" data={expenditures} />}
      {i === 1 && <SemiCirclePieChart id="local-expenditure-circle" data={expenditures} />}
    </>
  )
}
