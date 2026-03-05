import React from 'react';

interface ProductCardProps {
  name: string;
  description: string;
  price: number; // cents
  imageUrl: string;
  onAddToCart: () => void;
}

export function ProductCard({ name, description, price, imageUrl, onAddToCart }: ProductCardProps) {
  const formatted = `$${(price / 100).toFixed(2)}`;

  return (
    <div data-testid="product-card">
      <img src={imageUrl} alt={name} />
      <h2>{name}</h2>
      <p>{description}</p>
      <span data-testid="product-price">{formatted}</span>
      <button onClick={onAddToCart}>Add to cart</button>
    </div>
  );
}
