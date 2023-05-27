import { notFound } from 'next/navigation'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../../common/constants'
import { PageProps } from '../../../../common/types'
import EditableCommitment from './EditableCommitment'

type Response = {
  commitments: any[]
}

async function getCommitments(params: Record<string, string & string[]>) {
  const [dateFrom, dateTo, sido, sigungu, electionType, name, count] = params.commitmentForm

  if (!dateFrom || !dateTo) return notFound()

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (sido !== 'null') {
    searchParams.append('sido', sido)
  }

  if (sigungu !== 'null') {
    searchParams.append('sigungu', sigungu)
  }

  if (electionType !== 'null') {
    searchParams.append('electionType', electionType)
  }

  if (name !== 'null') {
    searchParams.append('name', name)
  }

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
        <ol className="m-4 grid gap-4">
          {commitments.commitments.map((commitment) => (
            <li key={commitment.id} className="border-2 rounded-lg overflow-scroll">
              <div className="p-2 flex gap-4 justify-center">
                <span>{commitment.candidate.sgId}</span>
                <span>{commitment.candidate.sgName}</span>
                <span>{commitment.candidate.sidoName}</span>
                <span>{commitment.candidate.sigunguName}</span>
                {commitment.candidate.wiwName && <span>{commitment.candidate.wiwName}</span>}
                {commitment.candidate.partyName && <span>{commitment.candidate.partyName}</span>}
                <span>{commitment.candidate.krName}</span>
              </div>
              <div className="border w-full" />

              <div className="p-2">
                <EditableCommitment commitment={commitment} />
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-center">{commitments}</div>
      )}
    </>
  )
}
