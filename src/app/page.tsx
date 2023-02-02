import SearchForm from './SearchForm'

export default async function HomePage() {
  return (
    <main>
      <h2 className="text-2xl m-6 text-center">검색</h2>

      <SearchForm />
    </main>
  )
}
