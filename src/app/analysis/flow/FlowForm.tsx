'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { CalendarType, DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import {
  cefinRealmDefaultOption,
  cefinRealmOptions,
  cefinSectorDefaultOption,
  cefinSectorOptions,
  getCefinRealmOption,
  getCefinSectorOption,
} from '../../../common/cefin'
import {
  getLocalRealmOption,
  getLocalSectorOption,
  localRealmDefaultOption,
  localRealmOptions,
  localSectorDefaultOption,
  localSectorOptions,
} from '../../../common/lofin'
import { getOption } from '../../../common/utils'
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

export default function FlowForm() {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  const dateFromParam = params[3] ?? '2023-01-01'
  const dateToParam = params[4] ?? '2023-12-31'
  const isRealmParam = params[7] !== 'false'
  const centerRealmOrSectorOptionsParam = params[5]
    ? decodeURIComponent(params[5])
        .split(',')
        .map((centerRealmOrSector) =>
          (isRealmParam ? getCefinRealmOption : getCefinSectorOption)(centerRealmOrSector)
        )
    : [isRealmParam ? cefinRealmDefaultOption : cefinSectorDefaultOption]
  const localRealmOrSectorOptionsParam = params[6]
    ? params[6]
        .split(',')
        .map((localRealmOrSector) =>
          (isRealmParam ? getLocalRealmOption : getLocalSectorOption)(+localRealmOrSector)
        )
        .filter((localRealmOrSector) => localRealmOrSector)
    : [isRealmParam ? localRealmDefaultOption : localSectorDefaultOption]
  const criteriaParam = params[8] ?? 'sido'

  // Form
  const [calendarType, setCalendarType] = useState<CalendarType>('year')
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [centerRealmOrSectorOptions, setCenterRealmOrSectorOptions] = useState(
    centerRealmOrSectorOptionsParam
  )
  const [localRealmOrSectorOptions, setLocalRealmOrSectorOptions] = useState(
    localRealmOrSectorOptionsParam
  )
  const [isRealm, setIsRealm] = useState(isRealmParam)
  const [criteria, setCriteria] = useState(criteriaParam)

  function setIsRealm__setRealmOrSector(isRealm: boolean) {
    setIsRealm(isRealm)

    if (isRealm) {
      setCenterRealmOrSectorOptions([cefinRealmDefaultOption])
      setLocalRealmOrSectorOptions([localRealmDefaultOption])
    } else {
      setCenterRealmOrSectorOptions([cefinSectorDefaultOption])
      setLocalRealmOrSectorOptions([localSectorDefaultOption])
    }
  }

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

    const centerRealmOrSectors_ = encodeURIComponent(
      centerRealmOrSectorOptions
        .map((c) => c?.value)
        .filter((c) => c)
        .join(',')
    )
    const localRealmOrSectors_ = localRealmOrSectorOptions
      .map((l) => l?.value)
      .filter((l) => l)
      .join(',')
    let searchResultPage = `/analysis/flow/${dateFrom}/${dateTo}/${centerRealmOrSectors_}/${localRealmOrSectors_}/${isRealm}/${criteria}`
    router.push(searchResultPage)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>구분</span>
        <div className="z-40">
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
        <div className="z-30">
          <DateRangePicker
            calendarType={calendarType}
            defaultDateFrom={dateFromParam}
            defaultDateTo={dateToParam}
            forwardedRef={dateRangePickerRef}
          />
        </div>

        <span>지방 단위</span>
        <div className="grid grid-cols-3 w-full rounded-md overflow-hidden border border-sky-400">
          <button
            className={
              'p-2 border-r border-sky-400 ' +
              (criteria === 'nation' ? 'bg-sky-400 text-white' : '')
            }
            onClick={() => setCriteria('nation')}
            type="button"
          >
            전국
          </button>
          <button
            className={
              'p-2 border-r border-sky-400 ' + (criteria === 'sido' ? 'bg-sky-400 text-white' : '')
            }
            onClick={() => setCriteria('sido')}
            type="button"
          >
            시도
          </button>
          <button
            className={'p-2 ' + (criteria === 'sigungu' ? 'bg-sky-400 text-white' : '')}
            onClick={() => setCriteria('sigungu')}
            type="button"
          >
            시군구
          </button>
        </div>

        <span>구분</span>
        <div className="grid grid-cols-2 w-full rounded-md overflow-hidden border border-sky-400">
          <button
            className={'p-2 border-r border-sky-400 ' + (isRealm ? 'bg-sky-400 text-white' : '')}
            onClick={() => setIsRealm__setRealmOrSector(true)}
            type="button"
          >
            분야
          </button>
          <button
            className={'p-2 ' + (!isRealm ? 'bg-sky-400 text-white' : '')}
            onClick={() => setIsRealm__setRealmOrSector(false)}
            type="button"
          >
            부문
          </button>
        </div>

        <span>중앙 {isRealm ? '분야' : '부문'}</span>
        <div className="z-20">
          <Select
            instanceId="centerRealmOrSectors"
            isMulti
            onChange={(newOptions) => setCenterRealmOrSectorOptions(newOptions as any)}
            options={isRealm ? cefinRealmOptions : cefinSectorOptions}
            required
            value={centerRealmOrSectorOptions}
          />
        </div>

        <span>지방 {isRealm ? '분야' : '부문'}</span>
        <div className="z-10">
          <Select
            instanceId="localRealmOrSectorOptions"
            isMulti
            onChange={(newOptions) => setLocalRealmOrSectorOptions(newOptions as any)}
            options={isRealm ? localRealmOptions : localSectorOptions}
            required
            value={localRealmOrSectorOptions}
          />
        </div>
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}
