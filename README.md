# SauceDemo QA Suite

saucedemo.com üzerinde unit, component, API ve E2E seviyelerinde kapsamlı test altyapısı.

## Proje Hakkında

Bu repo, SauceDemo e-ticaret sitesi üzerinde dört farklı test seviyesini kapsayan bir QA suite'tir. Vitest ile unit ve component testleri, Supertest ve MSW ile API testleri, Playwright ile uçtan uca E2E testleri yazılmıştır. Hafta hafta ilerleyen bir öğrenme sürecinin çıktısıdır; her hafta klasörü o haftanın odak konusunu barındırır.

---

## Kullanılan Araçlar

| Araç | Seviye | Kullanım |
|------|--------|----------|
| Vitest | Unit | Saf fonksiyon ve iş mantığı testleri |
| React Testing Library | Component | UI bileşen davranış testleri |
| MSW | Integration | API mock ile entegrasyon testleri |
| Supertest | API | HTTP endpoint testleri |
| Playwright | E2E | Tarayıcı üzerinde uçtan uca testler |

---

## Nasıl Çalıştırılır

```bash
# Unit + Component testler
npm test

# E2E testler
npm run test:e2e

# E2E görsel mod
npm run test:e2e:ui

# Codegen ile yeni test kaydetme
npm run test:e2e:codegen
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

## Proje Yapısı

```
saucedemo-qa-suite/
├── week-1/
│   ├── src/          # Unit test edilen kaynak kodlar
│   └── tests/        # Unit + Component testleri (Vitest, RTL)
├── week-2/
│   ├── src/          # API kaynak kodları
│   └── tests/        # API testleri (Supertest, MSW)
├── week-3/
│   └── tests/
│       └── e2e/
│           ├── pages/           # Page Object Model sınıfları
│           ├── bug-discovery/   # Bug keşif testleri
│           ├── bug-reports/     # Bulunan bug raporları
│           ├── login.spec.ts    # Login E2E testleri
│           └── shopping.spec.ts # Alışveriş akışı E2E testleri
├── playwright.config.ts
├── vitest.config.ts
└── package.json
```

---

## Haftalık İlerleme

- [x] Hafta 0: Ortam kurulumu + SauceDemo manuel keşif
- [x] Hafta 1: Unit testler (Vitest) + Component testler (RTL)
- [x] Hafta 2: API testler (Supertest + MSW) + Playwright E2E ilk testler
- [x] Hafta 3: POM + Bug Keşfi + Trace Viewer + Visual Testing
- [ ] Hafta 4: CI/CD + GitHub Actions (devam ediyor)
