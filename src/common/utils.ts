export function formatKoreanNumber(inputNumber: number) {
  if (inputNumber <= 0) return String(inputNumber)

  const unitWords = ['', '만', '억', '조', '경']
  const splitUnit = 10000
  const splitCount = unitWords.length
  const resultArray = []
  let resultString = ''

  for (var i = 0; i < splitCount; i++) {
    var unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i)
    unitResult = Math.floor(unitResult)
    if (unitResult > 0) {
      resultArray[i] = unitResult
    }
  }

  for (var i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue
    resultString = `${resultArray[i]}${unitWords[i]} ${resultString}`
  }

  return resultString
}

export const formatPrice = new Intl.NumberFormat('ko-KR').format
