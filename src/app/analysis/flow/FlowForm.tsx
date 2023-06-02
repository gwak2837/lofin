'use client'

import { usePathname, useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import Select from 'react-select'

import { cefinRealmOptions, cefinSectorOptions } from '../../../common/cefin'
import { localOptions, localRealmOptions, localSectorOptions } from '../../../common/lofin'
import { getNestedOption, getOption } from '../../../common/utils'

export default function FlowForm() {
  // Pathname
  const params = usePathname()?.split('/') ?? []
  const yearParam = params[3] ?? '2022'
  const localCodeParam = params[4] ? +params[4] : 1100000
  const isRealmParam = params[5] ? Boolean(params[5]) : true
  const centerRealmOrSectorParam = params[6] ? decodeURIComponent(params[6]) : '사회복지'
  const localRealmOrSectorParam = params[7] ? +params[7] : 80

  // Form
  const [year, setYear] = useState(yearParam)
  const [localCode, setLocalCode] = useState(localCodeParam)
  const [isRealm, setIsRealm] = useState(isRealmParam)
  const [centerRealmOrSector, setCenterRealmOrSector] = useState(centerRealmOrSectorParam)
  const [localRealmOrSector, setLocalRealmOrSector] = useState(localRealmOrSectorParam)

  useEffect(() => {
    if (isRealm) {
      setCenterRealmOrSector('사회복지')
      setLocalRealmOrSector(80)
    } else {
      setCenterRealmOrSector('기초생활보장')
      setLocalRealmOrSector(81)
    }
  }, [isRealm])

  // Search
  const router = useRouter()

  function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const _localRealmOrSector = encodeURIComponent(localRealmOrSector)
    let searchResultPage = `/analysis/flow/${year}/${localCode}/${isRealm}/${centerRealmOrSector}/${_localRealmOrSector}`
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
        <div className="z-30">
          <Select
            instanceId="sigunguLocalOptions"
            onChange={(newLocalGov) => newLocalGov && setLocalCode(newLocalGov.value)}
            options={localOptions}
            required
            value={getNestedOption(localOptions, localCode)}
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

        {isRealm ? (
          <>
            <span>중앙 분야</span>
            <div className="z-20">
              <Select
                instanceId="cefinRealmOptions"
                onChange={(newValue) => newValue && setCenterRealmOrSector(newValue.value)}
                options={cefinRealmOptions}
                required
                value={getOption(cefinRealmOptions, centerRealmOrSector)}
              />
            </div>

            <span>지방 분야</span>
            <div className="z-10">
              <Select
                instanceId="localRealmOptions"
                onChange={(newOption) => newOption && setLocalRealmOrSector(newOption.value)}
                options={localRealmOptions}
                required
                value={getOption(localRealmOptions, localRealmOrSector)}
              />
            </div>
          </>
        ) : (
          <>
            <span>중앙 부문</span>
            <div className="z-20">
              <Select
                instanceId="cefinSectorOptions"
                onChange={(newOption) => newOption && setCenterRealmOrSector(newOption.value)}
                options={cefinSectorOptions}
                required
                value={getOption(cefinSectorOptions, centerRealmOrSector)}
              />
            </div>

            <span>지방 부문</span>
            <div className="z-10">
              <Select
                instanceId="localSectorOptions"
                onChange={(newOption) => newOption && setLocalRealmOrSector(newOption.value)}
                options={localSectorOptions}
                required
                value={getOption(localSectorOptions, localRealmOrSector)}
              />
            </div>
          </>
        )}
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}
