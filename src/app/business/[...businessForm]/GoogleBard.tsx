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
    queryKey: ['todos'],
    queryFn: async () =>
      fetchCatching(
        `/analytics/ai?presidentCommitmentId=0&category=${category}&businessId=${businessId}`
      ),
  })

  const bard = data?.bard

  return (
    bard && (
      <>
        <div className="border w-full my-10" />

        <h2 className="text-2xl m-6 text-center">구글 바드</h2>
        <div>
          <h3 className="text-xl m-6 text-center">연관성 있음</h3>
          {isLoading ? (
            <div className="w-full h-20 bg-slate-200 rounded animate-pulse" />
          ) : (
            applyLineBreak(bard.positive.content)
          )}

          <h3 className="text-xl m-6 text-center">연관성 없음</h3>
          {isLoading ? (
            <div className="w-full h-20 bg-slate-200 rounded animate-pulse" />
          ) : (
            applyLineBreak(bard.negative.content)
          )}

          {isError && (
            <>
              <h3 className="text-xl m-6 text-center">오류</h3>
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </>
          )}
        </div>
      </>
    )
  )
}
