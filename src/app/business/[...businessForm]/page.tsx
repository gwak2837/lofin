import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { applyLineBreak } from '../../../common/react'
import { PageProps } from '../../../common/types'
import EvaluationForm from './EvaluationForm'
import GoogleBard from './GoogleBard'

export const revalidate = 86400

async function getBusinessAnalysis(params: Record<string, string & string[]>) {
  const [category, businessId] = params.businessForm
  if (!category || !businessId) return notFound()

  const searchParams = new URLSearchParams(`category=${category}&id=${businessId}`)

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/analytics/business?${searchParams}`)
  if (response.status === 404) notFound()
  else if (!response.ok) throw new Error(await response.text())

  return await response.json()
}

export default async function Page({ params }: PageProps) {
  const { business, naver, youtube, google } = await getBusinessAnalysis(params)
  const finance = business.finance as any[]

  const [category, businessId] = params.businessForm

  return (
    <div className="p-2">
      <h2 className="text-2xl m-6 text-center">사업 상세</h2>
      <h3 className="text-xl my-2 text-center">{business.title}</h3>

      <h5 className="text-sm mt-2 text-center">{business.when} 기준</h5>
      <h5 className="text-sm mb-2 text-center">
        {business.field} {business.sector}
      </h5>

      {applyLineBreak(business.content)}

      {finance && (
        <>
          <h3 className="text-xl text-center">세부과제</h3>

          <ul className="">
            {finance?.map((f, i) => (
              <li className="m-2" key={i}>
                <pre>{JSON.stringify(f, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="border w-full my-10" />

      <h2 className="text-2xl m-6 text-center">구글 바드</h2>
      <GoogleBard category={category} businessId={businessId} />

      <div className="border w-full my-10" />

      <h2 className="text-2xl m-6 text-center">Chat GPT</h2>
      <div className="text-center text-slate-400">예정</div>

      <div className="border w-full my-10" />

      <h2 className="text-2xl m-6 text-center">유튜브 검색</h2>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(512px,1fr))] gap-2 overflow-x-auto">
        {(youtube as any[]).map((y, i) => (
          <li key={i} className="rounded overflow-hidden">
            <iframe
              id={`ytplayer-${y.id.videoId}`}
              className="aspect-video	w-full border-0"
              src={`https://www.youtube.com/embed/${y.id.videoId}`}
              allowFullScreen
            />
          </li>
        ))}
      </ul>

      <div className="border w-full my-20" />

      <h2 className="text-2xl m-6 text-center">네이버 검색</h2>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(512px,1fr))] gap-2 overflow-x-auto">
        {(naver as any[]).map((n, i) => (
          <li key={i} className="border rounded p-2">
            <a href={n.link} target="__blank">
              <h3 className="text-xl my-2" dangerouslySetInnerHTML={{ __html: n.title }} />
              <div className="text-black" dangerouslySetInnerHTML={{ __html: n.description }} />
            </a>
          </li>
        ))}
      </ul>

      <div className="border w-full my-20" />

      <h2 className="text-2xl m-6 text-center">구글 검색</h2>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(512px,1fr))] gap-2 overflow-x-auto">
        {(google as any[]).map((n, i) => (
          <li key={i} className="border rounded p-2">
            <a href={n.link} target="__blank">
              <h3 className="text-xl my-2" dangerouslySetInnerHTML={{ __html: n.htmlTitle }} />
              <div className="text-black" dangerouslySetInnerHTML={{ __html: n.htmlSnippet }} />
            </a>
          </li>
        ))}
      </ul>

      <div className="border w-full my-20" />

      <h2 className="text-2xl m-6 text-center">SMART PLUS 평가</h2>
      <EvaluationForm />
    </div>
  )
}
