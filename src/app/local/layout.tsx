import { ReactNode } from 'react'

import LocalExpenditureForm from './LocalExpenditureForm'

type Props = {
  children: ReactNode
}

export default function SearchLayout({ children }: Props) {
  return (
    <main>
      <h2 className="text-2xl m-6 text-center">예산 진단 지표 분석</h2>

      <LocalExpenditureForm />

      {children}
    </main>
  )
}
