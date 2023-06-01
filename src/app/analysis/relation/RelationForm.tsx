'use client'

import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Select from 'react-select'

import { sigunguLocalOptions } from '../../../common/lofin'
import { getNestedOption } from '../../../common/utils'

export default function RelationForm() {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  const yearParam = params[3] ?? '2022'
  const localCodeParam = params[4] ?? '1100000'
  const isRealmParam = params[5] ? Boolean(params[4]) : true

  // Form
  const [year, setYear] = useState(yearParam)
  const [localCode, setLocalCode] = useState(+localCodeParam)
  const [isRealm, setIsRealm] = useState(isRealmParam)

  // Search
  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let searchResultPage = `/analysis/relation/${year}/${localCode}/${isRealm}`
    router.push(searchResultPage)
  }

  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>연도</span>
        <input
          className="p-2 border w-full"
          onChange={(e) => setYear(e.target.value)}
          placeholder="2022"
          type="number"
          value={year}
        />

        <span>지자체</span>
        <div className="z-10">
          <Select
            instanceId="sigunguLocalOptions"
            onChange={(newLocalGov) => newLocalGov && setLocalCode(newLocalGov.value)}
            options={sigunguLocalOptions}
            required
            value={getNestedOption(sigunguLocalOptions, localCode)}
          />
        </div>

        <span>구분</span>
        <div className="grid grid-cols-2 w-full rounded-md overflow-hidden border border-sky-400">
          <button
            className={'p-2 border-r border-sky-400 ' + (isRealm ? 'bg-sky-400 text-white' : '')}
            onClick={() => setIsRealm(true)}
            type="button"
          >
            분야
          </button>
          <button
            className={'p-2 ' + (!isRealm ? 'bg-sky-400 text-white' : '')}
            onClick={() => setIsRealm(false)}
            type="button"
          >
            부문
          </button>
        </div>
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}
