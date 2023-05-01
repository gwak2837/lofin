'use client'

import { ErrorProps } from '../../../../../../../common/types'

export default function CenterExpenditureError({ error, reset }: ErrorProps) {
  return (
    <div className="text-center">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
