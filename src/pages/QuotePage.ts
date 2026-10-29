import type { Locator } from '@playwright/test'
import { env } from '@config/env'
import { step } from '@framework/step-decorator'
import type { Coverage } from '@data/quote-options'
import { BasePage } from './BasePage'
import { BillingToggle } from './components/BillingToggle'
import { CoverageRow } from './components/CoverageRow'
import { PriceSummary } from './components/PriceSummary'

export class QuotePage extends BasePage {
  readonly priceSummary = new PriceSummary(this.page)
  readonly billing = new BillingToggle(this.page)
  readonly coverage = (name: Coverage) => new CoverageRow(this.page, name)
  readonly acceptCookies: Locator = this.page.getByRole('button', { name: 'Accept all' })
  readonly activateHeading: Locator = this.page.getByRole('heading', {
    name: 'Activate Your Insurance',
  })

  // Actions

  @step('Open the quote and accept cookies')
  async open() {
    await this.page.goto(`quotes/${env.QUOTE_ID}`)
    await this.acceptCookies.click()
    await this.acceptCookies.waitFor({ state: 'hidden' })
  }

  @step('Scroll to the Activate Your Insurance section')
  async scrollToActivate() {
    await this.activateHeading.scrollIntoViewIfNeeded()
  }
}
