'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Select from 'react-select'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { getOption } from '../../../common/utils'
import { electionOptions } from '../../../common/vote'

type TCandidateCreationForm = {
  sidoName: string
  sigunguName: string
  wiwName: string
  partyName: string
  krName: string
}

export default function CandidateCreationForm() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TCandidateCreationForm>({
    defaultValues: {
      sidoName: '',
      sigunguName: '',
      wiwName: '',
      partyName: '',
      krName: '',
    },
  })

  const [election, setElection] = useState<any>({})

  // 후보자 생성
  const [loading, setLoading] = useState(false)

  async function createCommitment(form: TCandidateCreationForm) {
    setLoading(true)

    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/commitment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sgId: election.date,
        sgTypecode: election.type,
        sidoName: form.sidoName,
        sggName: form.sigunguName,
        wiwName: form.wiwName,
        partyName: form.partyName,
        krName: form.krName,
      }),
    })

    setLoading(false)

    if (!response.ok) return toast.error(await response.text())

    const result = await response.json()
    if (result.updatedRowCount === 0) return toast.error('후보자 공약 생성 실패')

    toast.success('후보자 공약 생성 성공')

    reset()
  }

  return (
    <form
      className="mx-auto p-2 grid gap-4 whitespace-nowrap max-w-screen-md"
      onSubmit={handleSubmit(createCommitment)}
    >
      <div className="grid gap-2">
        <label>선거 종류</label>
        <Select
          instanceId="electionOptions"
          onChange={(newOption) => setElection(newOption)}
          options={electionOptions}
          required
          value={getOption(electionOptions, election)}
        />
      </div>

      <div className="grid gap-2">
        <label>시·도</label>
        <input
          className="border p-2 w-full"
          placeholder="서울특별시"
          required
          {...register('sidoName', { required: true })}
        />
      </div>

      <div className="grid gap-2">
        <label>시·군·구</label>
        <input
          className="border p-2 w-full"
          placeholder="강동구"
          required
          {...register('sigunguName')}
        />
      </div>

      <div className="grid gap-2">
        <label>정당</label>
        <input
          className="border p-2 w-full"
          placeholder="무소속"
          required
          {...register('partyName', { required: true })}
        />
      </div>

      <div className="grid gap-2">
        <label>이름</label>
        <input
          className="border p-2 w-full"
          placeholder="홍길동"
          required
          {...register('krName', { required: true })}
        />
      </div>

      <button
        className="p-4 w-full border rounded border-sky-400 bg-sky-200 font-semibold"
        disabled={loading}
      >
        생성하기
      </button>
    </form>
  )
}
