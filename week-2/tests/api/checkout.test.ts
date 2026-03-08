import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('POST /api/checkout', () => {
  it('tüm alanlar dolu ise 201 döner', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({ firstName: 'John', lastName: 'Doe', zipCode: '12345' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ message: 'Checkout successful' });
  });

  it('tüm alanlar boş ise 400 döner', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.fields).toEqual(['firstName', 'lastName', 'zipCode']);
  });

  it('sadece firstName eksikse 400 ve fields içinde firstName döner', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({ lastName: 'Doe', zipCode: '12345' });

    expect(res.status).toBe(400);
    expect(res.body.fields).toContain('firstName');
  });
});
