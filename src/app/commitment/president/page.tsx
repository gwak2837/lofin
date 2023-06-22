import Image from 'next/image'
import Link from 'next/link'
import presidents from './president.json' assert { type: 'json' }

export default function PresidentPage() {
  return (
    <main>
      <div className="max-w-screen-md mx-auto my-2 flex flex-wrap justify-center items-center">
        <Link href="/">
          <Image
            src="/images/logo.webp"
            alt="jikida-logo"
            className="max-w-xs cursor-pointer"
            width="240"
            height="108"
          />
        </Link>
        <Link href="/commitment/president" className="hover:no-underline focus:no-underline">
          <h2 className="text-2xl whitespace-nowrap text-black ">대통령 공약</h2>
        </Link>
      </div>

      <pre>{JSON.stringify(presidents, null, 2)}</pre>
    </main>
  )
}
