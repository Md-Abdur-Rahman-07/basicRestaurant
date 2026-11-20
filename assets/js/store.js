import { menuById } from './menu.js';

export const STORAGE_KEY = 'table-thirteen:order:v1';
export const MAX_QUANTITY = 99;
const TIP_OPTIONS = [0, 10, 15, 20];

export function totals(cart, tipPercent = 0) {
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotalCents = Object.entries(cart).reduce((sum, [id, quantity]) => sum + (menuById.get(id)?.priceCents || 0) * quantity, 0);
  const tipCents = Math.round(subtotalCents * tipPercent / 100);
  return { count, subtotalCents, tipCents, totalCents: subtotalCents + tipCents };
}

// Local storage is untrusted input; accept only known products and bounded values.
export function validateSavedState(value) {
  const cart = {};
  const history = [];
  if (!value || typeof value !== 'object') return { cart, history };
  if (value.cart && typeof value.cart === 'object' && !Array.isArray(value.cart)) {
    for (const [id, quantity] of Object.entries(value.cart)) {
      if (menuById.has(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= MAX_QUANTITY) cart[id] = quantity;
    }
  }
  if (Array.isArray(value.history)) {
    for (const order of value.history.slice(0, 50)) {
      if (!order || !Array.isArray(order.items) || !order.items.length || order.items.length > menuById.size) continue;
      if (typeof order.id !== 'string' || !/^[A-Za-z0-9-]{1,80}$/.test(order.id)) continue;
      if (typeof order.createdAt !== 'string' || !Number.isFinite(Date.parse(order.createdAt))) continue;
      if (!TIP_OPTIONS.includes(order.tipPercent)) continue;
      const items = order.items.filter(item => item && menuById.has(item.id) && typeof item.name === 'string' && item.name.length <= 120 && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= MAX_QUANTITY && Number.isSafeInteger(item.priceCents) && item.priceCents >= 0 && item.priceCents <= 100000);
      if (items.length !== order.items.length || new Set(items.map(item => item.id)).size !== items.length) continue;
      const subtotalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
      const tipCents = Math.round(subtotalCents * order.tipPercent / 100);
      history.push({ id: order.id, createdAt: order.createdAt, items: items.map(({ id, name, quantity, priceCents }) => ({ id, name, quantity, priceCents })), subtotalCents, tipPercent: order.tipPercent, tipCents, totalCents: subtotalCents + tipCents });
    }
  }
  return { cart, history };
}

export function createOrderStore(onStorageError = () => {}) {
  let state = { cart: {}, history: [] };
  let storageFailed = false;
  const listeners = new Set();
  const reportFailure = () => {
    if (!storageFailed) onStorageError('Storage is unavailable. Your order will stay here until you leave this page.');
    storageFailed = true;
  };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { state = validateSavedState(JSON.parse(saved)); }
      catch { onStorageError('Your saved order could not be read. A fresh cart is ready.'); }
    }
  } catch { reportFailure(); }

  const notify = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageFailed = false; } catch { reportFailure(); }
    listeners.forEach(listener => listener());
  };

  return {
    get cart() { return { ...state.cart }; },
    get history() { return structuredClone(state.history); },
    get storageFailed() { return storageFailed; },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    changeQuantity(id, delta) {
      if (!menuById.has(id) || !Number.isInteger(delta)) return false;
      const quantity = Math.max(0, Math.min(MAX_QUANTITY, (state.cart[id] || 0) + delta));
      if (quantity === (state.cart[id] || 0)) return false;
      if (quantity) state.cart[id] = quantity;
      else delete state.cart[id];
      notify();
      return true;
    },
    remove(id) {
      if (!Object.hasOwn(state.cart, id)) return;
      delete state.cart[id];
      notify();
    },
    placeOrder(tipPercent = 0) {
      if (!Object.keys(state.cart).length || !TIP_OPTIONS.includes(tipPercent)) return null;
      const items = Object.entries(state.cart).map(([id, quantity]) => {
        const item = menuById.get(id);
        return { id, name: item.name, quantity, priceCents: item.priceCents };
      });
      const { subtotalCents, tipCents, totalCents } = totals(state.cart, tipPercent);
      const order = { id: crypto.randomUUID?.() || `order-${Date.now()}`, createdAt: new Date().toISOString(), items, subtotalCents, tipPercent, tipCents, totalCents };
      state = { cart: {}, history: [order, ...state.history].slice(0, 50) };
      notify();
      return structuredClone(order);
    }
  };
}
