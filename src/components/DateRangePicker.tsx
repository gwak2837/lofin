import './DatePicker.css'

import { useEffect, useRef } from 'react'
import TDatePicker from 'tui-date-picker'
import { DateRangePicker as TDateRangePicker } from 'tui-date-picker'

type Props = {
  defaultDateFrom?: string
  defaultDateTo?: string
  forwardedRef: any
}

export default function DateRangePicker({ defaultDateFrom, defaultDateTo, forwardedRef }: Props) {
  const dateRangePickerRef = useRef<TDateRangePicker>()
  const dateFromContainerRef = useRef<HTMLDivElement>(null)
  const dateFromInputRef = useRef<HTMLInputElement>(null)
  const dateToContainerRef = useRef<HTMLDivElement>(null)
  const dateToInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (
      !dateFromContainerRef.current ||
      !dateFromInputRef.current ||
      !dateToContainerRef.current ||
      !dateToInputRef.current
    )
      return

    const dateRangePicker = TDatePicker.createRangePicker({
      startpicker: {
        date: defaultDateFrom ? new Date(defaultDateFrom) : undefined,
        input: dateFromInputRef.current,
        container: dateFromContainerRef.current,
      },
      endpicker: {
        date: defaultDateTo ? new Date(defaultDateTo) : undefined,
        input: dateToInputRef.current,
        container: dateToContainerRef.current,
      },
      language: 'ko',
      selectableRanges: [[new Date('2022-01-01'), new Date('2022-12-31')]],
      usageStatistics: false,
    })

    dateRangePickerRef.current = dateRangePicker

    if (forwardedRef && typeof forwardedRef === 'object') {
      forwardedRef.current = dateRangePicker
    }
  }, [defaultDateFrom, defaultDateTo, forwardedRef])

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
      <div className="tui-datepicker-input tui-datetime-input tui-has-focus">
        <input aria-label="Date" ref={dateFromInputRef} type="text" />
        <span className="tui-ico-date" />
        <div className="ml-[-1px]" ref={dateFromContainerRef} />
      </div>
      <span>to</span>
      <div className="tui-datepicker-input tui-datetime-input tui-has-focus">
        <input aria-label="Date" ref={dateToInputRef} type="text" />
        <span className="tui-ico-date" />
        <div className="ml-[-1px]" ref={dateToContainerRef} />
      </div>
    </div>
  )
}
