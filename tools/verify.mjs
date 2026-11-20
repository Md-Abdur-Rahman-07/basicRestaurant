import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import AxeBuilder from '@axe-core/playwright';
import { launch, viewports } from './browser.mjs';
import { createOrderStore, validateSavedState, totals, STORAGE_KEY } from '../assets/js/store.js';

const url = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const report = { testedAt: new Date().toISOString(), url, checks: [], accessibility: [] };
let browser;
let server;

async function check(name, task) {
  try {
    const details = await task();
    report.checks.push({ name, passed: true, ...(details ? { details } : {}) });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({ name, passed: false, error: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

async function ready() {
  try { return (await fetch(url, { signal: AbortSignal.timeout(1500) })).ok; } catch { return false; }
}

async function pageWith(options = {}, init) {
  const context = await browser.newContext({ viewport: viewports.desktop, colorScheme: 'light', reducedMotion: 'reduce', ...options });
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('.menu-card').first().waitFor();
  return { context, page, errors };
}

async function axe(page, name) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const violations = result.violations.map(({ id, impact, description, helpUrl, nodes }) => ({ id, impact, description, helpUrl, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) }));
  report.accessibility.push({ name, violations });
  assert.equal(violations.length, 0, `${name}: ${violations.map(violation => `${violation.id} (${violation.nodes.map(node => node.target.join(', ')).join('; ')})`).join(', ')}`);
}

try {
  if (!await ready()) {
    if (process.env.TEST_URL) throw new Error(`Test preview is unavailable: ${url}`);
    server = spawn(process.execPath, ['tools/serve.mjs'], { stdio: 'ignore', windowsHide: true });
    for (let attempt = 0; attempt < 25 && !await ready(); attempt++) await new Promise(resolve => setTimeout(resolve, 200));
    if (!await ready()) throw new Error('The local preview server did not start.');
  }
  browser = await launch();
  report.browser = browser.version();

  await check('Integer currency, tip rounding, validated storage and immutable order snapshots', () => {
    const saved = new Map();
    const original = globalThis.localStorage;
    globalThis.localStorage = { getItem: key => saved.get(key) || null, setItem: (key, value) => saved.set(key, value) };
    try {
      const store = createOrderStore();
      store.changeQuantity('margherita', 1);
      store.changeQuantity('cheeseburger', 2);
      assert.deepEqual(totals(store.cart, 15), { count: 3, subtotalCents: 1899, tipCents: 285, totalCents: 2184 });
      const placed = store.placeOrder(15);
      assert.equal(placed.totalCents, 2184);
      assert.deepEqual(store.cart, {});
      placed.items[0].priceCents = 1;
      assert.equal(store.history[0].items[0].priceCents, 799);
      assert.equal(createOrderStore().history[0].tipCents, 285);
      store.changeQuantity('margherita', 100000);
      assert.equal(store.cart.margherita, 99);
      assert.equal(store.changeQuantity('margherita', 1), false);
      assert.deepEqual(validateSavedState({ cart: { unknown: 3, coke: -1, pepsi: 1.5, margherita: 100, cheeseburger: 2 }, history: [null, {}, { items: 'bad' }] }), { cart: { cheeseburger: 2 }, history: [] });
    } finally {
      if (original === undefined) delete globalThis.localStorage; else globalThis.localStorage = original;
    }
  });

  await check('Search, all categories, dietary combinations, empty-state reset and numeric price sorting', async () => {
    const { context, page, errors } = await pageWith();
    try {
      assert.equal(await page.locator('.menu-card').count(), 17);
      assert.equal(await page.locator('#categories button').count(), 15);
      for (const category of ['Pizza', 'Drinks', 'Vegan', 'Asian Cuisine', 'All']) {
        await page.locator('#categories').getByRole('button', { name: category, exact: true }).click();
        assert.ok(await page.locator('.menu-card').count() > 0, category);
        assert.equal(await page.locator('#categories').getByRole('button', { name: category, exact: true }).getAttribute('aria-pressed'), 'true');
      }
      await page.locator('#search').fill('  PIZZA ');
      assert.equal(await page.locator('.menu-card').count(), 1);
      await page.locator('#search').fill('no-such-menu-item');
      assert.equal(await page.locator('#empty-results').isVisible(), true);
      await page.locator('#clear-search').click();
      assert.equal(await page.locator('.menu-card').count(), 17);
      await page.locator('#vegan-filter').click();
      assert.equal(await page.locator('.menu-card').count(), 2);
      await page.locator('#spicy-filter').click();
      assert.equal(await page.locator('#empty-results').isVisible(), true);
      await page.locator('#clear-search').click();
      for (const [sort, direction] of [['price-asc', 1], ['price-desc', -1]]) {
        await page.locator('#price-sort').selectOption(sort);
        const prices = await page.locator('.menu-card .price').allTextContents();
        const values = prices.map(price => Number(price.replace(/[^\d.]/g, '')));
        assert.ok(values.every((value, index) => !index || (value - values[index - 1]) * direction >= 0));
      }
      assert.deepEqual(errors, []);
    } finally { await context.close(); }
  });

  await check('Cart stays synchronized across cards, drawer, summary, reload, removal and tip edits', async () => {
    const { context, page, errors } = await pageWith({ viewport: viewports.mobile });
    try {
      await page.getByRole('button', { name: 'Pizza', exact: true }).click();
      await page.getByRole('button', { name: 'Add Margherita Pizza to order', exact: true }).click();
      await page.getByRole('button', { name: 'Increase Margherita Pizza quantity', exact: true }).click();
      assert.equal(await page.locator('#cart-count').textContent(), '2');
      assert.equal(await page.locator('#summary-total').textContent(), '$15.98');
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('#cart-count').textContent(), '2');
      assert.equal(await page.locator('[data-control="margherita"] .quantity-value').textContent(), '2');
      await page.locator('#open-cart').click();
      await page.locator('#order-dialog').getByRole('button', { name: 'Increase Margherita Pizza quantity', exact: true }).click();
      assert.equal(await page.locator('#summary-total').textContent(), '$23.97');
      assert.equal(await page.locator('[data-control="margherita"] .quantity-value').textContent(), '3');
      await page.locator('#order-dialog').getByRole('button', { name: 'Decrease Margherita Pizza quantity', exact: true }).click();
      await page.locator('#tip-select').selectOption('15');
      assert.match(await page.locator('#place-order').textContent(), /18\.38/);
      await page.locator('#order-dialog').getByRole('button', { name: 'Remove Margherita Pizza', exact: true }).click();
      assert.equal(await page.locator('#cart-count').textContent(), '0');
      assert.equal(await page.locator('#summary-total').textContent(), '$0.00');
      assert.match(await page.locator('#dialog-content').textContent(), /Your cart is empty/);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'close-dialog');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('[data-control="margherita"] .add-button').count(), 1);
      assert.deepEqual(errors, []);
    } finally { await context.close(); }
  });

  await check('Checkout saves an immutable tipped receipt, clears the cart and persists order history', async () => {
    const { context, page } = await pageWith();
    try {
      await page.getByRole('button', { name: 'Add Margherita Pizza to order', exact: true }).click();
      await page.locator('#open-cart').click();
      await page.locator('#tip-select').selectOption('15');
      await page.locator('#place-order').click();
      assert.match(await page.locator('#dialog-content').textContent(), /Your order is saved/);
      assert.match(await page.locator('#dialog-content').textContent(), /not been sent to a kitchen/);
      assert.equal(await page.locator('#cart-count').textContent(), '0');
      const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
      assert.equal(saved.history[0].items[0].priceCents, 799);
      assert.equal(saved.history[0].tipCents, 120);
      assert.equal(saved.history[0].totalCents, 919);
      assert.deepEqual(saved.cart, {});
      await page.getByRole('button', { name: 'Back to the menu', exact: true }).click();
      await page.reload({ waitUntil: 'networkidle' });
      await page.locator('#open-history').click();
      assert.equal(await page.locator('.history-card').count(), 1);
      assert.match(await page.locator('.history-card').textContent(), /\$9\.19/);
      assert.match(await page.locator('.history-card').textContent(), /15%/);
      await axe(page, 'Order history, light mode');
    } finally { await context.close(); }
  });

  await check('Native drawer traps keyboard focus and Escape restores the triggering button', async () => {
    const { context, page } = await pageWith();
    try {
      await page.locator('#summary-cart').focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#order-dialog').evaluate(element => element.open), true);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'close-dialog');
      for (let index = 0; index < 7; index++) {
        await page.keyboard.press('Tab');
        assert.ok(await page.evaluate(() => document.activeElement === document.querySelector('#order-dialog') || document.querySelector('#order-dialog').contains(document.activeElement)));
      }
      for (let index = 0; index < 7; index++) {
        await page.keyboard.press('Shift+Tab');
        assert.ok(await page.evaluate(() => document.querySelector('#order-dialog').contains(document.activeElement)));
      }
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#order-dialog').evaluate(element => element.open), false);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'summary-cart');
      await page.locator('#call-service').click();
      assert.match(await page.locator('#toast-message').textContent(), /Table 13 \(demo\)/);
    } finally { await context.close(); }
  });

  await check('Denied storage and malformed saved JSON recover to a working menu and cart', async () => {
    for (const mode of ['denied', 'malformed']) {
      const init = mode === 'denied'
        ? () => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage blocked', 'SecurityError'); } })
        : () => localStorage.setItem('table-thirteen:order:v1', '{invalid-json');
      const { context, page, errors } = await pageWith({}, init);
      try {
        assert.equal(await page.locator('.menu-card').count(), 17);
        assert.equal(await page.locator('#cart-count').textContent(), '0');
        await page.getByRole('button', { name: 'Add Margherita Pizza to order', exact: true }).click();
        assert.equal(await page.locator('#cart-count').textContent(), '1');
        await page.locator('#open-cart').click();
        await page.locator('#place-order').click();
        assert.match(await page.locator('#dialog-content').textContent(), mode === 'denied' ? /Your order is ready/ : /Your order is saved/);
        if (mode === 'denied') assert.match(await page.locator('#dialog-content').textContent(), /cannot save orders/);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    }
  });

  await check('Stored history is escaped, unknown products are rejected and tampered totals are recalculated', async () => {
    const { context, page, errors } = await pageWith({}, () => {
      localStorage.setItem('table-thirteen:order:v1', JSON.stringify({ cart: { margherita: 1, '<img src=x onerror=alert(1)>': 99, coke: -1 }, history: [{ id: 'safe-receipt', createdAt: '2026-11-20T12:00:00.000Z', items: [{ id: 'margherita', name: '<img src=x onerror="window.__injected=1">', quantity: 2, priceCents: 999 }], tipPercent: 0, subtotalCents: 1, totalCents: 1 }] }));
    });
    try {
      assert.equal(await page.locator('#cart-count').textContent(), '1');
      await page.locator('#open-history').click();
      assert.equal(await page.locator('.history-card img').count(), 0);
      assert.match(await page.locator('.history-card').textContent(), /<img src=x onerror=/);
      assert.match(await page.locator('.history-card').textContent(), /\$19\.98/);
      assert.equal(await page.evaluate(() => window.__injected || 0), 0);
      assert.deepEqual(errors, []);
    } finally { await context.close(); }
  });

  for (const width of [320, 390, 768, 1440]) {
    await check(`No page overflow at ${width}px in menu, populated cart and history`, async () => {
      const { context, page } = await pageWith({ viewport: { width, height: width <= 390 ? 844 : 1024 } });
      try {
        const noOverflow = async state => {
          const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth, dialogWidth: document.querySelector('#order-dialog').scrollWidth, dialogClient: document.querySelector('#order-dialog').clientWidth, open: document.querySelector('#order-dialog').open }));
          assert.ok(dimensions.scroll <= dimensions.width + 1, `${state}: ${JSON.stringify(dimensions)}`);
          if (dimensions.open) assert.ok(dimensions.dialogWidth <= dimensions.dialogClient + 1, `${state} drawer overflow: ${JSON.stringify(dimensions)}`);
        };
        await noOverflow('menu');
        await page.getByRole('button', { name: 'Add Margherita Pizza to order', exact: true }).click();
        await page.locator('#open-cart').click();
        await noOverflow('cart');
        await page.locator('#place-order').click();
        await page.getByRole('button', { name: 'Back to the menu', exact: true }).click();
        await page.locator('#open-history').click();
        await noOverflow('history');
      } finally { await context.close(); }
    });
  }

  await check('WCAG AA scans for the light menu and populated cart', async () => {
    const { context, page } = await pageWith({ viewport: viewports.mobile });
    try {
      await axe(page, 'Menu, light mode, 390px');
      await page.getByRole('button', { name: 'Add Margherita Pizza to order', exact: true }).click();
      await page.locator('#open-cart').click();
      await axe(page, 'Populated cart, light mode, 390px');
    } finally { await context.close(); }
  });

  await check('System dark mode, persisted theme toggle and dark menu/cart WCAG AA scans', async () => {
    const { context, page } = await pageWith({ colorScheme: 'dark', viewport: viewports.mobile });
    try {
      assert.equal(await page.locator('#theme-toggle').getAttribute('aria-pressed'), 'true');
      await axe(page, 'Menu, dark mode, 390px');
      await page.getByRole('button', { name: 'Add Margherita Pizza to order', exact: true }).click();
      await page.locator('#open-cart').click();
      await axe(page, 'Populated cart, dark mode, 390px');
      await page.keyboard.press('Escape');
      await page.locator('#theme-toggle').click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
      assert.equal(await page.locator('#theme-toggle').getAttribute('aria-pressed'), 'false');
    } finally { await context.close(); }
  });
} catch (error) {
  report.checks.push({ name: 'Verification setup', passed: false, error: error.message });
  console.error(error);
} finally {
  await browser?.close();
  server?.kill();
  report.passed = report.checks.every(check => check.passed);
  report.passedChecks = report.checks.filter(check => check.passed).length;
  report.totalChecks = report.checks.length;
  report.axeViolations = report.accessibility.reduce((sum, scan) => sum + scan.violations.length, 0);
  await mkdir('test-results', { recursive: true });
  await writeFile('test-results/verification.json', JSON.stringify(report, null, 2) + '\n');
  console.log(`${report.passedChecks}/${report.totalChecks} checks passed; ${report.axeViolations} axe violations. Report: test-results/verification.json`);
  if (!report.passed) process.exitCode = 1;
}
