import Link from 'next/link'

export default async function HomePage() {
  return (
    <main>
      <h2 className="text-2xl m-6 text-center">지역별 데이터랩</h2>
      <Link href="/local">지역</Link>
      <Link href="/center">중앙</Link>
    </main>
  )
}
