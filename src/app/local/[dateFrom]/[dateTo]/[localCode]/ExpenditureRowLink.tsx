'use client'

import { usePathname, useRouter } from 'next/navigation'

import { localRealmOptions } from '../../../../../common/lofin'
import { formatPrice } from '../../../../../common/utils'

type Props = {
  expenditure: any
  i: number
}

export default function ExpenditureRowLink({ expenditure, i }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function goToLocalExpendituresByRealmPage() {
    router.push(`${pathname}/${getProjectCode(expenditure.realm)}/${20}`)
  }

  return (
    <tr className="cursor-pointer hover:bg-slate-100" onClick={goToLocalExpendituresByRealmPage}>
      <td className="p-2 text-center">{i + 1}</td>
      <td className="p-2 text-center">{expenditure.realm}</td>
      <td className="p-2 text-right">{formatPrice(expenditure.budget_crntam_sum)}원</td>
      <td className="p-2 text-right">{formatPrice(expenditure.nxndr_sum)}원</td>
      <td className="p-2 text-right">{formatPrice(expenditure.cty_sum)}원</td>
      <td className="p-2 text-right">{formatPrice(expenditure.signgunon_sum)}원</td>
      <td className="p-2 text-right">{formatPrice(expenditure.etc_crntam_sum)}원</td>
      <td className="p-2 text-right">{formatPrice(expenditure.expndtram_sum)}원</td>
      <td className="p-2 text-right">{formatPrice(expenditure.orgnztnam_sum)}원</td>
    </tr>
  )
}

function getProjectCode(projectLabel: string) {
  for (const projectOption of localRealmOptions) {
    if (projectOption.label === projectLabel) return projectOption.value
  }
}
