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
  const { nationalTask, business, bard, naver, youtube } = await getBusinessAnalysis(params)

  return (
    <div className="p-2">
      <h2 className="text-2xl m-6 text-center">구글 바드</h2>
      <h3 className="text-xl my-2">연관성 있음</h3>
      {applyLineBreak(bard[0])}
      <h3 className="text-xl my-2">연관성 없음</h3>
      {applyLineBreak(bard[1])}

      <h2 className="text-2xl m-6 text-center">Chat GPT</h2>
      <div className="text-center text-slate-400">예정</div>

      <h2 className="text-2xl m-6 text-center">유튜브 검색</h2>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(512px,1fr))] gap-2">
        {(youtube as any[]).map((y, i) => (
          <li key={i} className="border rounded p-2">
            <iframe
              id={`ytplayer-${y.id.videoId}`}
              className="aspect-video	w-full border-0"
              src={`https://www.youtube.com/embed/${y.id.videoId}`}
              allowFullScreen
            />
          </li>
        ))}
      </ul>

      <h2 className="text-2xl m-6 text-center">네이버 검색</h2>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(512px,1fr))] gap-2">
        {(naver as any[]).map((n, i) => (
          <li key={i} className="border rounded p-2">
            <a href={n.link} target="__blank">
              <h3 className="text-xl my-2" dangerouslySetInnerHTML={{ __html: n.title }} />
              <div dangerouslySetInnerHTML={{ __html: n.description }} />
            </a>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl m-6 text-center">구글 검색</h2>
      <div className="text-center text-slate-400">예정</div>

      <div className="border w-full my-20" />

      <h2 className="text-2xl m-6 text-center">입력</h2>
      <h3 className="text-xl my-2">국정과제</h3>
      {applyLineBreak(nationalTask)}

      <h3 className="text-xl my-2">지자체 사업</h3>
      <pre className="overflow-x-scroll">{JSON.stringify(business, null, 2)}</pre>
    </div>
  )
}
