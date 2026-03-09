# SauceDemo QA Suite

saucedemo.com üzerinde unit, component, API ve E2E seviyelerinde kapsamlı test altyapısı.

---

## Kullanılan Araçlar

| Araç | Seviye |
|------|--------|
| Vitest | Unit |
| React Testing Library | Component |
| MSW | Integration |
| Supertest | API |
| Playwright | E2E |

---

## Nasıl Çalıştırılır

```bash
# Unit + Component testler
npm test

# E2E testler
npx playwright test

# E2E görsel mod
npx playwright test --ui
```

---

## Test Sayıları

| Seviye | Araç | Test Sayısı |
|--------|------|-------------|
| Unit | Vitest | 28 |
| Component | React Testing Library | 12 |
| API | Supertest | 8 |
| Integration | MSW | 4 |
| E2E | Playwright | 18 |
| **Toplam** | | **70** |

---

## Test Edilen Senaryolar

- **Login** — geçerli giriş, hatalı credentials, kilitli kullanıcı, boş alanlar
- **Inventory** — ürün listeleme, sıralama, sepete ekleme
- **Cart** — ürün görüntüleme, ürün silme, alışverişe devam
- **Checkout** — form doldurma, fiyat doğrulama, sipariş tamamlama
- **Bug Keşfi** — `problem_user`, `error_user`, `performance_glitch_user`

---

## Bug Raporları

8 bug tespit edildi. Raporlar `week-3/tests/e2e/bug-reports/` klasöründe yer almaktadır.

| ID | Severity | Kullanıcı | Açıklama |
|----|----------|-----------|----------|
| BUG-001 | High | problem_user | Ürün görselleri yanlış gösteriliyor |
| BUG-002 | Critical | problem_user | "Add to cart" bazı ürünlerde çalışmıyor |
| BUG-003 | Medium | problem_user | Sıralama çalışmıyor |
| BUG-004 | High | problem_user | Detay sayfasında yanlış ürün açılıyor |
| BUG-005 | Critical | problem_user | Checkout'ta Last Name alanı siliniyor |
| BUG-006 | Critical | error_user | Checkout'ta Last Name alanı siliniyor |
| BUG-007 | Medium | error_user | Sıralama çalışmıyor |
| BUG-008 | Low | performance_glitch_user | Login süresi 5172ms — limit 5000ms |

---

## Haftalık İlerleme

- [x] Hafta 0: Ortam kurulumu
- [x] Hafta 1: Unit + Component testler
- [x] Hafta 2: API + E2E testler
- [x] Hafta 3: POM + Bug Keşfi
- [ ] Hafta 4: CI/CD + Final
