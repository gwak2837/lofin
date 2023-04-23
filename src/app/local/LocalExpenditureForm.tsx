'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { DateRangePicker as TDateRangePicker } from 'tui-date-picker'

import { localOptions, projectOptions } from '../../common/lofin'

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

export default function LocalExpenditureForm() {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  const dateFrom = params[2] ?? '2022-12-01'
  const dateTo = params[3] ?? '2022-12-31'
  const localCodeParam = params[4] ? +params[4] : undefined
  const projectCodeParam = params[5] ? +params[5] : undefined
  const countParam = params[6] ? +params[6] : undefined

  // Form
  const dateRangePickerRef = useRef<TDateRangePicker>(null)
  const [localCode, setLocalCode] = useState(localCodeParam ?? 11)
  const [projectCode, setProjectCode] = useState(projectCodeParam ?? 0)
  const [count, setCount] = useState(countParam ?? 20)

  useEffect(() => {
    setLocalCode(localCodeParam ?? 11)
    setProjectCode(projectCodeParam ?? 0)
    setCount(countParam ?? 20)
  }, [localCodeParam, projectCodeParam, countParam])

  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!dateRangePickerRef.current) return

    const dateFrom = dateRangePickerRef.current.getStartDate().toISOString().slice(0, 10)
    const dateTo = dateRangePickerRef.current.getEndDate().toISOString().slice(0, 10)

    let searchResultPage = `/local/${dateFrom}/${dateTo}/${localCode}`

    if (projectCode !== 0) searchResultPage += `/${projectCode}/${count}`

    router.push(searchResultPage)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>기간</span>
        <div className="z-20">
          <DateRangePicker
            defaultDateFrom={dateFrom}
            defaultDateTo={dateTo}
            forwardedRef={dateRangePickerRef}
          />
        </div>

        <span>지자체</span>
        <div className="z-10">
          <Select
            instanceId="localGovOptions"
            onChange={(newLocalGov) => newLocalGov && setLocalCode(newLocalGov.value)}
            options={localOptions}
            value={getLocalOption(localOptions, localCode)}
          />
        </div>

        <span>세부사업</span>
        <div>
          <Select
            instanceId="projectCode"
            onChange={(newProjectCode) => newProjectCode && setProjectCode(newProjectCode.value)}
            options={projectOptions}
            value={getProjectOption(projectOptions, projectCode)}
          />
        </div>

        {projectCode !== 0 && (
          <>
            <span>개수</span>
            <input
              className="p-2 border w-full"
              min="1"
              max="100"
              onChange={(e) => setCount(+e.target.value)}
              placeholder="20"
              type="number"
              value={count}
            />
          </>
        )}
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}

type Option = {
  label: string
  value: number
}

function getLocalOption(groupedLocalGovs: Record<string, any>[], localCode: number) {
  for (const localOption of groupedLocalGovs) {
    const found = localOption.options?.find((localGov: Option) => localGov.value === localCode)
    if (found) return found
  }
}

function getProjectOption(projectOptions: Option[], projectCode: number) {
  for (const projectOption of projectOptions) {
    if (projectOption.value === projectCode) return projectOption
  }
}
