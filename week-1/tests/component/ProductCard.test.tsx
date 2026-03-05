import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../../src/components/ProductCard';

const defaultProps = {
  name: 'Sauce Labs Backpack',
  description: 'A must-have backpack.',
  price: 2999,
  imageUrl: '/backpack.jpg',
  onAddToCart: vi.fn(),
};

describe('ProductCard', () => {
  it('ürün adı, açıklama ve fiyatı render eder', () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByText('Sauce Labs Backpack')).toBeInTheDocument();
    expect(screen.getByText('A must-have backpack.')).toBeInTheDocument();
    expect(screen.getByTestId('product-price')).toHaveTextContent('$29.99');
  });

  it('ürün görselini doğru alt text ile render eder', () => {
    render(<ProductCard {...defaultProps} />);

    const img = screen.getByRole('img', { name: 'Sauce Labs Backpack' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/backpack.jpg');
  });

  it('"Add to cart" butonuna tıklandığında onAddToCart çağrılır', () => {
    const onAddToCart = vi.fn();
    render(<ProductCard {...defaultProps} onAddToCart={onAddToCart} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(onAddToCart).toHaveBeenCalledOnce();
  });

  it('fiyatı cents cinsinden alıp doğru formatta gösterir', () => {
    render(<ProductCard {...defaultProps} price={999} />);

    expect(screen.getByTestId('product-price')).toHaveTextContent('$9.99');
  });
});
