'use client'

import './EvaluationForm.css'

import { FormEvent, useState } from 'react'
import { toast } from 'react-hot-toast'

import { NEXT_PUBLIC_BACKEND_URL } from '../../../common/constants'

type Props = {
  businessCategory: string
  businessId: string
  evaluation: Record<string, Record<string, any>[]>
}

export default function EvaluationForm({ businessCategory, businessId, evaluation }: Props) {
  const [answers, setAnswers] = useState<any>(evaluation.answers)

  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)

    const body: any = {
      answers: [],
      businessIds: [],
      businessCategories: [],
      questionIds: [],
    }

    for (const questionId in answers) {
      body.answers.push(answers[questionId])
      body.businessIds.push(businessId)
      body.businessCategories.push(businessCategory)
      body.questionIds.push(questionId)
    }

    const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/smartplus/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    setLoading(false)

    if (response.ok) toast.success('성공')
    else toast.error('실패')
  }

  return (
    <form className="m-2 whitespace-nowrap max-w-screen-md mx-auto relative" onSubmit={submit}>
      <div className="flex justify-center items-center text-sm gap-5">
        <div>1:그렇지않다</div>
        <div></div>
        <div>3:보통이다</div>
        <div></div>
        <div>5:그렇다</div>
      </div>
      <div className="overflow-x-auto overflow-y-hidden">
        {Object.entries(evaluation.questions).map(([category, questions], i) => (
          <div key={i}>
            <h3 className="text-xl my-6 text-center">{category}</h3>
            {questions.map((question: any) => (
              <div key={question.id}>
                <div className="my-3 whitespace-nowrap text-center">{question.content}</div>
                <div className="text-center">
                  {[0, 1, 2, 3, 4, 5].map((answer) => (
                    <button key={answer} className="rounded min-h-[2rem]" type="button">
                      <input
                        id={`smartplus-${i}-${question.id}-${answer}`}
                        checked={answers[question.id] === answer}
                        className="hidden"
                        name={`smartplus-${i}-${question.id}`}
                        onChange={() =>
                          setAnswers((prev: any) => ({ ...prev, [question.id]: answer }))
                        }
                        type="radio"
                      />
                      <label
                        className="px-4 py-2 bg-sky-100"
                        htmlFor={`smartplus-${i}-${question.id}-${answer}`}
                      >
                        {answer === 0 ? '모르겠음' : answer}
                      </label>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="w-full my-4 p-4 bottom-0 sticky rounded bg-sky-200/90 backdrop-blur-sm">
        제출
      </button>
    </form>
  )
}
