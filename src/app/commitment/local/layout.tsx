import { ReactNode } from 'react'

import CommitmentForm from './CommitmentForm'

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <main>
      <CommitmentForm />

      {children}
    </main>
  )
}
