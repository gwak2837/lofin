'use client'

import { localOptions, projectOptions } from '../../common/lofin'
import { usePathname, useRouter } from 'next/navigation'

import { DateRangePicker } from 'tui-date-picker'
import Select from 'react-select'
import { count } from 'd3'
import { useForm } from 'react-hook-form'
import { useRef } from 'react'

type Form = {
  dateFrom: string
  dateTo: string
  localCode: number
  projectCode?: number
  count?: number
}

export default function CenterExpenditureForm() {
  const params = usePathname()?.split('/') ?? []

  // Required
  const dateFrom = params[2] ?? '2022-12-01'
  const dateTo = params[3] ?? '2022-12-31'

  // Optional
  const projectCode = params[5] ? +params[5] : undefined
  const count = params[6] ? +params[6] : undefined

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<Form>({
    defaultValues: {
      projectCode,
      count,
    },
    delayError: 500,
  })

  const router = useRouter()

  function search(input: Form) {
    const { localCode, projectCode, count } = input

    let searchResultPage = `/local/${dateFrom}/${dateTo}/${localCode}`

    if (projectCode && count) searchResultPage += `/${projectCode}/${count}`

    router.push(searchResultPage)
  }

  return (
    <form
      className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto"
      onSubmit={handleSubmit(search)}
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>구분</span>
        <div className="z-30">
          {/* <Select
            defaultValue={datePickerTypeSelect[2]}
            instanceId="datePickerType"
            options={datePickerTypeSelect}
            onChange={(newType) => setDatePickerType(newType?.value ?? 'date')}
          /> */}
        </div>

        <span>기간</span>
        <div className="z-20"></div>

        {projectCode && (
          <>
            <span>세부사업</span>
            <div>
              <Select
                // defaultValue={getProjectOption(projectOptions, projectCode)}
                instanceId="projectCode"
                options={projectOptions}
                {...register('projectCode')}
                onChange={(newProjectCode) =>
                  newProjectCode && setValue('projectCode', newProjectCode.value)
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
