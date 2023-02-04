'use client'

import dynamic from 'next/dynamic'
import { usePathname, useRouter } from 'next/navigation'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import TDatePicker from 'tui-date-picker'

const DatePicker = dynamic(() => import('../components/DatePicker'), { ssr: false })

type Form = {
  localCode: string
  date: string
  projectCodes: string[]
  count: number
}

export default function SearchForm() {
  const params = usePathname()?.split('/')
  const localCode = params?.[2] ?? seoulGov.value
  const date = params?.[3] ?? '2022-12-31'
  const count = +(params?.[4] ?? 20)
  const projectCodes = hasElement(params?.slice(5)) ?? [scienceTech.value]

  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<Form>({
    defaultValues: {
      localCode,
      projectCodes,
      count,
    },
    delayError: 500,
  })

  const router = useRouter()
  const dateRef = useRef<TDatePicker>(null)

  function search(input: Form) {
    if (!dateRef.current) return

    const date8 = dateRef.current.getDate().toISOString().slice(0, 10)
    router.push(
      `/search/${input.localCode}/${date8}/${input.count}/${input.projectCodes.join('/')}`
    )
  }

  return (
    <form
      className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto"
      onSubmit={handleSubmit(search)}
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>지역</span>
        <div className="z-20">
          <Select
            defaultValue={localGovs.find((localGov) => localGov.value === localCode)}
            instanceId="localCode"
            options={localGovs}
            {...register('localCode', { required: true })}
            onChange={(a) => setValue('localCode', a?.value ?? seoulGov.value)}
          />
        </div>

        <span>집행일자</span>
        <div className="z-10">
          <DatePicker defaultValue={date} forwardedRef={dateRef} />
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
          {...register('count', { required: true })}
        />
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}

const localGovs = [
  { value: '1100000', label: '서울' },
  { value: '2600000', label: '부산' },
  { value: '2700000', label: '대구' },
  { value: '2800000', label: '인천' },
  { value: '2900000', label: '광주' },
  { value: '3000000', label: '대전' },
  { value: '3100000', label: '울산' },
  { value: '3200000', label: '세종' },
  { value: '4100000', label: '경기' },
  { value: '4200000', label: '강원' },
  { value: '4300000', label: '충북' },
  { value: '4400000', label: '충남' },
  { value: '4500000', label: '전북' },
  { value: '4600000', label: '전남' },
  { value: '4700000', label: '경북' },
  { value: '4800000', label: '경남' },
  { value: '4900000', label: '제주' },
]

const projects = [
  { value: '010', label: '일반공공행정' },
  { value: '020', label: '공공질서 및 안전' },
  { value: '050', label: '교육' },
  { value: '060', label: '문화 및 관광' },
  { value: '070', label: '환경' },
  { value: '080', label: '사회복지' },
  { value: '090', label: '보건' },
  { value: '100', label: '농림해양수산' },
  { value: '110', label: '산업ㆍ중소기업 및 에너지' },
  { value: '120', label: '교통 및 물류' },
  { value: '140', label: '국토 및 지역개발' },
  { value: '150', label: '과학기술' },
  { value: '160', label: '예비비' },
  { value: '900', label: '기타' },
]

const seoulGov = localGovs[0]
const scienceTech = projects[11]

function hasElement(a: any[] | undefined) {
  return Array.isArray(a) && a.length > 0 ? a : null
}
