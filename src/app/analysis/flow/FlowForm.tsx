'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useRef, useState } from 'react'
import Select from 'react-select'
import { CalendarType, DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import {
  cefinFieldDefaultOption,
  cefinFieldOptions,
  cefinSectorDefaultOption,
  cefinSectorOptions,
  getCefinFieldOption,
  getCefinSectorOption,
} from '../../../common/cefin'
import {
  getLocalFieldOption,
  getLocalSectorOption,
  localFieldDefaultOption,
  localFieldOptions,
  localSectorDefaultOption,
  localSectorOptions,
} from '../../../common/lofin'
import { getOption } from '../../../common/utils'
import { calendarTypeOptions } from '../../local/LofinForm'

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
  const isFieldParam = params[7] !== 'false'
  const centerFieldOrSectorOptionsParam = params[5]
    ? decodeURIComponent(params[5])
        .split(',')
        .map((centerFieldOrSector) =>
          (isFieldParam ? getCefinFieldOption : getCefinSectorOption)(centerFieldOrSector)
        )
    : [isFieldParam ? cefinFieldDefaultOption : cefinSectorDefaultOption]
  const localFieldOrSectorOptionsParam = params[6]
    ? params[6]
        .split(',')
        .map((localFieldOrSector) =>
          (isFieldParam ? getLocalFieldOption : getLocalSectorOption)(+localFieldOrSector)
        )
        .filter((localFieldOrSector) => localFieldOrSector)
    : [isFieldParam ? localFieldDefaultOption : localSectorDefaultOption]
  const criteriaParam = params[8] ?? 'sido'

  // Form
  const [calendarType, setCalendarType] = useState<CalendarType>('year')
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [centerFieldOrSectorOptions, setCenterFieldOrSectorOptions] = useState(
    centerFieldOrSectorOptionsParam
  )
  const [localFieldOrSectorOptions, setLocalFieldOrSectorOptions] = useState(
    localFieldOrSectorOptionsParam
  )
  const [isField, setIsField] = useState(isFieldParam)
  const [criteria, setCriteria] = useState(criteriaParam)

  function setIsField_setFieldOrSector(isField: boolean) {
    setIsField(isField)

    if (isField) {
      setCenterFieldOrSectorOptions([cefinFieldDefaultOption])
      setLocalFieldOrSectorOptions([localFieldDefaultOption])
    } else {
      setCenterFieldOrSectorOptions([cefinSectorDefaultOption])
      setLocalFieldOrSectorOptions([localSectorDefaultOption])
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

    const centerFieldOrSectors_ = encodeURIComponent(
      centerFieldOrSectorOptions
        .map((c) => c?.value)
        .filter((c) => c)
        .join(',')
    )
    const localFieldOrSectors_ = localFieldOrSectorOptions
      .map((l) => l?.value)
      .filter((l) => l)
      .join(',')
    let searchResultPage = `/analysis/flow/${dateFrom}/${dateTo}/${centerFieldOrSectors_}/${localFieldOrSectors_}/${isField}/${criteria}`
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
            className={'p-2 border-r border-sky-400 ' + (isField ? 'bg-sky-400 text-white' : '')}
            onClick={() => setIsField_setFieldOrSector(true)}
            type="button"
          >
            분야
          </button>
          <button
            className={'p-2 ' + (!isField ? 'bg-sky-400 text-white' : '')}
            onClick={() => setIsField_setFieldOrSector(false)}
            type="button"
          >
            부문
          </button>
        </div>

        <span>중앙 {isField ? '분야' : '부문'}</span>
        <div className="z-20">
          <Select
            instanceId="centerFieldOrSectors"
            isMulti
            onChange={(newOptions) => setCenterFieldOrSectorOptions(newOptions as any)}
            options={isField ? cefinFieldOptions : cefinSectorOptions}
            required
            value={centerFieldOrSectorOptions}
          />
        </div>

        <span>지방 {isField ? '분야' : '부문'}</span>
        <div className="z-10">
          <Select
            instanceId="localFieldOrSectorOptions"
            isMulti
            onChange={(newOptions) => setLocalFieldOrSectorOptions(newOptions as any)}
            options={isField ? localFieldOptions : localSectorOptions}
            required
            value={localFieldOrSectorOptions}
          />
        </div>
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}
