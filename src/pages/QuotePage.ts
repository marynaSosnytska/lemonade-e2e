import type { Locator } from '@playwright/test'
import { env } from '@config/env'
import { step } from '@framework/step-decorator'
import { type AddonKey, addonEntry } from '@data/addons'
import type { Coverage } from '@data/coverage'
import type { ValuableItem } from '@data/valuable-items'
import { BasePage } from './BasePage'
import { AddonRow } from './components/AddonRow'
import { BillingToggle } from './components/BillingToggle'
import { ConfirmDialog } from './components/ConfirmDialog'
import { CoverageRow } from './components/CoverageRow'
import { DeductibleSelect } from './components/DeductibleSelect'
import { PriceSummary } from './components/PriceSummary'
import { ValuableItemCard } from './components/ValuableItemCard'

export class QuotePage extends BasePage {
  readonly priceSummary = new PriceSummary(this.page)
  readonly billing = new BillingToggle(this.page)
  readonly deductible = new DeductibleSelect(this.page)
  readonly confirmDialog = new ConfirmDialog(this.page)
  readonly coverage = (name: Coverage) => new CoverageRow(this.page, name)
  readonly valuableItem = (item: ValuableItem) => new ValuableItemCard(this.page, item)
  readonly addon = (key: AddonKey) => new AddonRow(this.page, addonEntry(key))
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
