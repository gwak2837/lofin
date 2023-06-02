'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { Option, getOption } from '../../../common/utils'
import LoadingSpinner from '../../../components/LoadingSpinner'

type TCommitmentCreationForm = {
  realm: string
  title: string
  content: string
}

type Props = {
  candidateOptions: any[]
}

export default function CommitmentCreationForm({ candidateOptions }: Props) {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TCommitmentCreationForm>({
    defaultValues: {
      realm: '',
      title: '',
      content: '',
    },
  })

  const [candidate, setCandidate] = useState<Option | null>(null)

  // 공약 생성
  const [loading, setLoading] = useState(false)

  async function createCommitment(form: TCommitmentCreationForm) {
    if (!candidate) return toast.error('`후보자`를 선택해주세요')

    setLoading(true)

    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/commitment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        realm: form.realm,
        title: form.title,
        content: form.content,
        candidateId: +candidate.value,
      }),
    })

    setLoading(false)

    if (!response.ok) return toast.error(await response.text())

    const result = await response.json()
    if (result.updatedRowCount === 0) return toast.error('후보자 공약 생성 실패')

    const response2 = await fetch(`/api/revalidate?path=/commitment/candidate`)
    console.log('👀 ~ response2:', await response2.json())

    toast.success('후보자 공약 생성 성공')

    reset()
  }

  return (
    <form
      className="mx-auto p-2 grid gap-4 whitespace-nowrap max-w-screen-md"
      onSubmit={handleSubmit(createCommitment)}
    >
      <div className="grid gap-2">
        <label>후보자</label>
        <Select
          instanceId="candidate"
          onChange={(newOption) => setCandidate(newOption)}
          options={candidateOptions}
          required
          value={getOption(candidateOptions, candidate)}
        />
      </div>

      <div className="grid gap-2">
        <label>분야</label>
        <input className="border p-2 w-full" required {...register('realm', { required: true })} />
      </div>

      <div className="grid gap-2">
        <label>제목</label>
        <input className="border p-2 w-full" required {...register('title', { required: true })} />
      </div>

      <div className="grid gap-2">
        <label>내용</label>
        <textarea
          className="border p-2 w-full min-h-[50vh]"
          required
          {...register('content', { required: true })}
        />
      </div>

      <button
        className="p-4 w-full flex gap-2 justify-center items-center border border-sky-400 rounded bg-sky-200 font-semibold disabled:bg-slate-200 disabled:border-slate-400"
        disabled={loading}
      >
        {loading && <LoadingSpinner />} 생성하기
      </button>
    </form>
  )
}
