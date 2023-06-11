export function formatKoreanNumber(inputNumber: number) {
  if (inputNumber <= 0) return String(inputNumber)

  const unitWords = ['', '만', '억', '조', '경']
  const splitUnit = 10000
  const splitCount = unitWords.length
  const resultArray = []
  let resultString = ''

  for (let i = 0; i < splitCount; i++) {
    let unitResult = (inputNumber % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i)
    unitResult = Math.floor(unitResult)
    if (unitResult > 0) {
      resultArray[i] = unitResult
    }
  }

  for (let i = 0; i < resultArray.length; i++) {
    if (!resultArray[i]) continue
    resultString = `${resultArray[i]}${unitWords[i]} ${resultString}`
  }

  return resultString
}

export const formatPrice = new Intl.NumberFormat('ko-KR').format

export function hasElement(a: any[] | undefined) {
  return Array.isArray(a) && a.length > 0 ? a : null
}

export function vw(percent = 100) {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  return (percent * w) / 100
}

export type Option = {
  group?: string
  label: string
  value: any
}

export function getGroupedOption(options: any, _option: any) {
  for (const option of options) {
    const found = option.options?.find(
      (option: Option) => option.value === _option.value && option.group === _option.group
    )
    if (found) return found
  }
}

export function getNestedOption(options: any, value: any) {
  for (const option of options) {
    const found = option.options?.find((option: Option) => option.value === value)
    if (found) return found
  }
}

export function getOption(options: Option[], value: any) {
  for (const option of options) {
    if (option.value === value) return option
  }
}

export function formatVariationRatio(child: number, parent: number, fractionDigits = 2) {
  return child === parent ? '-' : ((100 * child) / parent - 100).toFixed(fractionDigits) + '%'
}

export function formatRatio(a: number, b: number, fractionDigits = 0) {
  return a === 0 ? '-' : ((100 * a) / b).toFixed(fractionDigits) + '%'
}
