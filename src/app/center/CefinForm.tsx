'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import {
  cefinFieldDefaultOption,
  cefinFieldOptions,
  cefinOfficeOptions,
  cefinSectorDefaultOption,
  cefinSectorOptions,
  getCefinFieldOption,
  getCefinOfficeOption,
  getCefinSectorOption,
} from '../../common/cefin'

const DateRangePicker = dynamic(() => import('../../components/DateRangePicker'), {
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

export default function CefinForm() {
  // Pathname: Call by value
  const params = usePathname()?.split('/') ?? []
  const yearFromParam = params[2] ?? '2023'
  const yearToParam = params[3] ?? '2023'
  const isFieldParam = params[4] ? Boolean(params[4]) : null
  const fieldsOrSectorsParam =
    params[5] && isFieldParam !== null ? decodeURIComponent(params[5]) : '전체'
  const officeNamesParam = params[6] ? decodeURIComponent(params[6]) : '전체'
  const countParam = params[7] ? +params[7] : 30

  // Form
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [isField, setIsField] = useState(isFieldParam)
  const [fieldOrSectorOptions, setFieldOrSectorOptions] = useState(
    fieldsOrSectorsParam
      .split(',')
      .map((fieldOrSector) =>
        (isFieldParam ? getCefinFieldOption : getCefinSectorOption)(fieldOrSector)
      )
  )
  const [count, setCount] = useState(countParam)
  const [officeNameOptions, setOfficeNameOptions] = useState(
    officeNamesParam.split(',').map((officeName) => getCefinOfficeOption(officeName))
  )

  // Route
  useEffect(() => {
    setFieldOrSectorOptions(
      fieldsOrSectorsParam
        .split(',')
        .map((fieldOrSector) =>
          (isFieldParam ? getCefinFieldOption : getCefinSectorOption)(fieldOrSector)
        )
    )
    setOfficeNameOptions(
      officeNamesParam.split(',').map((officeName) => getCefinOfficeOption(officeName))
    )
  }, [fieldsOrSectorsParam, isFieldParam, officeNamesParam])

  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!dateRangePickerRef.current) return

    const yearFrom = dateRangePickerRef.current.getStartDate().getFullYear()
    const yearTo = dateRangePickerRef.current.getEndDate().getFullYear()

    const fieldsOrSectors =
      isField !== null
        ? fieldOrSectorOptions
            .map((c) => c?.value)
            .sort()
            .join(',')
        : '전체'
    const officeNameValue = officeNameOptions
      .map((c) => c?.value)
      .sort()
      .join(',')
    const searchResultPage = `/center/${yearFrom}/${yearTo}/${isField}/${fieldsOrSectors}/${officeNameValue}/${count}`
    router.push(searchResultPage)
  }

  // Input handler
  function setIsField_setFieldOrSectorOptions(isField: boolean | null) {
    setIsField(isField)

    if (isField === true) {
      setFieldOrSectorOptions([cefinFieldDefaultOption])
    } else if (isField === false) {
      setFieldOrSectorOptions([cefinSectorDefaultOption])
    } else {
      setFieldOrSectorOptions([{ value: '전체', label: '전체' }])
    }
  }

  function handleFieldOrSectorOptions(newOptions: any) {
    if (fieldOrSectorOptions[0]?.value === '전체')
      return setFieldOrSectorOptions(newOptions.filter((option: any) => option.value !== '전체'))
    else if (newOptions.find((option: any) => option.value === '전체'))
      return setFieldOrSectorOptions([{ value: '전체', label: '전체' }])
    else setFieldOrSectorOptions(newOptions)
  }

  function handleOfficeNameOptions(newOptions: any) {
    if (officeNameOptions[0]?.value === '전체')
      return setOfficeNameOptions(newOptions.filter((option: any) => option.value !== '전체'))
    else if (newOptions.find((option: any) => option.value === '전체'))
      return setOfficeNameOptions([cefinOfficeOptions[0]])
    else setOfficeNameOptions(newOptions)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>기간</span>
        <div className="z-20">
          <DateRangePicker
            calendarType="year"
            defaultDateFrom={yearFromParam}
            defaultDateTo={yearToParam}
            forwardedRef={dateRangePickerRef}
          />
        </div>

        <span>구분</span>
        <div className="grid grid-cols-3 w-full rounded-md overflow-hidden border border-sky-400">
          <button
            className={
              'p-2 border-r border-sky-400 ' + (isField === null ? 'bg-sky-400 text-white' : '')
            }
            onClick={() => setIsField_setFieldOrSectorOptions(null)}
            type="button"
          >
            전체
          </button>
          <button
            className={
              'p-2 border-r border-sky-400 ' + (isField === true ? 'bg-sky-400 text-white' : '')
            }
            onClick={() => setIsField_setFieldOrSectorOptions(true)}
            type="button"
          >
            분야
          </button>
          <button
            className={'p-2 ' + (isField === false ? 'bg-sky-400 text-white' : '')}
            onClick={() => setIsField_setFieldOrSectorOptions(false)}
            type="button"
          >
            부문
          </button>
        </div>

        <span>{isField === null ? '전체' : isField === true ? '분야' : '부문'}</span>
        <div className="z-10">
          <Select
            instanceId="fieldOrSectorOptions"
            isDisabled={isField === null}
            isMulti
            onChange={handleFieldOrSectorOptions}
            options={isField ? cefinFieldOptions : cefinSectorOptions}
            required
            value={fieldOrSectorOptions}
          />
        </div>

        <span>소관</span>
        <div>
          <Select
            instanceId="cefinOfficeOptions"
            isMulti
            onChange={handleOfficeNameOptions}
            options={cefinOfficeOptions}
            placeholder="전체"
            value={officeNameOptions}
          />
        </div>

        <span>개수</span>
        <input
          className="p-2 border w-full"
          min="1"
          max="100"
          onChange={(e) => setCount(+e.target.value)}
          placeholder="30"
          required
          type="number"
          value={count}
        />
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}
