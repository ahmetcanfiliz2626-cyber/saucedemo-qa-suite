import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/app';

describe('POST /api/login', () => {
  it('geçerli credentials ile 200 döner', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'standard_user', password: 'secret_sauce' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ message: 'Login successful', username: 'standard_user' });
  });

  it('kilitli kullanıcı ile 403 döner', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'locked_out_user', password: 'secret_sauce' });

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  it('yanlış şifre ile 401 döner', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'standard_user', password: 'wrong_password' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
