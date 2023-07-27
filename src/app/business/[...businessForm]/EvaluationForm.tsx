'use client'

import './EvaluationForm.css'

import { FormEvent, useState } from 'react'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'

type Props = {
  evaluation: Record<string, string[]>
}

export default function EvaluationForm({ evaluation }: Props) {
  const [answers, setAnswers] = useState(Array(Object.values(evaluation).flat()))

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const checked = Object.values(e.target)
      .filter((t) => t.checked)
      .map((t) => t.id)

    console.log('👀 ~ checked:', checked)

    // fetch(`${NEXT_PUBLIC_BACKEND_URL}/smartplus/answers?${searchParams}`)
  }

  return (
    <form className="m-2 whitespace-nowrap max-w-screen-md mx-auto" onSubmit={submit}>
      <div className="flex justify-center items-center text-sm gap-5">
        <div>1:그렇지않다</div>
        <div></div>
        <div>3:보통이다</div>
        <div></div>
        <div>5:그렇다</div>
      </div>
      <div className="overflow-x-auto">
        {Object.entries(evaluation).map(([category, questions], i) => (
          <div key={i}>
            <h3 className="text-xl my-3">{category}</h3>
            {questions.map((question, j) => (
              <div key={j} className="grid grid-cols-[1fr_auto] gap-2 items-center h-10">
                <div className="whitespace-nowrap">{question}</div>
                <div>
                  {[1, 2, 3, 4, 5].map((answer) => (
                    <button key={answer} className="rounded" type="button">
                      <input
                        className="hidden"
                        type="radio"
                        id={`smartplus-${i}-${j}-${answer}`}
                        name={`smartplus-${i}-${j}`}
                      />
                      <label
                        className="px-4 py-2 bg-sky-100"
                        htmlFor={`smartplus-${i}-${j}-${answer}`}
                      >
                        {answer}
                      </label>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="w-full rounded  p-4 bg-sky-100 my-4">제출</button>
    </form>
  )
}
