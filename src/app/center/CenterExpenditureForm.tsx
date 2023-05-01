'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { CalendarType, DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import { centerOfficeOptions } from '../../common/cefin'
import { calendarTypeOptions } from '../local/LocalExpenditureForm'

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

export default function CenterExpenditureForm() {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  const dateFrom = params[2] ?? '2023'
  const dateTo = params[3] ?? '2023'
  const officeCountParam = params[4] ? +params[4] : 30
  const officeNameParam = params[5] || '전체'
  const countParam = params[6] ? +params[6] : 30

  // Form
  const [calendarType, setCalendarType] = useState<CalendarType>('date')
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [officeCount, setOfficeCount] = useState(officeCountParam)
  const [officeName, setOfficeName] = useState(officeNameParam)
  const [count, setCount] = useState(countParam)

  useEffect(() => {
    setOfficeCount(officeCountParam)
    setOfficeName(officeNameParam)
    setCount(countParam)
  }, [countParam, officeCountParam, officeNameParam])

  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!dateRangePickerRef.current) return

    const dateFrom = dateRangePickerRef.current.getStartDate().getFullYear()
    const dateTo = dateRangePickerRef.current.getEndDate().getFullYear()

    let searchResultPage = `/center/${dateFrom}/${dateTo}/${officeCount}`

    if (officeName !== '전체') searchResultPage += `/${officeName}/${count}`

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
            calendarType="year"
            defaultDateFrom={dateFrom}
            defaultDateTo={dateTo}
            forwardedRef={dateRangePickerRef}
          />
        </div>

        <span>소관</span>
        <div>
          <Select
            instanceId="officeName"
            onChange={(newOfficeName) => newOfficeName && setOfficeName(newOfficeName.value)}
            options={centerOfficeOptions}
            required
            value={getOption(centerOfficeOptions, officeName)}
          />
        </div>

        <span>개수</span>
        <input
          className="p-2 border w-full"
          min="1"
          max="100"
          onChange={(e) =>
            officeName === '전체' ? setOfficeCount(+e.target.value) : setCount(+e.target.value)
          }
          placeholder="30"
          type="number"
          value={officeName === '전체' ? officeCount : count}
        />
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}

function getOption(options: any[], value: any) {
  for (const option of options) {
    if (option.value === value) return option
  }
}
