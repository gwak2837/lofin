import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <p>
        View <Link href="/local/2023-01-01/2023-12-31/1134000/0/20">others</Link>
      </p>
    </div>
  )
}
