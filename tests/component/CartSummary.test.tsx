import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartSummary } from '../../src/components/CartSummary';

describe('CartSummary', () => {
  it('sepet boşken "Your cart is empty." mesajı gösterir', () => {
    render(<CartSummary items={[]} onCheckout={vi.fn()} />);

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
  });

  it('ürünleri ve doğru toplam fiyatı gösterir', () => {
    const items = [
      { name: 'Backpack', price: 2999, quantity: 1 },
      { name: 'T-Shirt', price: 1599, quantity: 2 },
    ];
    render(<CartSummary items={items} onCheckout={vi.fn()} />);

    expect(screen.getByText(/Backpack/)).toBeInTheDocument();
    expect(screen.getByText(/T-Shirt/)).toBeInTheDocument();
    // 2999 + 1599*2 = 6197 → $61.97
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$61.97');
  });

  it('Checkout butonuna tıklandığında onCheckout çağrılır', () => {
    const onCheckout = vi.fn();
    const items = [{ name: 'Backpack', price: 2999, quantity: 1 }];
    render(<CartSummary items={items} onCheckout={onCheckout} />);

    fireEvent.click(screen.getByRole('button', { name: 'Checkout' }));

    expect(onCheckout).toHaveBeenCalledOnce();
  });
});
