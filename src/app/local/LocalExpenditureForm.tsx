'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { CalendarType, DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import { localOptions, localRealmOptions } from '../../common/lofin'
import { Option, getOption } from '../../common/utils'

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

export default function LocalExpenditureForm() {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  const dateFrom = params[2] ?? '2023-01-01'
  const dateTo = params[3] ?? '2023-12-31'
  const localCodeParam = params[4] ? +params[4] : 1100000
  const realmCodeParam = params[5] ? +params[5] : 0
  const countParam = params[6] ? +params[6] : 20

  // Form
  const [calendarType, setCalendarType] = useState<CalendarType>('date')
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [localCode, setLocalCode] = useState(localCodeParam)
  const [realmCode, setRealmCode] = useState(realmCodeParam)
  const [count, setCount] = useState(countParam)

  useEffect(() => {
    setLocalCode(localCodeParam)
    setRealmCode(realmCodeParam)
    setCount(countParam)
  }, [countParam, localCodeParam, realmCodeParam])

  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!dateRangePickerRef.current) return

    const dateFrom = dateRangePickerRef.current.getStartDate().toISOString().slice(0, 10)

    const dateTo = (() => {
      const endDate = dateRangePickerRef.current.getEndDate()

      if (calendarType === 'date') {
        const month = String(endDate.getMonth() + 1).padStart(2, '0')
        const date = String(endDate.getDate()).padStart(2, '0')
        return `${endDate.getFullYear()}-${month}-${date}`
      } else if (calendarType === 'month') {
        endDate.setMonth(endDate.getMonth() + 1)
        endDate.setDate(0)
        const month = String(endDate.getMonth() + 1).padStart(2, '0')
        const date = String(endDate.getDate()).padStart(2, '0')
        return `${endDate.getFullYear()}-${month}-${date}`
      } else {
        return `${endDate.getFullYear()}-${12}-${31}`
      }
    })()

    let searchResultPage = `/local/${dateFrom}/${dateTo}/${localCode}`

    if (realmCode !== 0) searchResultPage += `/${realmCode}/${count}`

    router.push(searchResultPage)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>구분</span>
        <div className="z-30">
          <Select
            instanceId="type"
            onChange={(newType) => newType && setCalendarType(newType.value)}
            options={calendarTypeOptions}
            required
            value={getOption(calendarTypeOptions, calendarType)}
          />
        </div>

        <span>기간</span>
        <div className="z-20">
          <DateRangePicker
            calendarType={calendarType}
            defaultDateFrom={dateFrom}
            defaultDateTo={dateTo}
            forwardedRef={dateRangePickerRef}
          />
        </div>

        <span>지자체</span>
        <div className="z-10">
          <Select
            instanceId="localGovOptions"
            onChange={(newLocalGov) => newLocalGov && setLocalCode(newLocalGov.value)}
            options={localOptions}
            required
            value={getLocalOption(localOptions, localCode)}
          />
        </div>

        <span>분야</span>
        <div>
          <Select
            instanceId="projectCode"
            onChange={(newProjectCode) => newProjectCode && setRealmCode(newProjectCode.value)}
            options={localRealmOptions}
            required
            value={getOption(localRealmOptions as any, realmCode)}
          />
        </div>

        {realmCode !== 0 && (
          <>
            <span>개수</span>
            <input
              className="p-2 border w-full"
              min="1"
              max="100"
              onChange={(e) => setCount(+e.target.value)}
              placeholder="20"
              required
              type="number"
              value={count}
            />
          </>
        )}
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}

export const calendarTypeOptions: Option[] = [
  {
    label: '일별',
    value: 'date',
  },
  {
    label: '월별',
    value: 'month',
  },
  {
    label: '연도별',
    value: 'year',
  },
]

function getLocalOption(groupedLocalGovs: Record<string, any>[], localCode: number) {
  for (const localOption of groupedLocalGovs) {
    const found = localOption.options?.find((localGov: Option) => localGov.value === localCode)
    if (found) return found
  }
}
