'use client'

import { usePathname, useRouter } from 'next/navigation'

import { projectOptions } from '../../../../../common/lofin'
import { formatPrice } from '../../../../../common/utils'

type Props = {
  expenditure: any
  i: number
}

export default function ExpenditureRowLink({ expenditure, i }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  function goToLocalExpendituresByRealmPage() {
    router.push(`${pathname}/${encodeURIComponent(expenditure.offc_nm)}/${30}`)
  }

  return (
    <tr className="cursor-pointer hover:bg-slate-100" onClick={goToLocalExpendituresByRealmPage}>
      <td className="p-2 text-center">{i + 1}</td>
      <td className="p-2 text-center">{expenditure.offc_nm}</td>
      <td className="p-2 text-right">{formatPrice(expenditure.y_yy_dfn_medi_kcur_amt_sum)}원</td>
      <td className="p-2 text-right">{formatPrice(expenditure.y_yy_medi_kcur_amt_sum)}원</td>
      <td className="p-2 text-right">{formatPrice(expenditure.y_prey_fnl_frc_amt_sum)}원</td>
      <td className="p-2 text-right">{formatPrice(expenditure.y_prey_first_kcur_amt_sum)}원</td>
    </tr>
  )
}

function getProjectCode(projectLabel: string) {
  for (const projectOption of projectOptions) {
    if (projectOption.label === projectLabel) return projectOption.value
  }
}
