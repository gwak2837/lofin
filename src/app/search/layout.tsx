import { ReactNode } from 'react'

import SearchForm from '../SearchForm'

type Props = {
  children: ReactNode
}

export default function SearchLayout({ children }: Props) {
  return (
    <main>
      <h2 className="text-2xl m-6 text-center">검색</h2>
      <SearchForm />

      {children}
    </main>
  )
}
