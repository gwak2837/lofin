'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import { DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import { localGovOptions as localOptions, realms } from '../../common/lofin'
import DateRangePicker from '../../components/DateRangePicker'

type Form = {
  dateFrom: string
  dateTo: string
  localCode: string
  projectCode: number
  count: number
}

export default function LocalExpenditureForm() {
  const params = usePathname()?.split('/') ?? []
  const dateFrom = params[2] ?? '2022-12-01'
  const dateTo = params[3] ?? '2022-12-31'
  const localCode =
    params[4] === '0' // 전국
      ? localOptions[0].value
      : params[5] === 'true'
      ? params[4].slice(0, 2)
      : params[4] ?? seoulGov.value
  const showCount = Boolean(params[7])
  const count = +(params[7] ?? 20)

  const projectCode = +(params[7] ?? 20)
  const projectCodesParam = params.slice(6)
  const projectCodes =
    projectCodesParam[0] === '000' || projectCodesParam[0] === undefined
      ? [scienceTech.value]
      : projectCodesParam

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

    const { localCode } = input

    const dateFrom = dateRangePickerRef.current.getStartDate().toISOString().slice(0, 10)
    const dateTo = dateRangePickerRef.current.getEndDate().toISOString().slice(0, 10)
    const newLocalCode = localCode === '0' ? localCode : localCode.padEnd(7, '0')
    const isWholeProvince = localCode.length === 2

    router.push(`/local/${dateFrom}/${dateTo}/${newLocalCode}/${isWholeProvince}`)
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
            defaultValue={getLocalGov(localOptions, localCode)}
            instanceId="localGovOptions"
            options={localOptions}
            {...register('localCode', { required: true })}
            onChange={(newLocalGov) => newLocalGov && setValue('localCode', newLocalGov.value)}
          />
        </div>
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
  value: string
}

const projects = realms
const seoulGov = localOptions[1].options![0]
const scienceTech = projects[11]

function getLocalGov(groupedLocalGovs: Record<string, any>[], localCode?: string) {
  for (const local of groupedLocalGovs) {
    if (local.value === localCode) return local
    const a = local.options?.find((localGov: Option) => localGov.value === localCode)
    if (a) return a
  }
}
