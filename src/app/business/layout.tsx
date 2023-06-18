import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function BusinessLayout({ children }: Props) {
  return <main>{children}</main>
}
