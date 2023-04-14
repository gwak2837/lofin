'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import { DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import { localGovOptions as localOptions, realms } from '../../common/lofin'

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

type Form = {
  dateFrom: string
  dateTo: string
  localCode: number
  projectCode?: number
  count?: number
}

export default function LocalExpenditureForm() {
  const params = usePathname()?.split('/') ?? []
  console.log('👀 - params:', params)

  // Required
  const dateFrom = params[2] ?? '2022-12-01'
  const dateTo = params[3] ?? '2022-12-31'
  const localCode = +(params[4] ?? 11) // 11: 서울전체

  // Optional
  const showProjectCode = params[6] !== undefined
  const projectCode = showProjectCode ? +params[6] : undefined
  const showCount = params[7] !== undefined
  const count = showCount ? +params[7] : undefined

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<Form>({
    defaultValues: {
      localCode,
      projectCode,
      count,
    },
    delayError: 500,
  })

  const router = useRouter()
  const dateRangePickerRef = useRef<TDateRangePicker>(null)

  function search(input: Form) {
    if (!dateRangePickerRef.current) return

    const dateFrom = dateRangePickerRef.current.getStartDate().toISOString().slice(0, 10)
    const dateTo = dateRangePickerRef.current.getEndDate().toISOString().slice(0, 10)

    const { localCode, projectCode, count } = input

    let searchResultPage = `/local/${dateFrom}/${dateTo}/${localCode}`

    if (projectCode && count) searchResultPage += `/${projectCode}/${count}`

    router.push(searchResultPage)
  }

  const [datePickerType, setDatePickerType] = useState('date')

  return (
    <form
      className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto"
      onSubmit={handleSubmit(search)}
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>구분</span>
        <div className="z-30">
          <Select
            defaultValue={datePickerTypeSelect[2]}
            instanceId="datePickerType"
            options={datePickerTypeSelect}
            onChange={(newType) => setDatePickerType(newType?.value ?? 'date')}
          />
        </div>

        <span>기간</span>
        <div className="z-20">
          <DateRangePicker
            defaultDateFrom={dateFrom}
            defaultDateTo={dateTo}
            forwardedRef={dateRangePickerRef}
            type={datePickerType}
          />
        </div>

        <span>지자체</span>
        <div className="z-10">
          <Select
            defaultValue={getLocal(localOptions, localCode)}
            instanceId="localGovOptions"
            options={localOptions}
            {...register('localCode', { required: true })}
            onChange={(newLocalGov) => newLocalGov && setValue('localCode', newLocalGov.value)}
          />
        </div>

        {showCount && (
          <>
            <span>개수</span>
            <input
              className="p-2 border w-full"
              min="1"
              max="100"
              placeholder="20"
              type="number"
              {...register('count', { required: true, min: 1, max: 100 })}
            />
          </>
        )}
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}

const datePickerTypeSelect = [
  { label: '연간', value: 'year' },
  { label: '월간', value: 'month' },
  { label: '일간', value: 'date' },
]

type Option = {
  label: string
  value: number
}

function getLocal(groupedLocalGovs: Record<string, any>[], localCode: number) {
  for (const localOption of groupedLocalGovs) {
    // 전국
    if (localOption.value === localCode) return localOption

    // 그외
    const a = localOption.options?.find((localGov: Option) => localGov.value === localCode)
    if (a) return a
  }
}
