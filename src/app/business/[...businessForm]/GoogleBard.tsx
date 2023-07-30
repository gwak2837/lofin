'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { applyLineBreak } from '../../../common/react'
import { fetchCatching } from '../../../common/utils'

type Props = {
  businessId: string
  businessCategory: number
  relatedCommitments: any
}

export default function GoogleBard({ businessId, businessCategory, relatedCommitments }: Props) {
  const [commitmentId, setCommitmentId] = useState(relatedCommitments[0].id)

  const { data, error, isError, isLoading } = useQuery({
    queryKey: [`bard-${businessId}-${businessCategory}-${commitmentId}`],
    queryFn: async () =>
      fetchCatching(
        `/analytics/ai?businessId=${businessId}&businessCategory=${businessCategory}&commitmentId=${commitmentId}`
      ),
  })

  const bard = data?.bard

  return (
    <>
      <div className="border w-full my-10" />

      <h2 className="text-2xl my-6 text-center">구글 바드</h2>

      <h3 className="my-3 text-xl text-center">공약</h3>

      <ul className="flex gap-2 overflow-x-auto">
        {relatedCommitments.map((commitment: any) => (
          <li
            key={commitment.id}
            className="p-2 max-w-screen-sm flex flex-col justify-between gap-2 rounded border hover:bg-slate-100"
            onClick={() => setCommitmentId(commitment.id)}
          >
            <h4 className="font-semibold break-keep">{commitment.title}</h4>
            {/* <div>{commitment.content}</div> */}
            <div className="flex gap-2">
              <div className="whitespace-nowrap">{commitment.field}</div>
              <div className="whitespace-nowrap">{commitment.district}</div>
              <div className="whitespace-nowrap">{commitment.category}</div>
              <div className="whitespace-nowrap">{commitment.electionDate}</div>
            </div>
          </li>
        ))}
      </ul>

      <div>
        {(isLoading || bard) && <h3 className="my-3 text-xl text-center">연관성 있음</h3>}
        <div className={isLoading ? 'w-full min-h-[20rem] bg-slate-200 rounded animate-pulse' : ''}>
          {bard && applyLineBreak(bard.positive.content)}
        </div>

        {(isLoading || bard) && <h3 className="my-3 text-xl text-center">연관성 없음</h3>}
        <div className={isLoading ? 'w-full min-h-[20rem] bg-slate-200 rounded animate-pulse' : ''}>
          {bard && applyLineBreak(bard.negative.content)}
        </div>

        {isError && (
          <>
            <h3 className="text-xl m-6 text-center">오류</h3>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </>
        )}
      </div>
    </>
  )
}
