// Simple reactive system using listeners (no Svelte stores)

import type { CartItem, CartStatus } from "./types";



// Load cart from localStorage on initialization
const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

let cart: CartItem[] = loadCart();
let status: CartStatus = {};
let queue: (() => void)[] = [];
let processing = false;

const cartListeners: Array<(cart: CartItem[]) => void> = [];
const statusListeners: Array<(status: CartStatus) => void> = [];

function saveCart() {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

function notifyCart() {
  cartListeners.forEach((fn) => fn(cart));
  saveCart(); // Save to localStorage whenever cart changes
}

function notifyStatus() {
  statusListeners.forEach((fn) => fn(status));
}

function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;
  const action = queue.shift();
  if (action) {
    
    setTimeout(() => {
      action();
      processing = false;
      processQueue();
    }, 500);
  }
}

export function addToCart(product: { id: number; title: string; price: number; image: string }) {
  if (status[product.id] === 'adding') return;
  status[product.id] = 'adding';
  notifyStatus();
  queue.push(() => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    status[product.id] = 'added';
    notifyCart();
    notifyStatus();
    setTimeout(() => {
      status[product.id] = 'idle';
      notifyStatus();
    }, 1000);
  });
  processQueue();
}

export function removeFromCart(productId: number) {
  cart = cart.filter((item) => item.id !== productId);
  notifyCart();
}

export function updateQuantity(productId: number, quantity: number) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      notifyCart();
    }
  }
}

export function clearCart() {
  cart = [];
  notifyCart();
}

export function getCart() {
  return cart;
}

export function subscribeCart(fn: (cart: CartItem[]) => void) {
  cartListeners.push(fn);
  fn(cart);
  return () => {
    const idx = cartListeners.indexOf(fn);
    if (idx !== -1) cartListeners.splice(idx, 1);
  };
}

export function subscribeStatus(fn: (status: CartStatus) => void) {
  statusListeners.push(fn);
  fn(status);
  return () => {
    const idx = statusListeners.indexOf(fn);
    if (idx !== -1) statusListeners.splice(idx, 1);
  };
} 