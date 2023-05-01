'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import { CalendarType, DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import { centerOfficeOptions } from '../../common/cefin'
import { localOptions, projectOptions } from '../../common/lofin'

type Form = {
  dateFrom: string
  dateTo: string
  officeName?: string
  count?: number
}

export default function CenterExpenditureForm() {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  const dateFromParam = params[2] ?? '2023'
  const dateToParam = params[3] ?? '2023'
  const officeCountParam = params[4] ? +params[4] : undefined
  const officeNameParam = params[5]
  const countParam = params[6] ? +params[6] : undefined

  // Form
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [localCode, setLocalCode] = useState(11)
  const [projectCode, setProjectCode] = useState(officeNameParam ?? 0)
  const [count, setCount] = useState(countParam ?? 20)

  // useEffect(() => {
  //   setLocalCode(localCodeParam ?? 11)
  //   setProjectCode(projectCodeParam ?? 0)
  //   setCount(countParam ?? 20)
  // }, [localCodeParam, projectCodeParam, countParam])

  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!dateRangePickerRef.current) return

    const dateFrom = dateRangePickerRef.current.getStartDate().toISOString().slice(0, 10)
    const dateTo = dateRangePickerRef.current.getEndDate().toISOString().slice(0, 10)

    let searchResultPage = `/center/${dateFrom}/${dateTo}/${localCode}`

    router.push(searchResultPage)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>기간</span>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <input
            className="p-2 border w-full"
            min="2007"
            max="2023"
            placeholder="2023"
            type="number"
          />
          <span>~</span>
          <input
            className="p-2 border w-full"
            min="2007"
            max="2023"
            placeholder="2023"
            type="number"
          />
        </div>

        {/* {officeName && (
          <>
            <span>소관명</span>
            <div>
              <Select
                defaultValue={getOption(centerOfficeOptions, officeName)}
                instanceId="officeName"
                options={centerOfficeOptions}
              />
            </div>
          </>
        )} */}

        {count && (
          <>
            <span>개수</span>
            <input className="p-2 border w-full" min="1" max="100" placeholder="20" type="number" />
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
