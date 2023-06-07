'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import Select from 'react-select'

import { getOption } from '../../../common/utils'

type Props = {
  electionOptions: any[]
}

export default function CommitmentForm({ electionOptions }: Props) {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  // const electionsParam = params[3] ? :[]
  const countParam = params[4] ? +params[4] : 20

  // Form
  const [elections, setElections] = useState<any>([])
  const [count, setCount] = useState(countParam)

  useEffect(() => {
    setCount(countParam)
  }, [countParam])

  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const candidateIds = elections.map((election: any) => election.value)
    let searchResultPage = `/commitment/candidate/${candidateIds}/${count}`
    router.push(searchResultPage)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <label>후보자</label>
        <div className="grid gap-2">
          <Select
            instanceId="electionOptions"
            isMulti
            onChange={(newOption) => setElections(newOption)}
            options={electionOptions}
            required
            value={getOption(electionOptions, elections)}
          />
        </div>

        <label htmlFor="count">개수</label>
        <input
          className="p-2 border w-full"
          min="1"
          max="100"
          name="count"
          onChange={(e) => setCount(+e.target.value)}
          placeholder="20"
          type="number"
          value={count}
        />
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}

// 대통령 공약이랑 지역 공약하고 분야가 겹치는 부분을 보여주기
// 시각화 비율은 예산으로
// 비어있는 분야 쪽으로 진출해야 한다
// 대통령 공약은 현재 예산이 없는데 640조 나라 예산부터 지자체까지의 흐름도
//
// 지자체세부사업, 중앙부처세부사업 공통 분야로 검색해서 예산 금액과 전체 예산 대비 비율을 비교
