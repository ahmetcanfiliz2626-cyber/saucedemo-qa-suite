export interface CartItem {
  name: string;
  price: number; // cents
  quantity: number;
}

export interface Product {
  name: string;
  price: number; // cents
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(pw: string): boolean {
  return pw.length >= 8 && /\d/.test(pw);
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function applyDiscount(total: number, code: string): number {
  if (code === 'SAVE10') {
    return total * 0.9;
  }
  return total;
}

export function sortProducts(products: Product[], by: 'price' | 'name'): Product[] {
  return [...products].sort((a, b) => {
    if (by === 'price') return a.price - b.price;
    return a.name.localeCompare(b.name);
  });
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
