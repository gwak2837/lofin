import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'
import FullyStackedBarChart from '../../../../components/FullyStackedBarChart'

type Response = {
  lofin: Record<string, any>[]
  cefin: Record<string, any>[]
}

async function getRatioAnalysis(params: Record<string, string & string[]>) {
  const [dateFrom, dateTo, localCode, isRealm] = params.ratioForm
  if (!dateFrom || !dateTo || !localCode || !isRealm) return notFound()

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (localCode !== '0') {
    searchParams.append('localCode', localCode)
  }

  if (isRealm !== 'false') {
    searchParams.append('isRealm', isRealm)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/analysis/ratio?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response
}

export default async function RatioAnalysisPage({ params }: PageProps) {
  const ratioAnalysis = await getRatioAnalysis(params)
  console.log('👀 ~ ratioAnalysis:', ratioAnalysis)

  return (
    <div className="">
      <main className="">
        <FullyStackedBarChart
          id="ratioAnalysis"
          data={ratioAnalysis}
          keyField="type"
          valueFields={[
            '사회복지',
            '일반·지방행정',
            '교육',
            '국방',
            '산업·중소기업및에너지',
            '농림수산',
            '공공질서및안전',
            '교통및물류',
            '보건',
            '환경',
            '과학기술',
            '통신',
            '문화및관광',
            '통일·외교',
            '예비비',
            '국토및지역개발',
            '일반공공행정',
            '기타',
          ]}
        />
        {/* <pre className="overflow-x-scroll">{JSON.stringify(ratioAnalysis, null, 2)}</pre> */}
      </main>
    </div>
  )
}
