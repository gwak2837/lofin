'use client'

import { usePathname } from 'next/navigation'

// const DateRangePicker = dynamic(() => import('../../components/DateRangePicker'), {
//   ssr: false,
//   loading: () => (
//     <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
//       <input
//         aria-label="Date"
//         className="p-2 border disabled:cursor-not-allowed"
//         disabled
//         placeholder="YYYY-MM-DD"
//         type="text"
//       />
//       <span>to</span>
//       <input
//         aria-label="Date"
//         className="p-2 border disabled:cursor-not-allowed"
//         disabled
//         placeholder="YYYY-MM-DD"
//         type="text"
//       />
//     </div>
//   ),
// })

export default function CommitmentForm() {
  // Pathname: Call by value
  const params = usePathname()?.split('/') ?? []
  const basisDateParam = params[2] ?? '2023-03-31'
  const fiscalYearsParam = params[3] ? decodeURIComponent(params[3]) : '0'
  const localCodesParam = params[4] ? decodeURIComponent(params[4]) : '1134000'

  // Form
  //   const [calendarType, setCalendarType] = useState<CalendarType>('year')
  //   const dateRangePickerRef = useRef<TDateRangePicker>(null)
  //   const [selectedLocalOptions, setSelectedLocalOptions] = useState(
  //     localCodesParam.split(',').map((localCode) => getLocalGovOption(+localCode))
  //   )
  //   const [selectedFieldOptions, setSelectedFieldOptions] = useState(
  //     fieldCodesParam.split(',').map((fieldCode) => getLocalFieldOption(+fieldCode))
  //   )
  //   const [count, setCount] = useState(countParam)
  //   // Route
  //   useEffect(() => {
  //     setSelectedLocalOptions(
  //       localCodesParam.split(',').map((localCode) => getLocalGovOption(+localCode))
  //     )
  //     setSelectedFieldOptions(
  //       fieldCodesParam.split(',').map((fieldCode) => getLocalFieldOption(+fieldCode))
  //     )
  //   }, [fieldCodesParam, localCodesParam])
  //   const router = useRouter()
  //   function search(e: FormEvent<HTMLFormElement>) {
  //     e.preventDefault()
  //     if (!dateRangePickerRef.current) return
  //     const dateFrom = dateRangePickerRef.current.getStartDate().toISOString().slice(0, 10)
  //     const dateTo = (() => {
  //       const endDate = dateRangePickerRef.current.getEndDate()
  //       if (calendarType === 'date') {
  //         const month = String(endDate.getMonth() + 1).padStart(2, '0')
  //         const date = String(endDate.getDate()).padStart(2, '0')
  //         return `${endDate.getFullYear()}-${month}-${date}`
  //       } else if (calendarType === 'month') {
  //         endDate.setMonth(endDate.getMonth() + 1)
  //         endDate.setDate(0)
  //         const month = String(endDate.getMonth() + 1).padStart(2, '0')
  //         const date = String(endDate.getDate()).padStart(2, '0')
  //         return `${endDate.getFullYear()}-${month}-${date}`
  //       } else {
  //         return `${endDate.getFullYear()}-${12}-${31}`
  //       }
  //     })()
  //     const localCodes = selectedLocalOptions
  //       .map((option) => option?.value)
  //       .sort()
  //       .join(',')
  //     const fieldCodes = selectedFieldOptions
  //       .map((option) => option?.value)
  //       .sort()
  //       .join(',')
  //     const searchResultPage = `/local/${dateFrom}/${dateTo}/${localCodes}/${fieldCodes}/${count}`
  //     router.push(searchResultPage)
  //   }
  //   // Input handler
  //   function handleLocalOptionsChange(newOptions: any) {
  //     if (selectedLocalOptions[0]?.value === 0)
  //       return setSelectedLocalOptions(newOptions.filter((option: any) => option.value !== 0))
  //     else if (newOptions.find((option: any) => option.value === 0))
  //       return setSelectedLocalOptions([localOptions[0].options[0]])
  //     else setSelectedLocalOptions(newOptions)
  //   }
  //   function handleFieldOptionsChange(newOptions: any) {
  //     if (selectedFieldOptions[0]?.value === 0)
  //       return setSelectedFieldOptions(newOptions.filter((option: any) => option.value !== 0))
  //     else if (newOptions.find((option: any) => option.value === 0))
  //       return setSelectedFieldOptions([localFieldOptions[0]])
  //     else setSelectedFieldOptions(newOptions)
  //   }
  return (
    <div />
    // <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={search}>
    //       <div className="grid grid-cols-[auto_1fr] items-center gap-4">
    //         <span>구분</span>
    //         <div className="z-30">
    //           <Select
    //             isDisabled={true}
    //             instanceId="type"
    //             onChange={(newType) => newType && setCalendarType(newType.value)}
    //             options={calendarTypeOptions}
    //             required
    //             value={getOption(calendarTypeOptions, calendarType)}
    //           />
    //         </div>
    //         <span>기간</span>
    //         <div className="z-20">
    //           <DateRangePicker
    //             calendarType={calendarType}
    //             defaultDateFrom={dateFrom}
    //             defaultDateTo={dateTo}
    //             forwardedRef={dateRangePickerRef}
    //           />
    //         </div>
    //         <span>지자체</span>
    //         <div className="z-10">
    //           <Select
    //             instanceId="localOptions"
    //             isMulti
    //             onChange={handleLocalOptionsChange}
    //             options={localOptions}
    //             required
    //             value={selectedLocalOptions}
    //           />
    //         </div>
    //         <span>분야</span>
    //         <div>
    //           <Select
    //             instanceId="projectCode"
    //             isMulti
    //             onChange={handleFieldOptionsChange}
    //             options={localFieldOptions as any}
    //             required
    //             value={selectedFieldOptions}
    //           />
    //         </div>
    //         {selectedFieldOptions[0]?.value !== 0 && (
    //           <>
    //             <span>개수</span>
    //             <input
    //               className="p-2 border w-full"
    //               min="1"
    //               max="100"
    //               onChange={(e) => setCount(+e.target.value)}
    //               placeholder="20"
    //               required
    //               type="number"
    //               value={count}
    //             />
    //           </>
    //         )}
    //       </div>
    //       <button className="w-full p-4 my-4 rounded bg-sky-200 font-semibold">검색하기</button>
    // </form>
  )
}
