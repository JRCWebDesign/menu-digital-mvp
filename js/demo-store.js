import { restaurants } from './data.js';

export const STORAGE_KEY = 'algora.menu-demo.v1';
export const SESSION_KEY = 'algora.menu-demo.login';
export const DEMO_USER = 'admin@algora.demo';
export const DEMO_PASSWORD = 'AlgoraDemo2026';
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function safeImage(value) {
  const image = String(value || '');
  return /^(\.\/assets\/img\/[\w.-]+|data:image\/(png|jpeg|webp);base64,[a-zA-Z0-9+/=]+)$/.test(image) ? image : '';
}
export function initialData() {
  const restaurant = structuredClone(restaurants['lKb-smash']);
  restaurant.products.forEach(p => Object.assign(p, { active: true, offerEnabled: false, offerPrice: null }));
  restaurant.promotion = { active: false, title: 'Una promo para compartir', text: 'Descubrí nuestro Combo Familiar.', productId: 'family' };
  return restaurant;
}
export function validateData(data) {
  if (!data || !Array.isArray(data.products) || !Array.isArray(data.categories) || !data.promotion) throw new Error('Datos de demo inválidos.');
  const ids = new Set();
  for (const p of data.products) {
    if (!p.id || ids.has(p.id) || !p.name?.trim() || !data.categories.some(c => c.id === p.categoryId)) throw new Error('Revisá el nombre y la categoría.');
    ids.add(p.id);
    if (!Number.isFinite(p.price) || p.price <= 0) throw new Error('El precio debe ser mayor que cero.');
    if (p.offerEnabled && (!Number.isFinite(p.offerPrice) || p.offerPrice <= 0 || p.offerPrice >= p.price)) throw new Error('La oferta debe ser mayor que cero y menor al precio habitual.');
    if (p.image && !safeImage(p.image)) throw new Error('Usá una imagen PNG, JPG o WebP.');
  }
  const promo = data.promotion;
  if (promo.active && (!promo.title?.trim() || !data.products.some(p => p.id === promo.productId && p.active !== false))) throw new Error('La promoción necesita título y un producto visible.');
  return data;
}
export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialData();
  try { return validateData(JSON.parse(raw)); }
  catch { throw new Error('No se pudieron leer los datos guardados. Restaurá la demo desde el panel.'); }
}
export function saveData(data) {
  validateData(data);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch { throw new Error('No se pudo guardar. El almacenamiento puede estar lleno o bloqueado; probá una imagen más pequeña.'); }
}
export function resetData() { localStorage.removeItem(STORAGE_KEY); return initialData(); }
export function publicData(data) {
  const copy = structuredClone(data);
  copy.products = copy.products.filter(p => p.active !== false).map(p => ({ ...p,
    name: escapeHtml(p.name), description: escapeHtml(p.description), image: safeImage(p.image),
    regularPrice: p.price, price: p.offerEnabled ? p.offerPrice : p.price
  }));
  return copy;
}
