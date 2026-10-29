import { test as base } from '@playwright/test'
import { QuotePage } from '@pages/QuotePage'

export { expect } from '@playwright/test'

export const test = base.extend<{ quotePage: QuotePage }>({
  quotePage: async ({ page }, use) => {
    const quotePage = new QuotePage(page)
    await quotePage.open()
    await use(quotePage)
  },
})
