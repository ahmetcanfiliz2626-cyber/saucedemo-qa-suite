import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import {
  successHandler,
  serverErrorHandler,
  unauthorizedHandler,
  slowHandler,
} from '../../src/mocks/handlers';
import { ProductList } from '../../src/components/ProductList';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('GET /api/products — 200', () => {
  it('ürün listesini doğru render eder', async () => {
    server.use(successHandler);
    render(<ProductList />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');

    await waitFor(() => {
      expect(screen.getByText('Sauce Labs Backpack')).toBeInTheDocument();
      expect(screen.getByText('Sauce Labs Bike Light')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(6);
    });
  });
});

describe('GET /api/products — 500', () => {
  it('hata mesajı gösterir', async () => {
    server.use(serverErrorHandler);
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Internal Server Error');
    });
  });
});

describe('GET /api/products — 401', () => {
  it('onUnauthorized callback\'i çağırır', async () => {
    server.use(unauthorizedHandler);
    const onUnauthorized = vi.fn();
    render(<ProductList onUnauthorized={onUnauthorized} />);

    await waitFor(() => {
      expect(onUnauthorized).toHaveBeenCalledOnce();
    });
  });
});

describe('GET /api/products — yavaş yanıt', () => {
  it('loading spinner görünür', async () => {
    server.use(slowHandler);
    render(<ProductList />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading...');

    // 3 saniyelik gecikme tamamlanmadan spinner hâlâ görünmeli
    await new Promise((r) => setTimeout(r, 100));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
