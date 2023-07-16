import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import { applyLineBreak } from '../../../common/react'
import { PageProps } from '../../../common/types'
import { formatDate, formatPrice } from '../../../common/utils'
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
  console.log('👀 ~ google:', google)
  const finances = business.finances as any[]

  const [category, businessId] = params.businessForm

  return (
    <div className="p-2">
      <h2 className="text-2xl m-6 text-center">사업 상세</h2>
      <h3 className="text-xl my-2 text-center">{business.title}</h3>

      <h5 className="text-sm mt-2 text-center">{business.when} 기준</h5>
      <h5 className="text-sm mb-2 text-center">
        {business.field} {business.sector && `- ${business.sector}`}
      </h5>

      {applyLineBreak(business.content)}

      <h3 className="text-xl text-center">세부 재정상황</h3>

      <div className="overflow-x-auto">
        {category === '0' ? (
          <table className="w-full my-2 whitespace-nowrap">
            <thead>
              <tr>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  번호
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  국회확정금액
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  정부안금액
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold ">
                  전년도최종금액
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  전년도국회확정금액
                </th>
              </tr>
            </thead>
            <tbody>
              {(finances as any[]).map((finance, i) => (
                <tr key={finance.id}>
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2 text-center">
                    {formatPrice(finance.y_yy_dfn_medi_kcur_amt)}원
                  </td>
                  <td className="p-2 text-center">{formatPrice(finance.y_yy_medi_kcur_amt)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.y_prey_fnl_frc_amt)}원</td>
                  <td className="p-2 text-center">
                    {formatPrice(finance.y_prey_first_kcur_amt)}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : category === '1' ? (
          <table className="w-full my-2 whitespace-nowrap">
            <thead>
              <tr>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  번호
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  총액
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  국비
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold ">
                  시도비
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  시군구비
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  기타
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  편성액
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  집행액
                </th>
              </tr>
            </thead>
            <tbody>
              {(finances as any[]).map((finance, i) => (
                <tr key={finance.id}>
                  <td className="p-2 text-center">{i + 1}</td>
                  <td className="p-2 text-center">
                    {formatPrice(+finance.gov + +finance.sido + +finance.sigungu + +finance.etc)}원
                  </td>
                  <td className="p-2 text-center">{formatPrice(finance.gov)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.sido)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.sigungu)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.etc)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.expndtram)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.orgnztnam)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : category === '2' ? (
          <table className="w-full my-2 whitespace-nowrap">
            <thead>
              <tr>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  번호
                </th>
                {finances[0].title && (
                  <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                    사업명
                  </th>
                )}
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  기준일
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  종류
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  회계년도
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  총액
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  국비
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold ">
                  시도비
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  {category === 3 ? '자체' : '시군구비'}
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  기타
                </th>
              </tr>
            </thead>
            <tbody>
              {(finances as any[]).map((finance, i) => (
                <tr key={finance.id}>
                  <td className="p-2 text-center">{i + 1}</td>
                  {finance.title && <td className="p-2 text-center">{finance.title}</td>}
                  <td className="p-2 text-center">{formatDate(finance.basis_date)}</td>
                  <td className="p-2 text-center">{finance.category}</td>
                  <td className="p-2 text-center">{finance.fiscal_year}년</td>
                  <td className="p-2 text-center">
                    {formatPrice(+finance.gov + +finance.sido + +finance.sigungu + +finance.etc)}원
                  </td>
                  <td className="p-2 text-center">{formatPrice(finance.gov)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.sido)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.sigungu)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.etc)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full my-2 whitespace-nowrap">
            <thead>
              <tr>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  번호
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  사업명
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  기준일
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  종류
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  회계년도
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  국비
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold ">
                  시도비
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  {category === 3 ? '자체' : '시군구비'}
                </th>
                <th className="p-4 top-0 sticky text-center bg-sky-200/90 backdrop-blur-sm font-semibold">
                  기타
                </th>
              </tr>
            </thead>
            <tbody>
              {(finances as any[]).map((finance, i) => (
                <tr key={finance.id}>
                  <td className="p-2 text-center">{i + 1}</td>
                  {finance.title && <td className="p-2 text-center">{finance.title}</td>}
                  <td className="p-2 text-center">{formatDate(finance.basis_date)}</td>
                  <td className="p-2 text-center">{finance.category}</td>
                  <td className="p-2 text-center">{finance.fiscal_year}년</td>
                  <td className="p-2 text-center">{formatPrice(finance.gov)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.sido)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.sigungu)}원</td>
                  <td className="p-2 text-center">{formatPrice(finance.etc)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <GoogleBard category={category} businessId={businessId} />

      {/* <div className="border w-full my-10" />

      <h2 className="text-2xl m-6 text-center">Chat GPT</h2>
      <div className="text-center text-slate-400">예정</div> */}

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
        {(google as any[]).map((g, i) => (
          <li key={i} className="border rounded p-2">
            <a href={g.link} target="__blank">
              {/* <h3 className="text-xl my-2" dangerouslySetInnerHTML={{ __html: g.htmlTitle }} /> */}
              {/* <div className="text-black" dangerouslySetInnerHTML={{ __html: g.htmlSnippet }} /> */}
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
