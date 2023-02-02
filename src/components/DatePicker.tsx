'use client'

import { ForwardedRef, forwardRef, useEffect, useRef } from 'react'
import TDatePicker from 'tui-date-picker'

type Props = {
  className?: string
}

export default forwardRef(DatePicker)

function DatePicker({ className }: Props, ref: ForwardedRef<TDatePicker>) {
  const dateContainerRef = useRef<HTMLDivElement>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!dateContainerRef.current || !dateInputRef.current) return

    const datePicker = new TDatePicker(dateContainerRef.current, {
      input: {
        element: dateInputRef.current,
      },
      usageStatistics: false,
    })

    if (ref && typeof ref === 'object') {
      ref.current = datePicker
    }
  }, [ref])

  return (
    <div className={className}>
      <div className="tui-datepicker-input tui-datetime-input tui-has-focus">
        <input aria-label="Date-Time" ref={dateInputRef} type="text" />
        <span className="tui-ico-date"></span>
      </div>
      <div ref={dateContainerRef} style={{ marginTop: -1 }}></div>
    </div>
  )
}
