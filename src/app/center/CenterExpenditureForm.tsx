'use client'

import { count } from 'd3'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import { DateRangePicker } from 'tui-date-picker'

import { centerOfficeOptions } from '../../common/cefin'
import { localOptions, projectOptions } from '../../common/lofin'

type Form = {
  dateFrom: string
  dateTo: string
  officeName?: string
  count?: number
}

export default function CenterExpenditureForm() {
  const params = usePathname()?.split('/') ?? []

  // Required
  const dateFrom = params[2] ?? '2022'
  const dateTo = params[3] ?? '2022'

  // Optional
  const officeName = params[4]
  const count = params[5] ? +params[5] : undefined

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<Form>({
    defaultValues: {
      dateFrom,
      dateTo,
      officeName,
      count,
    },
    delayError: 500,
  })

  useEffect(() => {
    setValue('officeName', officeName)
    setValue('count', count)
  }, [count, officeName, setValue])

  const router = useRouter()

  function search(input: Form) {
    const { officeName, count } = input

    let searchResultPage = `/center/${dateFrom}/${dateTo}`

    if (officeName && count) searchResultPage += `/${officeName}/${count}`

    router.push(searchResultPage)
  }

  return (
    <form
      className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto"
      onSubmit={handleSubmit(search)}
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>기간</span>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <input
            className="p-2 border w-full"
            min="2007"
            max="2023"
            placeholder="2023"
            type="number"
            {...register('dateFrom', { min: 2007, max: 2023 })}
          />
          <span>~</span>
          <input
            className="p-2 border w-full"
            min="2007"
            max="2023"
            placeholder="2023"
            type="number"
            {...register('dateTo', { min: 2007, max: 2023 })}
          />
        </div>

        {officeName && (
          <>
            <span>소관명</span>
            <div>
              <Select
                defaultValue={getOption(centerOfficeOptions, officeName)}
                instanceId="officeName"
                options={centerOfficeOptions}
                {...register('officeName')}
                onChange={(newOfficeName) =>
                  newOfficeName && setValue('officeName', newOfficeName.value)
                }
              />
            </div>
          </>
        )}

        {count && (
          <>
            <span>개수</span>
            <input
              className="p-2 border w-full"
              min="1"
              max="100"
              placeholder="20"
              type="number"
              {...register('count', { min: 1, max: 100 })}
            />
          </>
        )}
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
