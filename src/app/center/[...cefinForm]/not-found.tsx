import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/center/2023/2023/null/전체/전체/30">others</Link>
      </p>
    </div>
  )
}
