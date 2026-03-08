import { http, HttpResponse, delay } from 'msw';
import { products } from '../data/products';

export const successHandler = http.get('/api/products', () => {
  return HttpResponse.json({ products });
});

export const serverErrorHandler = http.get('/api/products', () => {
  return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
});

export const unauthorizedHandler = http.get('/api/products', () => {
  return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
});

export const slowHandler = http.get('/api/products', async () => {
  await delay(3000);
  return HttpResponse.json({ products });
});

// Varsayılan handler seti (başarılı senaryo)
export const handlers = [successHandler];
