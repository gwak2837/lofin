import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'
import CandidateCreationForm from './CandidateCreationForm'
import CommitmentCreationForm from './CommitmentCreationForm'

async function getCandidateOptions() {
  const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/candidate`)
  if (!response.ok) throw new Error(await response.text())

  const result = await response.json()

  return result.candidates.map((candidate: any) => {
    const { id, sgId, sgName, sigunguName, sidoName, wiwName, partyName, krName } = candidate

    return {
      label: `${partyName} ${krName} : ${sgId} ${sidoName} ${wiwName ?? sigunguName} ${sgName}`,
      value: id,
    }
  })
}

export default async function CommitmentPage() {
  const candidateOptions = await getCandidateOptions()

  return (
    <>
      <h3 className="mx-auto mt-8 mb-2 p-2 whitespace-nowrap max-w-screen-md text-xl font-semibold">
        후보자 생성하기
      </h3>

      <CandidateCreationForm />

      <h3 className="mx-auto mt-8 mb-2 p-2 whitespace-nowrap max-w-screen-md text-xl font-semibold">
        공약 생성하기
      </h3>

      <CommitmentCreationForm candidateOptions={candidateOptions} />
    </>
  )
}
