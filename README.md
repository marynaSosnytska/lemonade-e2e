# Lemonade quote price tests

Playwright + TypeScript suite for the Lemonade renters quote page. It checks that the quote price changes the right way when a customer changes coverage amounts, valuable items, policy add-ons, the deductible, the billing period and the start date, and it validates the Interested party and Spouse forms.

Target: <https://lemonade-hq.github.io/qa-interview-task/quotes/LQ42EE07089> (a public, third-party page, so the suite never writes anything outside the browser).

- 83 tests in 13 files: 48 behaviour tests, 4 known-bug specs and 31 unit tests for the helpers.
- Every test starts from a fresh browser context and the same quote, so tests are independent and run in parallel.
- All tests pass headless. The known-bug specs use `test.fail()`, so the suite stays green while the bugs exist and turns red the moment one is fixed.

## Run it

Prerequisites: Node 20 or newer (CI uses 22).

```bash
npm ci
npx playwright install chromium
npm test                          # whole suite, headless
npm test -- tests/billing.spec.ts # one file
npm test -- --grep @smoke         # by tag
npm run test:headed               # with the browser visible
npm run test:ui                   # Playwright UI mode
npm run report                    # open the last HTML report
npm run lint && npm run typecheck # code quality
npm run format                    # Prettier
```

Two environment variables override the target; there is no `.env` file.

| Variable   | Default                                            |
| ---------- | -------------------------------------------------- |
| `BASE_URL` | `https://lemonade-hq.github.io/qa-interview-task/` |
| `QUOTE_ID` | `LQ42EE07089`                                      |

`BASE_URL` needs its trailing slash, otherwise the base path is dropped.

### Tags

| Tag | Meaning |
| --- | --- |
| `@coverage` `@valuables` `@addons` `@deductible` `@billing` `@start-date` `@forms` | One area tag on every behaviour and known-bug `describe` |
| `@smoke` | Happy paths (15 tests) |
| `@known-bug` | `test.fail()` specs for the findings below (4 tests) |
| `@unit` | Helper tests that do not open the page (31 tests) |

`--grep` takes a regular expression, so `npm test -- --grep "@billing|@deductible"` runs two areas.

## Project structure

```
src/
  config/        env.ts: BASE_URL and QUOTE_ID
  framework/     step-decorator.ts: the @step decorator for reporting
  data/          money.ts (cents helpers), dates.ts (moment helpers) and one typed-table module
                 per area: coverage, deductible, valuable-items, addons, addon-forms, quote-changes
  pages/         BasePage, QuotePage and components/ (PriceSummary, CoverageRow, DeductibleSelect,
                 ValuableItemCard/Dialog, AddonRow/Dialog, ConfirmDialog, BillingToggle, StartDatePicker)
  fixtures/      test.ts: the quotePage fixture (opens the quote, accepts cookies)
tests/
  *.spec.ts      one spec per area
  known-bugs/    test.fail() specs, one finding each
  unit/          helper tests (money, dates)
.github/workflows/ci.yaml
```

Path aliases (`tsconfig` `paths`): `@config/*`, `@framework/*`, `@data/*`, `@pages/*`, `@fixtures/*`.

## Design decisions

**Page objects by composition.** `QuotePage` extends `BasePage` and holds every component as a field (`quotePage.priceSummary`, `quotePage.deductible`, `quotePage.addon(key)`). Components are never inherited. Locators are `readonly` constructor fields, methods are grouped as actions, verifications and combined flows, and every `expect` lives in a `verify*` method, so specs read as a list of business steps.

**Specs hold no locators or page logic.** Specs contain `describe`, `test`, `test.step`, loops over the tables and simple price arithmetic on cents. Types, tables and helpers live in `src/data`, and every `expect` on the page lives in a page object `verify*` method. Step titles state the business expectation ("the price returns to the original"), and every assertion carries a message.

**Data-driven by tables.** Repeating things (five valuable items, six add-ons, the form validation cases) are typed tables, and each row becomes one test with a descriptive title. Adding an add-on is a new row, not a new test.

**Prices are integer cents.** `toCents` reads the price from the Pay button text and throws on anything it cannot parse (`$5.5`, `$14.333`, an empty string), so a changed page fails loudly instead of comparing the wrong number. All arithmetic happens on integer cents, so there is no floating point drift.

**Assertions.** Every price test asserts the direction of the change, then the exact amount wherever the UI states one (the valuable item quote, the add-on price), and finally that undoing the change restores the original price. For coverage amounts and the deductible the page states no amount, so those checks use direction plus restore.

**A metamorphic check for billing.** The annual price must equal 12 x the monthly price minus $12, whatever the quote contains. The billing tests apply a change (a paid add-on, the $250 deductible, higher liability) and check that relation instead of hard-coding annual prices.

**Waiting.** The page is client-side and makes no data requests, so there is nothing to wait on. There are no `waitForTimeout` calls. Exact prices use the retrying `toHaveText`, direction checks use `expect.poll`, and an "unchanged price" check always runs after a positive state check (the add-on shows as on, both pickers show the new date) so it cannot pass before the page has reacted.

**Dates.** Dates are built from local parts with moment. Moment objects are mutable, so shared date constants are cloned before any mutation.

**Never reload.** The app rewrites its own URL and drops the `/qa-interview-task` base path, so a reload gives a GitHub Pages 404 (see the findings). Tests open the quote once and never navigate again; the one reload test is a known-bug spec.

**Return types are explicit.** ESLint enforces `explicit-function-return-type` (inline callbacks and the step decorator are exempt).

## Test cases

`npx playwright test --list` shows every test. Data-driven rows below produce one test per table entry. Assertion types: "direction" means higher or lower than before, "exact" means the displayed value equals the expected one, and "restore" means undoing the change gives back the original price.

| Test | Brief requirement | Spec | Tags | Assertion |
| --- | --- | --- | --- | --- |
| Personal Liability and Loss of use: stepping up raises the price, stepping back restores | Coverage amount up | `coverage-amounts.spec.ts` | `@coverage` `@smoke` (Liability) | direction, restore |
| Personal Property: stepping down lowers the price, stepping back up restores | Coverage amount down | `coverage-amounts.spec.ts` | `@coverage` | direction, restore |
| Each coverage starts at its limit with the button past it disabled | Coverage amount limits | `coverage-amounts.spec.ts` | `@coverage` | button state |
| Five valuable items: adding at the default value adds the quoted amount, removing restores | Valuable item add and remove | `valuable-items.spec.ts` | `@valuables` `@smoke` | exact, restore |
| A higher declared value quotes more and the total grows by that quote | Valuable item add | `valuable-items.spec.ts` | `@valuables` | direction, exact |
| Cancelling the removal keeps the item and the price | Valuable item remove | `valuable-items.spec.ts` | `@valuables` | item state, exact |
| Two free add-ons: completing the form turns it on, the price does not change, off keeps it | Add-on on and off, free add-ons are free | `policy-addons.spec.ts` | `@addons` | state, exact |
| Four paid add-ons: turning on adds the quoted price, turning off restores | Add-on on and off | `policy-addons.spec.ts` | `@addons` `@smoke` | exact, restore |
| Closing an add-on form without submitting leaves it off and the price unchanged | Add-on on and off | `policy-addons.spec.ts` | `@addons` | state, exact |
| Price falls as the deductible rises ($1,000, $2,500), the $500 default restores | Deductible (lower is pricier) | `deductible.spec.ts` | `@deductible` `@smoke` | direction, restore |
| Price rises as the deductible falls ($250), the $500 default restores | Deductible (lower is pricier) | `deductible.spec.ts` | `@deductible` `@smoke` | direction, restore |
| Annual costs 12 x monthly minus $12, switching back and scrolling keep the monthly price | Beyond the brief: billing period | `billing.spec.ts` | `@billing` `@smoke` | exact |
| The annual relation holds after a paid add-on, the $250 deductible, higher liability | Beyond the brief: billing period | `billing.spec.ts` | `@billing` | exact per case |
| In annual mode a paid add-on lists 12 x its monthly price and adds exactly that | Beyond the brief: billing period | `billing.spec.ts` | `@billing` | exact |
| The quote opens on its start date and both pickers agree | Beyond the brief: start date | `start-date.spec.ts` | `@start-date` | exact (both pickers) |
| Picking a date updates both pickers and leaves the price unchanged | Beyond the brief: start date | `start-date.spec.ts` | `@start-date` `@smoke` | exact |
| Window: Mar 13 and Jun 30 can be picked, Mar 12 and Jul 1 cannot, navigation stops at both ends | Beyond the brief: start date | `start-date.spec.ts` | `@start-date` | exact, button state |
| Interested party cannot be added without Name, Address or Email, or with a malformed Email (6 cases) | Beyond the brief: form validation | `addon-forms.spec.ts` | `@forms` | Add disabled |
| Interested party can be added with all fields, with an upper-case Email, and with spaces typed into the Email (3 cases) | Beyond the brief: form validation | `addon-forms.spec.ts` | `@forms` | Add enabled |
| Spouse cannot be added without a name, with blank names, or with a malformed Email (7 cases) | Beyond the brief: form validation | `addon-forms.spec.ts` | `@forms` | Add disabled |
| Spouse can be added with an empty, a valid, or a spaced optional Email (3 cases) | Beyond the brief: form validation | `addon-forms.spec.ts` | `@forms` | Add enabled |
| Saving a valid form turns the add-on on and the row shows the saved details | Beyond the brief: form validation | `addon-forms.spec.ts` | `@forms` `@smoke` | state, saved text |
| Reloading keeps the quote | Finding 1 | `known-bugs/reload-keeps-quote.spec.ts` | `@known-bug` `@billing` | quote visible after reload |
| Increasing Medical payments changes the price | Finding 2 | `known-bugs/medical-payments-price.spec.ts` | `@known-bug` `@coverage` | price differs |
| The calendar opens on the month of the selected date | Finding 3 | `known-bugs/calendar-opens-on-selected-month.spec.ts` | `@known-bug` `@start-date` | month shown |
| Interested party rejects a whitespace-only name, as Spouse does | Finding 4 | `known-bugs/interested-party-blank-name.spec.ts` | `@known-bug` `@forms` | Add disabled |
| `toCents`, price formatting, the annual and yearly price helpers, date helpers | Helper correctness | `unit/*.spec.ts` | `@unit` | exact, rejects bad input |

The tests on the form `Add` button assert its state because that is the only validation feedback the forms give.

## Locator strategy

Locators follow this order: roles and labels, then visible text, then `data-testid` as a last resort. There are no CSS or class selectors. The page source cannot be changed, so a few elements with no role, label or name need a fallback. Each fallback lives in one place in the page objects.

| Element | Fallback | Why |
| --- | --- | --- |
| Add-on rows | `#addon-<key>` | Every checkbox is named `Toggle` and rows have no role |
| Coverage rows | Innermost `div` containing the exact heading and an `increase` button, taken with `.last()` | Rows have no role; the positional pick is commented |
| Pay button | `getByTestId('baseQuoteTopWrapper')` scope plus `getByRole('button', { name: /^Pay \$/ })` | A sticky header copy and an Activate section copy exist; the hero copy is stable |
| Deductible select | `getByTestId('select-header')` inside the `Deductible` article | The custom select has no accessible name |
| Start date pickers | Hero: `baseQuoteTopWrapper` plus `getByTestId('select')`. Activate section: innermost matching `div` with `.last()` | No role or label; the Activate pick is positional |
| Disabled calendar days | Checked by the bare `disabled` attribute and by behaviour (a click does not change the date) | `toBeDisabled()` does not honour `disabled` on a `div` |
| Billing toggle | `getByLabel('switch').getByLabel('<option>', { exact: true }).locator('..')` | The radio inputs are hidden and cannot be clicked; their parent wrapper is the target |

The billing toggle is the only place that uses `.locator('..')`.

## Findings

Bugs and questions found while building the suite. Findings 1 to 4 have a `test.fail()` spec in `tests/known-bugs/`.

1. **Reloading the page gives a 404.** The app rewrites its URL to `https://lemonade-hq.github.io/quotes/LQ42EE07089`, dropping the `/qa-interview-task` base path, so a reload or a shared link breaks on GitHub Pages.
2. **Medical payments do not change the price (question).** Raising Medical payments from $1,000 to $2,000 leaves the price at the same value, while the other coverages move it. Is that by design or a bug? The spec fails, as intended, while the price stays flat.
3. **The calendar opens on the wrong month.** On first open the start date calendar shows June 2026, not March 2026, the month of the selected 03/13/2026.
4. **Interested party accepts a whitespace-only Name.** The form saves a nameless entry, while Spouse rejects the same input.
5. **The start date window is enforced by CSS only (observation).** Days outside Mar 13 to Jun 30 have `pointer-events: none`. A real mouse click cannot select them, but a scripted click on Mar 12 does select it. The test asserts what a user can do.
6. **The default start date is in the past (observation).** The quote opens on 03/13/2026 and the selectable window ends on Jun 30, 2026. Not tested, because the result would depend on the date the suite runs.
7. **The "1% protective devices discount" and the $1 difference (question).** The page shows a "1% protective devices discount" and a struck-through $15.33 above the $14.33 price, a $1.00 difference. 1% of $15.33 would be about $0.15. What does the $1.00 stand for? Not tested.
8. **The Email fields strip spaces as you type.** Typing `landlord @example.com` (Interested party) or `jane @example.com` (Spouse) saves the address without the space and keeps `Add` enabled, so a user cannot enter an address with a space. The two `Email has spaces` cases type the value and assert that `Add` is enabled. Setting the value in one step with `fill()` is different: the field stays empty and `Add` stays disabled.

## Automation notes

- **The add-on forms are typed with `pressSequentially()`, not `fill()`.** `fill()` sets the value in one step, which these inputs handle differently from keystrokes: it concatenates with existing text, and a value containing a space leaves an Email field empty. Typing matches what a user does. It is a test-side artefact, not a product bug. Every test starts from a fresh form, so typed text never lands on existing text.
- **The big price is unusable as a source.** It is an animated odometer made of a column of digits. Tests read the Pay button text instead (`Pay $14.33 / month`, `Pay $159.96 / year`).
- **Dialogs mount at page level and appear twice in the accessibility tree** (an outer and an inner `dialog`). Page objects anchor on `getByRole('dialog')` filtered by heading and act through chained locators, which resolve to one element.
- **The valuable item dialog has one button that serves two steps.** Its text carries both the price and `Got it`, and it is clicked twice; the page object waits for the notice step to be in view before the second click.
- **Clicking an add-on's checkbox opens its form but the checkbox already reads checked.** Closing the form leaves it unchecked. The page object waits for the form to close before it reports the add-on as on.
- **A cookie dialog appears in every fresh context.** The fixture accepts it before each test.

## CI

`.github/workflows/ci.yaml` runs a `quality` job (lint and typecheck), then the tests in three parallel shards, then merges the shard reports into one HTML report.

| Trigger | What runs |
| --- | --- |
| push, pull request | Whole suite |
| nightly (05:00 UTC) | Whole suite. The target is a live third-party page, so a nightly run catches drift |
| manual | Whole suite, or a filtered run (below) |

To run a subset, open Actions, choose `ci`, press `Run workflow` and fill the `tag` input. It takes a tag or a regular expression, for example `@smoke`, `@billing`, or `@billing|@deductible`. Leave it empty to run everything. A tag that matches nothing in a shard keeps that shard green (`--pass-with-no-tests`); if it matches nothing anywhere, the report job fails, which is a sign the filter is wrong.

On CI the config uses 2 workers, 1 retry and the `blob` reporter. Each shard uploads its blob report for one day, and the merged `playwright-report` is kept for 14 days.

**CI status.** The workflow has run on GitHub, all green (on push and from the nightly schedule). The `quality` job, all three shards and the `report` job passed, and the blob reports and the merged `playwright-report` were uploaded. The manual `Run workflow` run with a `tag` input has not been run on GitHub yet; the filtered command was checked locally only.

## What I would add next

- Cross-browser projects (Firefox and WebKit) once the chromium suite has run on CI for a while.
- Validation of the Significant other, Water Back-Up and Landlord damage forms.
- Exact totals for coverage and deductible changes, if the product states the amounts in the UI.
- Accessibility checks on the dialogs and the calendar with `@axe-core/playwright`.
