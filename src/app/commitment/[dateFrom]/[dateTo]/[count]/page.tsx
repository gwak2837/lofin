import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { applyLineBreak } from '../../../../../common/react'
import { PageProps } from '../../../../../common/types'

type Response = {
  commitments: any[]
}

async function getCommitments(params: Record<string, string & string[]>) {
  const { dateFrom, dateTo, count } = params

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (count !== '20') {
    searchParams.append('count', count)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/commitment?${searchParams}`)
  if (!response.ok) throw new Error(await response.text())

  return (await response.json()) as Response | null
}

export default async function CommitmentsPage({ params }: PageProps) {
  const commitments = await getCommitments(params)

  return (
    <>
      {commitments ? (
        <ol className="m-4 grid gap-8">
          {commitments.commitments.map((commitment) => (
            <li key={commitment.id} className="border overflow-scroll">
              <pre>{JSON.stringify(commitment, null, 2)}</pre>

              <h3 className="mt-6 mb-2 text-xl font-semibold">공약 분야</h3>
              <div>{commitment.prmsrealmname}</div>

              <h3 className="mt-6 mb-2 text-xl font-semibold">공약 제목</h3>
              <div>{commitment.prmstitle}</div>

              <h3 className="mt-6 mb-2 text-xl font-semibold">공약 내용</h3>
              <div>{applyLineBreak(commitment.prmmcont)}</div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-center">{commitments}</div>
      )}
    </>
  )
}
