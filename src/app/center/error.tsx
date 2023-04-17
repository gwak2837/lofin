'use client'

import { useEffect } from 'react'

import { ErrorProps } from '../../common/types'

export default function SearchError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
