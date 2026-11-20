import { categories, menu, menuById, money } from './menu.js';
import { createOrderStore, totals, MAX_QUANTITY } from './store.js';

// These guards deter casual inspection; browsers still allow access to DevTools.
document.addEventListener('contextmenu', event => event.preventDefault(), true);
document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  const devToolsShortcut = key === 'f12'
    || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c', 'k'].includes(key))
    || (event.metaKey && event.altKey && ['i', 'j', 'c', 'k'].includes(key));
  const viewSourceShortcut = (event.ctrlKey || event.metaKey) && key === 'u';
  if (devToolsShortcut || viewSourceShortcut) event.preventDefault();
}, true);

const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const icon = (name, className = '') => `<svg class="${className}" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${({ plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', bag: '<path d="M6 7h12l2 14H4L6 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>', check: '<path d="m5 12 4 4L19 6"/>', leaf: '<path d="M20 4C7 2 2 9 6 16s16 0 14-12Z"/><path d="m5 20 9-10"/>', fire: '<path d="M12 3c1 5 7 6 7 12a7 7 0 1 1-14 0c0-3 2-5 4-7 0 3 1 4 2 4 2-2 2-5 1-9Z"/>', moon: '<path d="M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13Z"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>' })[name] || ''}</svg>`;
const filters = { category: 'All', query: '', vegan: false, spicy: false, sort: 'recommended' };
let toastTimer;
let badgeTimer;
let tipPercent = 0;
let dialogView = '';
let dialogTrigger;
const dialog = $('#order-dialog');

function toast(message) {
  $('#toast-message').textContent = message;
  $('#toast').classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('is-visible'), 4200);
}

let pendingStorageWarning = '';
const store = createOrderStore(message => { pendingStorageWarning = message; });

function quantityControl(item, quantity, source = 'card') {
  if (!quantity) return `<button type="button" class="add-button" data-action="add" data-id="${item.id}" aria-label="Add ${escapeHTML(item.name)} to order">${icon('plus')}<span>Add</span></button>`;
  return `<div class="quantity-control" role="group" aria-label="Quantity of ${escapeHTML(item.name)}"><button type="button" data-action="decrease" data-id="${item.id}" data-source="${source}" aria-label="Decrease ${escapeHTML(item.name)} quantity">${icon('minus')}</button><span class="quantity-value">${quantity}</span><button type="button" data-action="increase" data-id="${item.id}" data-source="${source}" aria-label="Increase ${escapeHTML(item.name)} quantity" ${quantity >= MAX_QUANTITY ? 'disabled' : ''}>${icon('plus')}</button></div>`;
}

function renderCategories() {
  $('#categories').innerHTML = categories.map(category => `<button type="button" class="category-chip${category === filters.category ? ' is-active' : ''}" aria-pressed="${category === filters.category}" data-category="${category}">${category}</button>`).join('');
}

function card(item) {
  return `<article class="menu-card" data-id="${item.id}">
    <div class="card-image"><img src="assets/img/menu/${item.image}.webp" width="640" height="430" loading="lazy" decoding="async" alt="${escapeHTML(item.name)}">${item.featured ? '<span class="featured-tag">Kitchen favourite</span>' : ''}</div>
    <div class="card-content"><div class="card-eyebrow"><span>${item.category}</span><div class="card-tags">${item.vegan ? `<span class="tag tag-vegan">${icon('leaf')}Vegan</span>` : ''}${item.spicy ? `<span class="tag tag-spicy">${icon('fire')}Spicy</span>` : ''}</div></div>
    <h4 class="card-title">${item.name}</h4><p class="card-description">${item.description}</p>
    <div class="card-bottom"><div><span class="price">${money(item.priceCents)}</span><span class="calories">${item.calories} cal</span></div><div class="card-control" data-control="${item.id}">${quantityControl(item, store.cart[item.id] || 0)}</div></div></div>
  </article>`;
}

function renderMenu() {
  const visible = menu.filter(item => (filters.category === 'All' || item.category === filters.category) && (!filters.vegan || item.vegan) && (!filters.spicy || item.spicy) && `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(filters.query));
  if (filters.sort !== 'recommended') visible.sort((a, b) => filters.sort === 'price-asc' ? a.priceCents - b.priceCents : b.priceCents - a.priceCents);
  const groups = new Map();
  for (const item of visible) {
    const group = filters.category !== 'All' ? filters.category : filters.sort !== 'recommended' ? 'Your menu, your way' : item.group;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(item);
  }
  $('#menu-results').innerHTML = [...groups].map(([group, items], index) => `<section class="menu-group" aria-labelledby="menu-group-${index}"><div class="section-heading"><h3 id="menu-group-${index}">${group}</h3><span>${items.length} ${items.length === 1 ? 'dish' : 'options'}</span></div><div class="menu-grid">${items.map(card).join('')}</div></section>`).join('');
  $('#result-count').textContent = `${visible.length} ${visible.length === 1 ? 'item' : 'items'} to explore`;
  $('#empty-results').hidden = visible.length > 0;
  $('#menu-loading').hidden = true;
  $('#menu-results').setAttribute('aria-busy', 'false');
  $('#reset-filters').hidden = !(filters.query || filters.vegan || filters.spicy || filters.category !== 'All' || filters.sort !== 'recommended');
}

function restoreActionFocus(container, focused) {
  if (!focused?.id) return;
  const same = [...container.querySelectorAll('button[data-id]')].find(button => button.dataset.id === focused.id && button.dataset.action === focused.action && !button.disabled);
  const fallback = [...container.querySelectorAll('button[data-id]')].find(button => button.dataset.id === focused.id && !button.disabled);
  (same || fallback)?.focus({ preventScroll: true });
}

function syncCart() {
  const focused = document.activeElement?.dataset;
  const focusSnapshot = focused ? { id: focused.id, action: focused.action } : null;
  const focusWasInMenu = $('#menu-results').contains(document.activeElement);
  const cart = store.cart;
  document.querySelectorAll('[data-control]').forEach(control => {
    const item = menuById.get(control.dataset.control);
    control.innerHTML = quantityControl(item, cart[item.id] || 0);
  });
  const total = totals(cart);
  $('#cart-count').textContent = String(total.count);
  $('#open-cart').setAttribute('aria-label', `Cart, ${total.count} ${total.count === 1 ? 'item' : 'items'}`);
  $('#summary-count').textContent = `${total.count} ${total.count === 1 ? 'item' : 'items'}`;
  $('#summary-total').textContent = money(total.subtotalCents);
  $('#summary-status').textContent = total.count ? 'A little something to look forward to' : 'Your next favourite is waiting';
  if (dialog.open && dialogView === 'cart') renderCart();
  if (focusWasInMenu) restoreActionFocus($('#menu-results'), focusSnapshot);
  else if (dialog.open && dialogView === 'cart') {
    restoreActionFocus(dialog, focusSnapshot);
    if (!dialog.contains(document.activeElement)) $('#close-dialog').focus({ preventScroll: true });
  }
  if (pendingStorageWarning) {
    toast(pendingStorageWarning);
    pendingStorageWarning = '';
  }
}

function resetFilters() {
  Object.assign(filters, { category: 'All', query: '', vegan: false, spicy: false, sort: 'recommended' });
  $('#search').value = '';
  $('#price-sort').value = 'recommended';
  $('#vegan-filter').setAttribute('aria-pressed', 'false');
  $('#spicy-filter').setAttribute('aria-pressed', 'false');
  renderCategories();
  renderMenu();
  $('#search').focus({ preventScroll: true });
}

function drawerHeader(eyebrow, title) {
  $('#dialog-eyebrow').textContent = eyebrow;
  $('#dialog-title').textContent = title;
}

function emptyDrawer(title, message, type = 'bag') {
  $('#dialog-content').innerHTML = `<div class="drawer-empty"><div class="empty-icon">${icon(type)}</div><h3>${title}</h3><p>${message}</p><button type="button" class="primary-button" data-action="browse">Browse the menu</button></div>`;
  $('#dialog-footer').innerHTML = '<p class="drawer-note">A good meal starts with a little browsing.</p>';
}

function renderCart() {
  drawerHeader('TABLE 13', 'Your order');
  const cart = store.cart;
  const total = totals(cart, tipPercent);
  const persistenceNote = store.storageFailed ? 'This browser cannot save orders after you leave this page.' : 'Orders are saved on this device only.';
  if (!total.count) { emptyDrawer('Your cart is empty', 'Browse the menu and find something you love.'); return; }
  $('#dialog-content').innerHTML = `<p class="drawer-intro">Good choices. Make yourself comfortable.</p><div class="cart-items">${Object.entries(cart).map(([id, quantity]) => {
    const item = menuById.get(id);
    return `<article class="cart-item" data-id="${id}"><img src="assets/img/menu/${item.image}.webp" width="88" height="88" alt="${escapeHTML(item.name)}"><div class="cart-item-details"><h3>${item.name}</h3><p>${money(item.priceCents)} each</p>${quantityControl(item, quantity, 'cart')}</div><div class="cart-item-end"><strong>${money(item.priceCents * quantity)}</strong><button type="button" class="remove-button" data-action="remove" data-id="${id}" aria-label="Remove ${escapeHTML(item.name)}">${icon('trash')}<span>Remove</span></button></div></article>`;
  }).join('')}</div><div class="order-note">${icon('leaf')}<p>Freshly prepared, just for you.<br>Let our team know about any allergies before ordering.</p></div>`;
  $('#dialog-footer').innerHTML = `<div class="totals-row"><span>Subtotal (${total.count} ${total.count === 1 ? 'item' : 'items'})</span><strong>${money(total.subtotalCents)}</strong></div><div class="totals-row tip-row"><label for="tip-select">A little thank-you <span>(optional)</span></label><select id="tip-select">${[0, 10, 15, 20].map(percent => `<option value="${percent}" ${percent === tipPercent ? 'selected' : ''}>${percent ? percent + '%' : 'No tip'}</option>`).join('')}</select></div>${tipPercent ? `<div class="totals-row"><span>Tip (${tipPercent}%)</span><span>${money(total.tipCents)}</span></div>` : ''}<div class="totals-row order-total"><span>Total</span><strong>${money(total.totalCents)}</strong></div><p class="tax-note">Prices include tax.</p><button type="button" id="place-order" class="primary-button full-width">Place order <span>${money(total.totalCents)}</span></button><p class="drawer-note">Demo ordering · no payment required<br>${persistenceNote}</p>`;
}

function renderHistory() {
  drawerHeader('YOUR VISIT', 'Order history');
  const history = store.history;
  if (!history.length) { emptyDrawer('A fresh start', 'Your orders will appear here after you place one.', 'clock'); return; }
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  $('#dialog-content').innerHTML = `<p class="drawer-intro">A little record of the good stuff.</p><div class="history-list">${history.map(order => `<article class="history-card"><div class="history-card-header"><span class="history-status">${icon('check')}${store.storageFailed ? 'Available this visit' : 'Saved on this device'}</span><strong>${money(order.totalCents)}</strong></div><h3>Table 13 · ${escapeHTML(order.id.slice(0, 8).toUpperCase())}</h3><time datetime="${escapeHTML(order.createdAt)}">${escapeHTML(date.format(new Date(order.createdAt)))}</time><ul>${order.items.map(item => `<li><span>${item.quantity} × ${escapeHTML(item.name)}</span><span>${money(item.priceCents * item.quantity)}</span></li>`).join('')}</ul>${order.tipCents ? `<div class="totals-row"><span>Tip (${order.tipPercent}%)</span><span>${money(order.tipCents)}</span></div>` : ''}</article>`).join('')}</div>`;
  $('#dialog-footer').innerHTML = `<p class="drawer-note">${store.storageFailed ? 'This browser cannot save orders after you leave this page.' : 'Orders are saved on this device only.'}<br>This demo does not send orders to a kitchen.</p><button type="button" class="secondary-button full-width" data-action="browse">Back to the menu</button>`;
}

function renderSuccess(order) {
  dialogView = 'success';
  drawerHeader('THANK YOU', 'A delicious choice');
  $('#dialog-content').innerHTML = `<div class="order-success"><div class="success-icon">${icon('check')}</div><p class="eyebrow">TABLE 13</p><h3>${store.storageFailed ? 'Your order is ready.' : 'Your order is saved.'}</h3><p>One less thing to think about.<br>Enjoy the company, and the good food.</p><div class="success-receipt"><span>${order.items.reduce((sum, item) => sum + item.quantity, 0)} items · ${escapeHTML(order.id.slice(0, 8).toUpperCase())}</span><strong>${money(order.totalCents)}</strong></div><p class="demo-note">${store.storageFailed ? 'This browser cannot save orders. Keep this page open to view your order. This demo has not sent it to a kitchen.' : 'This is a demo. Your order is saved on this device and has not been sent to a kitchen.'}</p></div>`;
  $('#dialog-footer').innerHTML = '<button type="button" class="primary-button full-width" data-action="browse">Back to the menu</button><button type="button" class="text-button full-width" data-action="history">View order history</button>';
}

function openDrawer(view, trigger) {
  dialogView = view;
  dialogTrigger = trigger || document.activeElement;
  if (view === 'cart') renderCart(); else renderHistory();
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('drawer-open');
  $('#close-dialog').focus({ preventScroll: true });
}

function closeDrawer() { if (dialog.open) dialog.close(); }

function updateTheme(theme) {
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
  const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  $('#theme-toggle').innerHTML = icon(dark ? 'sun' : 'moon');
  $('#theme-toggle').setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  $('#theme-toggle').setAttribute('aria-pressed', String(dark));
}

function setupTheme() {
  let theme;
  try { const saved = localStorage.getItem('table-thirteen:theme'); if (saved === 'light' || saved === 'dark') theme = saved; } catch {}
  updateTheme(theme);
  $('#theme-toggle').addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    updateTheme(next);
    try { localStorage.setItem('table-thirteen:theme', next); } catch { toast('Theme changed. This browser cannot save your preference.'); }
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!document.documentElement.dataset.theme) updateTheme(); });
}

try {
  setupTheme();
  renderCategories();
  renderMenu();
  syncCart();
  store.subscribe(syncCart);
  $('#categories').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    filters.category = button.dataset.category;
    $('#categories').querySelectorAll('[data-category]').forEach(chip => {
      const active = chip === button;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    button.scrollIntoView({ behavior: 'auto', inline: 'nearest', block: 'nearest' });
    renderMenu();
  });
  $('#search').addEventListener('input', event => { filters.query = event.target.value.trim().toLowerCase(); renderMenu(); });
  for (const key of ['vegan', 'spicy']) $('#'+key+'-filter').addEventListener('click', event => {
    filters[key] = !filters[key];
    event.currentTarget.setAttribute('aria-pressed', String(filters[key]));
    renderMenu();
  });
  $('#price-sort').addEventListener('change', event => { filters.sort = event.target.value; renderMenu(); });
  $('#reset-filters').addEventListener('click', resetFilters);
  $('#clear-search').addEventListener('click', resetFilters);
  $('#open-cart').addEventListener('click', event => openDrawer('cart', event.currentTarget));
  $('#summary-cart').addEventListener('click', event => openDrawer('cart', event.currentTarget));
  $('#open-history').addEventListener('click', event => openDrawer('history', event.currentTarget));
  $('#close-dialog').addEventListener('click', closeDrawer);
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not(:disabled), select:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]')].filter(element => element.getClientRects().length);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  dialog.addEventListener('click', event => { if (event.target === dialog && event.clientX < dialog.getBoundingClientRect().left) closeDrawer(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('drawer-open'); dialogView = ''; if (dialogTrigger?.isConnected) dialogTrigger.focus({ preventScroll: true }); });
  $('#call-service').addEventListener('click', () => toast('Service requested for Table 13 (demo). No request is sent to a restaurant.'));
  document.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled) return;
    const { action, id } = button.dataset;
    if (['add', 'increase', 'decrease'].includes(action)) {
      const changed = store.changeQuantity(id, action === 'decrease' ? -1 : 1);
      if (changed && action !== 'decrease') {
        toast(`${menuById.get(id).name} added to your order.${store.storageFailed ? ' This browser cannot save it after you leave.' : ''}`);
        $('#cart-count').classList.remove('bump');
        requestAnimationFrame(() => $('#cart-count').classList.add('bump'));
        clearTimeout(badgeTimer);
        badgeTimer = setTimeout(() => $('#cart-count').classList.remove('bump'), 400);
      } else if (changed) toast(`${menuById.get(id).name} quantity updated.`);
    } else if (action === 'remove') {
      store.remove(id);
      toast(`${menuById.get(id).name} removed from your order.`);
      if (dialog.open && !dialog.contains(document.activeElement)) $('#close-dialog').focus();
    } else if (action === 'browse') closeDrawer();
    else if (action === 'history') { dialogView = 'history'; renderHistory(); $('#close-dialog').focus(); }
  });
  dialog.addEventListener('change', event => {
    if (event.target.id !== 'tip-select') return;
    tipPercent = Number(event.target.value);
    renderCart();
    $('#tip-select')?.focus({ preventScroll: true });
  });
  dialog.addEventListener('click', event => {
    if (!event.target.closest('#place-order')) return;
    const order = store.placeOrder(tipPercent);
    if (!order) return;
    tipPercent = 0;
    renderSuccess(order);
    $('#close-dialog').focus({ preventScroll: true });
    toast(store.storageFailed ? 'Your demo order is ready. Keep this page open; this browser cannot save it.' : 'Your demo order is saved on this device.');
  });
  document.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement) {
      event.target.classList.add('image-unavailable');
      event.target.closest('.card-image')?.classList.add('image-error');
    }
  }, true);
} catch (error) {
  $('#menu-loading').hidden = true;
  $('#menu-error').hidden = false;
  console.error('The menu could not be initialized.', error);
}
