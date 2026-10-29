import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@framework/step-decorator'
import { dollarsText } from '@data/money'
import { type ValuableItem, valuableItemEntry } from '@data/quote-options'
import { ConfirmDialog } from './ConfirmDialog'
import { ValuableItemDialog } from './ValuableItemDialog'

export class ValuableItemCard {
  readonly card: Locator
  readonly addButton: Locator
  readonly deleteButton: Locator
  readonly editButton: Locator
  readonly declaredValue: (dollars: number) => Locator
  private readonly page: Page
  private readonly item: ValuableItem
  private readonly confirmDialog: ConfirmDialog

  constructor(page: Page, item: ValuableItem) {
    this.page = page
    this.item = item
    this.confirmDialog = new ConfirmDialog(page)
    this.card = page.getByLabel(item, { exact: true })
    this.addButton = this.card.getByRole('button', { name: 'add', exact: true })
    this.deleteButton = this.card.getByRole('button', { name: 'delete', exact: true })
    this.editButton = this.card.getByLabel('edit', { exact: true })
    this.declaredValue = (dollars: number) => this.card.getByText(dollarsText(dollars))
  }

  // Actions

  @step('Open the add dialog for the item')
  async add(): Promise<ValuableItemDialog> {
    await this.addButton.click()
    return new ValuableItemDialog(this.page, valuableItemEntry(this.item).dialogHeading)
  }

  @step('Start removing the item')
  async startRemoval() {
    await this.deleteButton.click()
  }

  // Verifications

  @step('Verify the item is added with a declared value of ${0} dollars')
  async verifyAdded(valueDollars: number) {
    await expect(
      this.declaredValue(valueDollars),
      `the card shows a declared value of ${dollarsText(valueDollars)}`
    ).toBeVisible()
    await expect(this.deleteButton, 'the card offers removal').toBeVisible()
    await expect(this.editButton, 'the card offers editing').toBeVisible()
  }

  @step('Verify the item is not added')
  async verifyNotAdded() {
    await expect(this.addButton, 'the card offers adding again').toBeVisible()
    await expect(this.deleteButton, 'the card no longer offers removal').toBeHidden()
    await expect(this.editButton, 'the card no longer offers editing').toBeHidden()
  }

  // Combined flows

  @step('Add the item at the default value and return the quoted cents')
  async addAtDefaultValue(): Promise<number> {
    const dialog = await this.add()
    const quoted = await dialog.quotedCents()
    await dialog.confirm(valuableItemEntry(this.item).hasNotice)
    return quoted
  }

  @step('Remove the item and confirm')
  async remove() {
    await this.startRemoval()
    await this.confirmDialog.yes()
  }
}
