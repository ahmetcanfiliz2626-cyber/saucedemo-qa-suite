import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  calculateCartTotal,
  applyDiscount,
  sortProducts,
  formatPrice,
} from './helpers';

describe('validateEmail', () => {
  it('geçerli email formatını kabul eder', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.name+tag@domain.org')).toBe(true);
  });

  it('@ işareti olmayan emaili reddeder', () => {
    expect(validateEmail('invalidemail.com')).toBe(false);
  });

  it('domain kısmı olmayan emaili reddeder', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('boş string reddeder', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('boşluk içeren emaili reddeder', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('8 karakter ve rakam içeren şifreyi kabul eder', () => {
    expect(validatePassword('password1')).toBe(true);
    expect(validatePassword('Abc12345')).toBe(true);
  });

  it('8 karakterden kısa şifreyi reddeder', () => {
    expect(validatePassword('Pass1')).toBe(false);
  });

  it('rakam içermeyen şifreyi reddeder', () => {
    expect(validatePassword('passwordonly')).toBe(false);
  });

  it('tam 8 karakter ve rakam içereni kabul eder', () => {
    expect(validatePassword('abcdef1g')).toBe(true);
  });

  it('boş string reddeder', () => {
    expect(validatePassword('')).toBe(false);
  });
});

describe('calculateCartTotal', () => {
  it('tekli ürün toplamını doğru hesaplar', () => {
    expect(calculateCartTotal([{ name: 'Shirt', price: 1999, quantity: 1 }])).toBe(1999);
  });

  it('birden fazla ürünü doğru toplar', () => {
    const items = [
      { name: 'Shirt', price: 1999, quantity: 2 },
      { name: 'Pants', price: 3999, quantity: 1 },
    ];
    expect(calculateCartTotal(items)).toBe(7997);
  });

  it('boş sepette 0 döner', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  it('adet ile fiyatı çarparak toplar', () => {
    const items = [{ name: 'Socks', price: 500, quantity: 4 }];
    expect(calculateCartTotal(items)).toBe(2000);
  });
});

describe('applyDiscount', () => {
  it("SAVE10 kodu %10 indirim uygular", () => {
    expect(applyDiscount(10000, 'SAVE10')).toBe(9000);
  });

  it('geçersiz kodda toplam değişmez', () => {
    expect(applyDiscount(10000, 'INVALID')).toBe(10000);
  });

  it('boş kod girildiğinde toplam değişmez', () => {
    expect(applyDiscount(5000, '')).toBe(5000);
  });

  it('0 toplama indirim uygulandığında 0 döner', () => {
    expect(applyDiscount(0, 'SAVE10')).toBe(0);
  });
});

describe('sortProducts', () => {
  const products = [
    { name: 'Backpack', price: 2999 },
    { name: 'T-Shirt', price: 1599 },
    { name: 'Hoodie', price: 3999 },
  ];

  it("fiyata göre artan sırayla sıralar", () => {
    const sorted = sortProducts(products, 'price');
    expect(sorted[0].price).toBe(1599);
    expect(sorted[1].price).toBe(2999);
    expect(sorted[2].price).toBe(3999);
  });

  it("isme göre alfabetik sıralar", () => {
    const sorted = sortProducts(products, 'name');
    expect(sorted[0].name).toBe('Backpack');
    expect(sorted[1].name).toBe('Hoodie');
    expect(sorted[2].name).toBe('T-Shirt');
  });

  it('orijinal diziyi değiştirmez', () => {
    const original = [...products];
    sortProducts(products, 'price');
    expect(products).toEqual(original);
  });

  it('tek elemanlı diziyi aynen döner', () => {
    const single = [{ name: 'Item', price: 100 }];
    expect(sortProducts(single, 'price')).toEqual(single);
  });

  it('boş dizi girişinde boş dizi döner', () => {
    expect(sortProducts([], 'name')).toEqual([]);
  });
});

describe('formatPrice', () => {
  it('2999 kuruşu $29.99 formatına çevirir', () => {
    expect(formatPrice(2999)).toBe('$29.99');
  });

  it('tam sayı değeri doğru formatlar', () => {
    expect(formatPrice(1000)).toBe('$10.00');
  });

  it('0 değerini $0.00 olarak formatlar', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('tek haneli kuruş değerini doğru formatlar', () => {
    expect(formatPrice(101)).toBe('$1.01');
  });

  it('büyük değerleri doğru formatlar', () => {
    expect(formatPrice(99999)).toBe('$999.99');
  });
});
