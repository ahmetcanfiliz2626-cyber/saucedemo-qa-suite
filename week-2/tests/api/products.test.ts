import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('GET /api/products', () => {
  it('200 ve 6 ürün döner', async () => {
    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.products).toHaveLength(6);
  });

  it('her üründe id, name, price alanları bulunur', async () => {
    const res = await request(app).get('/api/products');

    for (const product of res.body.products) {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
    }
  });
});
