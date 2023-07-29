'use client'

import { useQuery } from '@tanstack/react-query'

import { applyLineBreak } from '../../../common/react'
import { fetchCatching } from '../../../common/utils'

type Props = {
  category: number
  businessId: number
}

export default function GoogleBard({ category, businessId }: Props) {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: [`bard-${category}-${businessId}`],
    queryFn: async () =>
      fetchCatching(
        `/analytics/ai?presidentCommitmentId=0&category=${category}&businessId=${businessId}`
      ),
  })

  const bard = data?.bard

  return (
    <>
      <div className="border w-full my-10" />

      <h2 className="text-2xl m-6 text-center">구글 바드</h2>

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
