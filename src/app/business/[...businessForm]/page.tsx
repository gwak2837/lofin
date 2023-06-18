import Link from 'next/link'
import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { applyLineBreak } from '../../../common/react'
import { PageProps } from '../../../common/types'

async function getBusinessAnalysis(params: Record<string, string & string[]>) {
  const [isCefin, id, nationalTaskId] = params.businessForm
  if (!isCefin || !id || !nationalTaskId) return notFound()

  const searchParams = new URLSearchParams(`id=${id}&nationalTaskId=${nationalTaskId}`)

  if (isCefin === 'true') {
    searchParams.append('isCefin', isCefin)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/analytics/business?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

export default async function Page({ params }: PageProps) {
  const { bard, naver } = await getBusinessAnalysis(params)

  return (
    <div className="p-2">
      <h2 className="text-2xl m-6 text-center">구글 바드</h2>
      {applyLineBreak(bard)}

      <h2 className="text-2xl m-6 text-center">네이버</h2>
      <ul className="grid gap-2">
        {(naver as any[]).map((n, i) => (
          <li key={i} className="border rounded p-2">
            <a href={n.link} target="__blank">
              <h3 className="text-xl my-2" dangerouslySetInnerHTML={{ __html: n.title }} />
              <div dangerouslySetInnerHTML={{ __html: n.description }} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}