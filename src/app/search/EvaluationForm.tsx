'use client'

import { evaluations } from '../../common/lofin'

export default function EvaluationForm() {
  return (
    <form className="m-2 p-2 whitespace-nowrap max-w-screen-md mx-auto">
      <div className="p-2 overflow-x-auto">
        {Object.entries(evaluations).map(([sector, questions], i) => (
          <div key={i}>
            <div className="my-4">{sector}</div>
            {questions.map((question, j) => (
              <div key={j} className="grid grid-cols-[1fr_auto] gap-2  items-center">
                <div className="whitespace-nowrap">{question}</div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((answer) => (
                    <button key={answer} className="px-4 py-2 border rounded">
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="w-full p-4 bg-sky-100 my-4">제출</button>
    </form>
  )
}
