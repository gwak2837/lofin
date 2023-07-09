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

  return (
    <div className="text-center my-10">
      {isLoading ? <div>Loading...</div> : applyLineBreak(data)}
      {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
    </div>
  )
}
