'use client'

import { usePathname, useRouter } from 'next/navigation'

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
      <td className="p-2 text-right">
        {formatPrice(Math.floor(+expenditure.y_yy_dfn_medi_kcur_amt_sum / 1000))}
      </td>
      <td className="p-2 text-right">
        {formatPrice(Math.floor(+expenditure.y_yy_medi_kcur_amt_sum / 1000))}
      </td>
      <td className="p-2 text-right">
        {formatPrice(Math.floor(+expenditure.y_prey_fnl_frc_amt_sum / 1000))}
      </td>
      <td className="p-2 text-right">
        {formatPrice(Math.floor(+expenditure.y_prey_first_kcur_amt_sum / 1000))}
      </td>
    </tr>
  )
}
