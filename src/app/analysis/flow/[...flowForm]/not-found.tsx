import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center">
      <h2 className="text-2xl m-6">결과 없음</h2>
      <p className="m-2">해당 조건을 만족하는 자료를 찾을 수 없습니다</p>
      <p className="m-2">
        다른 조건으로{' '}
        <Link href="/analysis/flow/2023-01-01/2023-12-31/sido/true/사회복지/80">검색하기</Link>
      </p>
    </div>
  )
}
