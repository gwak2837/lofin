'use client'

import { useForm } from 'react-hook-form'

type Form = {
  localCode: string
  date: string
  projectCodes: string[]
  count: number
}

export default function SearchForm() {
  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
  } = useForm<Form>({
    defaultValues: {
      localCode: '',
      date: '',
      projectCodes: '',
      count: 20,
    },
    delayError: 500,
  })

  function search(input: Form) {
    console.log('👀 - input', input)
  }

  return (
    <form
      className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto"
      onSubmit={handleSubmit(search)}
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-4">
        <span>지역</span>
        <input className="p-2 border w-full" {...register('localCode')} />

        <span>집행일자</span>
        <input className="p-2 border w-full" {...register('date')} />

        <span>세부사업</span>
        <input className="p-2 border w-full" {...register('projectCodes')} />

        <span>개수</span>
        <input
          className="p-2 border w-full"
          min="1"
          max="100"
          placeholder="20"
          type="number"
          {...register('count')}
        />
      </div>

      <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    </form>
  )
}
