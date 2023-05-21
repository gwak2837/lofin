'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { applyLineBreak } from '../../../../../common/react'

type CommitmentForm = {
  realm: string
  title: string
  content: string
}

type Props = {
  commitment: any
}

export default function EditableCommitment({ commitment }: Props) {
  const pathname = usePathname()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      realm: commitment.prmsrealmname,
      title: commitment.prmstitle,
      content: commitment.prmmcont,
    },
  })

  async function updateCommitment(form: CommitmentForm) {
    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/commitment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ids: [commitment.id],
        realms: [form.realm],
        titles: [form.title],
        contents: [form.content],
      }),
    })
    if (!response.ok) alert(await response.text())

    const result = await response.json()

    if (result.updatedRowCount === 0) return

    // const response2 = await fetch(`/api/revalidate?path=${encodeURIComponent(pathname ?? '')}`)
    // console.log('👀 ~ response2:', await response2.json())

    setIsEditable(false)
  }

  const [isEditable, setIsEditable] = useState(false)

  return isEditable ? (
    <form onSubmit={handleSubmit(updateCommitment)}>
      <div className="gap-4 text-right">
        <button
          className="mr-2 px-4 py-2 border-2 rounded hover:bg-sky-200 hover:border-sky-200 focus:border-sky-200"
          type="submit"
        >
          완료
        </button>
        <button
          className="px-4 py-2  border-2 rounded hover:bg-sky-200 hover:border-sky-200 focus:border-sky-200"
          onClick={() => setIsEditable(false)}
        >
          취소
        </button>
      </div>

      <h3 className="mb-2 text-xl font-semibold">공약 분야</h3>
      <input className="p-2 border w-full" {...register('realm')} />

      <h3 className="mt-6 mb-2 text-xl font-semibold">공약 제목</h3>
      <input className="p-2 border w-full" {...register('title')} />

      <h3 className="mt-6 mb-2 text-xl font-semibold">공약 내용</h3>
      <textarea
        className="p-2 border w-full min-h-screen overflow-y-scroll"
        {...register('content')}
      />
    </form>
  ) : (
    <>
      <div className="text-right">
        <button
          className="px-4 py-2 border-2 rounded hover:bg-sky-200 hover:border-sky-200 focus:border-sky-200"
          onClick={() => setIsEditable(true)}
        >
          수정
        </button>
      </div>

      <h3 className="mb-2 text-xl font-semibold">공약 분야</h3>
      <div>{commitment.prmsrealmname}</div>

      <h3 className="mt-6 mb-2 text-xl font-semibold">공약 제목</h3>
      <div>{commitment.prmstitle}</div>

      <h3 className="mt-6 mb-2 text-xl font-semibold">공약 내용</h3>
      <div>{applyLineBreak(commitment.prmmcont)}</div>
    </>
  )
}
