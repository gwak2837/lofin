'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import { getGroupedOption } from '../../../common/utils'
import { voteOptions } from '../../../common/vote'

const DateRangePicker = dynamic(() => import('../../../components/DateRangePicker'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
      <input
        aria-label="Date"
        className="p-2 border disabled:cursor-not-allowed"
        disabled
        placeholder="YYYY-MM-DD"
        type="text"
      />
      <span>to</span>
      <input
        aria-label="Date"
        className="p-2 border disabled:cursor-not-allowed"
        disabled
        placeholder="YYYY-MM-DD"
        type="text"
      />
    </div>
  ),
})

export default function CommitmentForm() {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  const dateFrom = params[3]?.slice(0, 4) ?? '2022'
  const dateTo = params[4]?.slice(0, 4) ?? '2022'
  const sidoParam = params[5] ? decodeURIComponent(params[5]) : '서울특별시'
  const sigunguParam = params[6] ? decodeURIComponent(params[6]) : '서울특별시'
  const voteTypeParam = params[7] ? +params[7] : 1
  const nameParam = params[8] ? decodeURIComponent(params[8]) : '윤석열'
  const countParam = params[9] ? +params[9] : 20

  // Form
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [count, setCount] = useState(countParam)
  const [vote, setVote] = useState({ group: sidoParam, value: sigunguParam })
  const [voteType, setVoteType] = useState(voteTypeParam)
  const [name, setName] = useState(nameParam)

  useEffect(() => {
    setCount(countParam)
  }, [countParam])

  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!dateRangePickerRef.current) return

    const dateFrom = dateRangePickerRef.current.getStartDate().getFullYear() * 10000
    const dateTo = dateRangePickerRef.current.getEndDate().getFullYear() * 10000 + 1231
    const sido = encodeURIComponent(vote.group)
    const sigungu = encodeURIComponent(vote.value)
    const name2 = name || 'null'
    const voteType2 = voteType || 'null'

    let searchResultPage = `/commitment/candidate/${dateFrom}/${dateTo}/${sido}/${sigungu}/${voteType2}/${name2}/${count}`

    router.push(searchResultPage)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>기간</span>
        <div className="z-20">
          <DateRangePicker
            calendarType="year"
            defaultDateFrom={dateFrom}
            defaultDateTo={dateTo}
            forwardedRef={dateRangePickerRef}
          />
        </div>

        <span>지역</span>
        <Select
          instanceId="voteOptions"
          onChange={(newOption) => setVote(newOption)}
          options={voteOptions}
          required
          value={getGroupedOption(voteOptions, vote)}
        />

        <span>선거</span>
        <select
          className="border p-2"
          onChange={(e) => setVoteType(+e.target.value)}
          value={voteType}
        >
          <option value="">전체</option>
          <option value={1}>대통령</option>
          <option value={3}>시 ∙ 도지사</option>
          <option value={4}>구 ∙ 시 ∙ 군의장</option>
          <option value={11}>교육감</option>
        </select>

        <span>이름</span>
        <input
          className="border p-2"
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          value={name}
        />

        <span>개수</span>
        <input
          className="p-2 border w-full"
          min="1"
          max="100"
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
