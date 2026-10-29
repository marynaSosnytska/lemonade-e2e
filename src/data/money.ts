export enum Billing {
  Monthly = 'month',
  Annual = 'year',
}

export const ANNUAL_DISCOUNT_CENTS = 1_200

export function toCents(text: string): number {
  const match = text.match(/\$([\d,.]+)/)
  if (!match) {
    throw new Error(`Cannot read a price from "${text}"`)
  }
  const amount = match[1].replace(/[.,]+$/, '')
  const correctFormat = /^(\d{1,3}(,\d{3})+|\d+)(\.\d{2})?$/.test(amount)
  if (!amount || !correctFormat) {
    throw new Error(`Cannot read a price from "${text}"`)
  }
  const [whole, fraction = '00'] = amount.replace(/,/g, '').split('.')
  return Number(whole) * 100 + Number(fraction)
}

export function priceText(cents: number): string {
  const dollars = Math.floor(cents / 100)
  const rest = String(cents % 100).padStart(2, '0')
  return `$${dollars}.${rest}`
}

export function payText(cents: number, billing: Billing): string {
  return `Pay ${priceText(cents)} / ${billing}`
}

export function dollarsText(dollars: number): string {
  return `$${dollars.toLocaleString('en-US')}`
}

export function annualFromMonthly(monthlyCents: number): number {
  return monthlyCents * 12 - ANNUAL_DISCOUNT_CENTS
}
