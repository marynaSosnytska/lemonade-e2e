import moment, { type Moment } from 'moment'

// Moments are built from local date parts so the day never shifts with the machine timezone.
// They are shared constants: call clone() before add(), subtract() or startOf(), which mutate.
export const QUOTE_START_DATE: Moment = moment({ year: 2026, month: 2, day: 13 })
export const LAST_START_DATE: Moment = moment({ year: 2026, month: 5, day: 30 })
export const PICKED_START_DATE: Moment = moment({ year: 2026, month: 5, day: 15 })
export const DAY_BEFORE_WINDOW: Moment = moment({ year: 2026, month: 2, day: 12 })
export const DAY_AFTER_WINDOW: Moment = moment({ year: 2026, month: 6, day: 1 })

const MONTH_YEAR_FORMAT = 'MMMM YYYY'

export function usDateText(date: Moment): string {
  return date.format('MM/DD/YYYY')
}

export function monthYearText(date: Moment): string {
  return date.format(MONTH_YEAR_FORMAT)
}

export function dayLabel(date: Moment): string {
  return date.format('ddd MMM DD YYYY')
}

export function getMonthsBetween(shownText: string, target: Moment): number {
  const shown = moment(shownText, MONTH_YEAR_FORMAT, true)
  if (!shown.isValid()) {
    throw new Error(`Unrecognised month header: "${shownText}"`)
  }
  return target.clone().startOf('month').diff(shown.startOf('month'), 'months')
}
