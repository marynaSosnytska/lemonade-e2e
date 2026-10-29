import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@framework/step-decorator'
import { toCents } from '@data/money'
import type { Addon, FormValues } from '@data/quote-options'
import { AddonDialog } from './AddonDialog'
import { ConfirmDialog } from './ConfirmDialog'

export class AddonRow {
  readonly row: Locator
  readonly toggleLabel: Locator
  readonly checkbox: Locator
  readonly priceLabel: Locator
  readonly savedDetails: (text: string) => Locator
  readonly dialog: AddonDialog | undefined
  private readonly confirmDialog: ConfirmDialog
  private readonly addon: Addon

  constructor(page: Page, addon: Addon) {
    this.addon = addon
    this.row = page.locator(`#addon-${addon.key}`)
    this.toggleLabel = this.row.getByText('Toggle', { exact: true })
    this.checkbox = this.row.getByRole('checkbox')
    this.priceLabel = this.row.getByText(/\+\$[\d.,]+\/(MO|YR)/)
    this.savedDetails = (text: string) => this.row.getByText(text)
    this.dialog = addon.dialogHeading ? new AddonDialog(page, addon.dialogHeading) : undefined
    this.confirmDialog = new ConfirmDialog(page)
  }

  // Actions

  @step('Toggle the add-on')
  async toggle() {
    await this.toggleLabel.click()
  }

  @step('Close the add-on form without submitting')
  async closeForm() {
    await this.form().close()
  }

  @step('Fill the add-on form fields ${0}')
  async fillForm(values: FormValues) {
    await this.form().fillForm(values)
  }

  @step('Read the listed price from the row')
  async listedCents(): Promise<number> {
    return toCents(await this.priceLabel.innerText())
  }

  // Verifications

  @step('Verify the add-on form can be submitted')
  async verifyCanSubmit() {
    await this.form().verifyCanSubmit()
  }

  @step('Verify the add-on form cannot be submitted')
  async verifyCannotSubmit(timeout?: number) {
    await this.form().verifyCannotSubmit(timeout)
  }

  @step('Verify the add-on is on')
  async verifyOn() {
    await expect(this.checkbox, 'the add-on is checked').toBeChecked()
    await this.dialog?.verifyClosed()
  }

  @step('Verify the add-on is off')
  async verifyOff() {
    await expect(this.checkbox, 'the add-on is unchecked').not.toBeChecked()
  }

  @step('Verify the add-on shows saved details ${0}')
  async verifySavedDetails(text: string) {
    await expect(this.savedDetails(text), `the row shows "${text}"`).toBeVisible()
  }

  // Combined flows

  @step('Turn the add-on on, complete its form and return the quoted cents')
  async turnOn(): Promise<number> {
    await this.toggle()
    if (!this.dialog) {
      return this.listedCents()
    }
    if (this.addon.formValues) {
      await this.dialog.fillForm(this.addon.formValues)
    }
    const quoted = await this.dialog.quotedCents()
    await this.dialog.submit()
    return quoted
  }

  @step('Turn the add-on off and confirm')
  async turnOff() {
    await this.toggle()
    await this.confirmDialog.yes()
  }

  private form(): AddonDialog {
    if (!this.dialog) {
      throw new Error(`Add-on "${this.addon.key}" has no form`)
    }
    return this.dialog
  }
}
