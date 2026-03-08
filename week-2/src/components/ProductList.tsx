import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Props {
  onUnauthorized?: () => void;
}

export function ProductList({ onUnauthorized }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then(async (res) => {
        if (res.status === 401) {
          onUnauthorized?.();
          return;
        }
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? 'Something went wrong');
        }
        const data = await res.json();
        setProducts(data.products);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [onUnauthorized]);

  if (loading) return <div role="status">Loading...</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
