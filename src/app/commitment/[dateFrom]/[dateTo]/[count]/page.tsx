import { NEXT_PUBLIC_BACKEND_URL } from '../../../../../common/constants'
import { PageProps } from '../../../../../common/types'
import EditableCommitment from './EditableCommitment'

type Response = {
  commitments: any[]
}

async function getCommitments(params: Record<string, string & string[]>) {
  const { dateFrom, dateTo, count } = params

  const searchParams = new URLSearchParams(`dateFrom=${dateFrom}&dateTo=${dateTo}`)

  if (count !== '20') {
    searchParams.append('count', count)
  }

  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/commitment?${searchParams}`, {
    cache: 'no-store',
  })
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
                <span>{commitment.candidate__sgid}</span>
                <span>{commitment.candidate__sgname}</span>
                <span>{commitment.candidate__sidoname}</span>
                <span>{commitment.candidate__sggname}</span>
                {commitment.candidate__wiwname && <span>{commitment.candidate__wiwname}</span>}
                {commitment.candidate__partyname && <span>{commitment.candidate__partyname}</span>}
                <span>{commitment.candidate__krname}</span>
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
