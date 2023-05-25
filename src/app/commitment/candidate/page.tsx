import CommitmentCreationForm from './CommitmentCreationForm'

export default function CommitmentPage() {
  return (
    <>
      <h3 className="mx-auto mt-8 mb-2 p-2 whitespace-nowrap max-w-screen-md text-xl font-semibold">
        공약 생성하기
      </h3>
      <CommitmentCreationForm />
    </>
  )
}
