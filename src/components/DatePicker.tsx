'use client'

import './DatePicker.css'

import { useEffect, useRef } from 'react'
import TDatePicker from 'tui-date-picker'

type Props = {
  defaultValue: string
  forwardedRef: any
}

export default function DatePicker({ defaultValue, forwardedRef }: Props) {
  const dateContainerRef = useRef<HTMLDivElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!dateContainerRef.current || !dateInputRef.current) return

    const datePicker = new TDatePicker(dateContainerRef.current, {
      date: new Date(defaultValue),
      input: {
        element: dateInputRef.current,
      },
      language: 'ko',
      selectableRanges: [[new Date('2022-01-01'), new Date('2022-12-31')]],
      usageStatistics: false,
    })

    if (forwardedRef && typeof forwardedRef === 'object') {
      forwardedRef.current = datePicker
    }
  }, [defaultValue, forwardedRef])

  return (
    <div>
      <div className="tui-datepicker-input tui-datetime-input tui-has-focus">
        <input aria-label="Date-Time" ref={dateInputRef} type="text" />
        <span className="tui-ico-date"></span>
      </div>
      <div ref={dateContainerRef} style={{ marginTop: -1 }}></div>
    </div>
  )
}
