import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@framework/step-decorator'
import { dollarsText } from '@data/money'

export class DeductibleSelect {
  readonly article: Locator
  readonly header: Locator
  readonly option: (dollars: number) => Locator

  constructor(page: Page) {
    this.article = page
      .getByRole('article')
      .filter({ has: page.getByRole('heading', { name: 'Deductible', exact: true }) })
    this.header = this.article.getByTestId('select-header')
    this.option = (dollars: number) =>
      this.article.getByRole('option', { name: dollarsText(dollars), exact: true })
  }

  // Actions

  @step('Choose a deductible of ${0} dollars')
  async choose(dollars: number) {
    await this.header.click()
    await this.option(dollars).click()
  }

  // Verifications

  @step('Verify the deductible is ${0} dollars')
  async verifySelected(dollars: number) {
    await expect(this.header, `the deductible shows ${dollarsText(dollars)}`).toHaveText(
      dollarsText(dollars)
    )
  }
}
