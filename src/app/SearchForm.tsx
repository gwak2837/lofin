'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import TDatePicker from 'tui-date-picker'

import { localGovOptions, realms } from '../common/lofin'
import { hasElement } from '../common/utils'

const projects = realms

const DatePicker = dynamic(() => import('../components/DatePicker'), {
  ssr: false,
  loading: () => <input className="w-full p-2 border disabled:cursor-not-allowed" disabled />,
})

type Form = {
  localGovCode: string
  date: string
  projectCodes: string[]
  count: number
}

export default function SearchForm() {
  const params = usePathname()?.split('/') ?? []
  const date = params[2] ?? '2022-12-31'
  const localGovCode =
    params[3] === 'null'
      ? localGovOptions[0].value
      : params[4] === 'true'
      ? params[3].slice(0, 2)
      : params[3] ?? seoulGov.value
  const count = +(params[5] ?? 20)
  const projectCodes = hasElement(params.slice(6)) ?? [scienceTech.value]

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<Form>({
    defaultValues: {
      localGovCode,
      projectCodes,
      count,
    },
    delayError: 500,
  })

  const router = useRouter()
  const dateRef = useRef<TDatePicker>(null)

  function search(input: Form) {
    if (!dateRef.current) return

    const localGov = input.localGovCode
    const date8 = dateRef.current.getDate().toISOString().slice(0, 10)
    const localGovCode = localGov === 'null' ? localGov : localGov.padEnd(7, '0')
    const selectAllLocalGov = localGov.length === 2
    const projectCodes = input.projectCodes.join('/')
    const { count } = input

    router.push(`/search/${date8}/${localGovCode}/${selectAllLocalGov}/${count}/${projectCodes}`)
  }

  return (
    <form
      className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto"
      onSubmit={handleSubmit(search)}
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>집행일자</span>
        <div className="z-20">
          <DatePicker defaultValue={date} forwardedRef={dateRef} />
        </div>

        <span>지자체</span>
        <div className="z-10">
          <Select
            defaultValue={getLocalGov(localGovOptions, localGovCode)}
            instanceId="localGovOptions"
            options={localGovOptions}
            {...register('localGovCode', { required: true })}
            onChange={(newLocalGov) => newLocalGov && setValue('localGovCode', newLocalGov.value)}
          />
        </div>

        <span>분야</span>
        <Select
          defaultValue={projects.filter((project) => projectCodes.includes(project.value))}
          instanceId="projectCodes"
          isMulti
          options={projects}
          {...register('projectCodes', { required: true })}
          onChange={(projects) =>
            setValue('projectCodes', projects.map((project) => project.value).sort())
          }
        />

        <span>개수</span>
        <input
          className="p-2 border w-full"
          min="1"
          max="100"
          placeholder="20"
          type="number"
          {...register('count', { required: true, min: 1, max: 100 })}
        />
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}

type Option = {
  label: string
  value: string
}

const seoulGov = localGovOptions[1].options![0]
const scienceTech = projects[11]

function getLocalGov(groupedLocalGovs: Record<string, any>[], localGovCode?: string) {
  for (const local of groupedLocalGovs) {
    if (local.value === localGovCode) return local
    const a = local.options?.find((localGov: Option) => localGov.value === localGovCode)
    if (a) return a
  }
}
