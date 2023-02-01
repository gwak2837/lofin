import { APPLICATION_SHORT_NAME, CANONICAL_URL } from '../common/constants'

export default function RootHead() {
  const title = '중앙위원회 정책참여시스템'
  const description =
    '지자체 세부사업별 예산안 평가, 지역별 정책 공약 · 실천 방안 · 실천 개선안 마련'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/images/og-image.webp" />
      <meta property="og:image:alt" content={`${APPLICATION_SHORT_NAME} 로고`} />
      <meta property="og:url" content={`${CANONICAL_URL}`} />
    </>
  )
}
