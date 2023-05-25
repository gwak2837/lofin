'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { Option, getOption } from '../../../common/utils'

type TCommitmentCreationForm = {
  realm: string
  title: string
  content: string
}

export default function CommitmentCreationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCommitmentCreationForm>({
    defaultValues: {
      realm: '',
      title: '',
      content: '',
    },
  })

  // 후보 선택
  const [candidateOptions, setCandidateOptions] = useState([])

  async function getCandidates() {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/candidate`)
    if (!response.ok) alert(await response.text())

    const result = await response.json()

    return result.candidates.map((candidate: any) => {
      const { id, sgid, sgname, sggname, sidoname, wiwname, partyname, krname } = candidate

      return {
        label: `${partyname} ${krname} : ${sgid} ${sidoname} ${wiwname ?? sggname} ${sgname}`,
        value: id,
      }
    })
  }

  useEffect(() => {
    ;(async () => {
      setCandidateOptions(await getCandidates())
    })()
  }, [])

  const [candidate, setCandidate] = useState<Option | null>(null)

  // 공약 생성
  const [loading, setLoading] = useState(false)

  async function createCommitment(form: TCommitmentCreationForm) {
    if (!candidate) return alert('Please select candidate')

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

    if (!response.ok) return alert(await response.text())

    const result = await response.json()
    if (result.updatedRowCount === 0) return

    console.log('👀 ~ result:', result)
  }

  return (
    <form
      className="mx-auto p-2 grid gap-4 whitespace-nowrap max-w-screen-md"
      onSubmit={handleSubmit(createCommitment)}
    >
      <div className="grid gap-2">
        <label>후보자</label>
        {candidateOptions.length !== 0 ? (
          <Select
            instanceId="candidate"
            onChange={(newOption) => setCandidate(newOption)}
            options={candidateOptions}
            required
            value={getOption(candidateOptions, candidate)}
          />
        ) : (
          <input className="border p-2 w-full" />
        )}
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

      <button className="p-4 w-full border rounded bg-sky-200 font-semibold" disabled={loading}>
        생성하기
      </button>
    </form>
  )
}
