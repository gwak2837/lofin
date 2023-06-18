import Image from 'next/image'
import Link from 'next/link'

import { PageProps } from '../../common/types'

export default async function BusinessPage(props: PageProps) {
  return (
    <div className="">
      <pre className="overflow-x-scroll">{JSON.stringify({}, null, 2)}</pre>
    </div>
  )
}
