'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useRef, useState } from 'react'
import Select from 'react-select'
import { CalendarType, DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import { localOptions } from '../../../common/lofin'
import { getNestedOption, getOption } from '../../../common/utils'
import { calendarTypeOptions } from '../../local/LocalExpenditureForm'

const DateRangePicker = dynamic(() => import('../../../components/DateRangePicker'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
      <input
        aria-label="Date"
        className="p-2 border disabled:cursor-not-allowed"
        disabled
        placeholder="YYYY"
        type="text"
      />
      <span>to</span>
      <input
        aria-label="Date"
        className="p-2 border disabled:cursor-not-allowed"
        disabled
        placeholder="YYYY"
        type="text"
      />
    </div>
  ),
})

export default function RatioForm() {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  const dateFromParam = params[3] ?? '2023'
  const dateToParam = params[4] ?? '2023'
  const localCodeParam = params[5] ?? '11'
  const isRealmParam = params[6] !== 'false'

  // Form
  const [calendarType, setCalendarType] = useState<CalendarType>('year')
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [localCode, setLocalCode] = useState(+localCodeParam)
  const [isRealm, setIsRealm] = useState(isRealmParam)

  // Search
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

    let searchResultPage = `/analysis/ratio/${dateFrom}/${dateTo}/${localCode}/${isRealm}`
    router.push(searchResultPage)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>구분</span>
        <div className="z-30">
          <Select
            isDisabled={true}
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
            defaultDateFrom={dateFromParam}
            defaultDateTo={dateToParam}
            forwardedRef={dateRangePickerRef}
          />
        </div>

        <span>지자체</span>
        <div className="z-10">
          <Select
            instanceId="sigunguLocalOptions"
            onChange={(newLocalGov) => newLocalGov && setLocalCode(newLocalGov.value)}
            options={localOptions}
            required
            value={getNestedOption(localOptions, localCode)}
          />
        </div>

        <span>구분</span>
        <div className="grid grid-cols-2 w-full rounded-md overflow-hidden border border-sky-400">
          <button
            className={'p-2 border-r border-sky-400 ' + (isRealm ? 'bg-sky-400 text-white' : '')}
            onClick={() => setIsRealm(true)}
            type="button"
          >
            분야
          </button>
          <button
            className={'p-2 ' + (!isRealm ? 'bg-sky-400 text-white' : '')}
            onClick={() => setIsRealm(false)}
            type="button"
          >
            부문
          </button>
        </div>
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}
