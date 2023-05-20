'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { DateRangePicker as TDateRangePicker } from 'tui-date-picker'

const DateRangePicker = dynamic(() => import('../../components/DateRangePicker'), {
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
  const dateFrom = params[2]?.slice(0, 4) ?? '2022'
  const dateTo = params[3]?.slice(0, 4) ?? '2022'
  const countParam = params[4] ? +params[4] : 20

  // Form
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [count, setCount] = useState(countParam)

  useEffect(() => {
    setCount(countParam)
  }, [countParam])

  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!dateRangePickerRef.current) return

    const dateFrom = dateRangePickerRef.current.getStartDate().getFullYear() * 10000
    const dateTo = dateRangePickerRef.current.getEndDate().getFullYear() * 10000 + 1231

    let searchResultPage = `/commitment/${dateFrom}/${dateTo}/${count}`

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
