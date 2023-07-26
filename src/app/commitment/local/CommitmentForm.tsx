'use client'

import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import Select from 'react-select'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { getLocalGovOption, localOptions } from '../../../common/lofin'
import { getOption } from '../../../common/utils'
import { calendarTypeOptions } from '../../local/LofinForm'

type Props = {
  options: Record<string, any[]>
}

export default function CommitmentForm({ options }: Props) {
  // Pathname: Call by value
  const params = usePathname()?.split('/') ?? []
  const basisDateParam = params[3] ?? '2023-03-31'
  const fiscalYearsParam = params[4] ? decodeURIComponent(params[4]) : '2022'
  const localCodesParam = params[5] ? decodeURIComponent(params[5]) : '1135000'

  // Option
  const basisDateOptions = options.basisDates.map((date) => ({
    label: date.slice(0, 10),
    value: date.slice(0, 10),
  }))

  const fiscalYearOptions = options.fiscalYears.map((year) => ({
    label: year,
    value: year,
  }))

  const localGovOptions = options.localCodes.map((code) => ({
    label: getLocalGovOption(code)?.label ?? code,
    value: code,
  }))

  // Form
  const [selectedBasisDate, setSelectedBasisDate] = useState(
    basisDateOptions.find((option) => option.value === basisDateParam) ?? basisDateOptions[0]
  )
  const [selectedFiscalYears, setSelectedFiscalYears] = useState(
    fiscalYearsParam.split(',').map((year) => ({
      label: year,
      value: year,
    }))
  )
  const [selectedLocalGovs, setSelectedLocalGovs] = useState(
    localCodesParam.split(',').map((code) => ({
      label: getLocalGovOption(+code)?.label ?? code,
      value: code,
    }))
  )

  // Route
  useEffect(() => {
    setSelectedFiscalYears(
      fiscalYearsParam.split(',').map((year) => ({
        label: year,
        value: year,
      }))
    )
    setSelectedLocalGovs(
      localCodesParam.split(',').map((code) => ({
        label: getLocalGovOption(+code)?.label ?? code,
        value: code,
      }))
    )
  }, [fiscalYearsParam, localCodesParam])

  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const basisDate = selectedBasisDate.value
    const fiscalYears = selectedFiscalYears
      .map((option) => option.value)
      .sort()
      .join(',')
    const localGovCodes = selectedLocalGovs
      .map((option) => option.value)
      .sort()
      .join(',')
    const searchResultPage = `/commitment/local/${basisDate}/${fiscalYears}/${localGovCodes}`
    router.push(searchResultPage)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>기준일</span>
        <div className="z-30">
          <Select
            instanceId="basisDateOptions"
            onChange={(newOption) => setSelectedBasisDate(newOption as any)}
            options={basisDateOptions}
            required
            value={selectedBasisDate}
          />
        </div>
        <span>회계년도</span>
        <div className="z-20">
          <Select
            instanceId="fiscalYearOptions"
            isMulti
            onChange={(newOptions) => setSelectedFiscalYears(newOptions as any)}
            options={fiscalYearOptions}
            required
            value={selectedFiscalYears}
          />
        </div>
        <span>지자체</span>
        <div className="z-10">
          <Select
            instanceId="localGovOptions"
            isMulti
            onChange={(newOptions) => setSelectedLocalGovs(newOptions as any)}
            options={localGovOptions}
            required
            value={selectedLocalGovs}
          />
        </div>
      </div>
      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}
