import React from 'react';

interface CartItem {
  name: string;
  price: number; // cents
  quantity: number;
}

interface CartSummaryProps {
  items: CartItem[];
  onCheckout: () => void;
}

export function CartSummary({ items, onCheckout }: CartSummaryProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const formatted = `$${(total / 100).toFixed(2)}`;

  return (
    <div data-testid="cart-summary">
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.name}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
          <span data-testid="cart-total">{formatted}</span>
          <button onClick={onCheckout}>Checkout</button>
        </>
      )}
    </div>
  );
}
