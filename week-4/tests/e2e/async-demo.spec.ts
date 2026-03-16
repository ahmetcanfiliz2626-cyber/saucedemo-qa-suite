import { test, expect } from '@playwright/test';

// =============================================================
// ASYNC/AWAIT KAVRAMI - Playwright ile Pratik Gösterim
// =============================================================
//
// JavaScript tek iş parçacıklı (single-threaded) çalışır.
// Ağ istekleri, DOM yüklenmeleri gibi işlemler zaman alır.
// async/await bu bekleme sürecini yönetmemizi sağlar.
// =============================================================

test.describe('async/await Demo', () => {

  // -----------------------------------------------------------
  // 1. await OLMADAN NE OLUR?
  // -----------------------------------------------------------
  // Aşağıdaki kod YANLIŞ kullanımı gösteriyor (çalıştırma, sadece oku):
  //
  //   test('await olmadan - YANLIŞ', ({ page }) => {
  //     //                  ↑ async eksik!
  //
  //     page.goto('https://www.saucedemo.com');
  //     // goto() bir Promise döndürür. await yoksa Playwright
  //     // sayfanın yüklenmesini BEKLEMEZ. Sonraki satır hemen çalışır.
  //
  //     page.fill('#user-name', 'standard_user');
  //     // Sayfa henüz yüklenmeden input'a yazmaya çalışır → HATA veya
  //     // yanlış davranış. Test geçse bile güvenilmez.
  //
  //     const title = page.title();
  //     // title bir string değil, çözümlenmemiş Promise<string> döner.
  //     // expect(title).toBe('Swag Labs') → her zaman BAŞARISIZ olur.
  //   });
  // -----------------------------------------------------------

  // -----------------------------------------------------------
  // 2. await İLE DOĞRU KULLANIM
  // -----------------------------------------------------------
  test('await ile doğru login testi', async ({ page }) => {
    // ↑ fonksiyon `async` tanımlanmalı ki içinde `await` kullanabilelim.

    // await: goto() tamamlanana (sayfa yüklenene) kadar bekle, sonra devam et.
    await page.goto('https://www.saucedemo.com');

    // await: input görünür olana kadar bekle, sonra yaz.
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');

    // await: tıklama ve ardından gelen navigasyon tamamlansın.
    await page.click('#login-button');

    // await: sayfa başlığı Promise döndürür; await ile string'e çözülür.
    const title = await page.title();
    expect(title).toBe('Swag Labs');

    // await: URL'in beklenen değere ulaşmasını bekle.
    await expect(page).toHaveURL(/inventory/);
  });

  // -----------------------------------------------------------
  // 3. SENKRON vs ASENKRON FARK
  // -----------------------------------------------------------
  test('senkron ve asenkron farkını anlama', async ({ page }) => {

    // SENKRON (eşzamanlı): Kod sırayla çalışır, her adım bir önceki
    // bitmeden başlamaz. JavaScript'te saf hesaplama işlemleri böyledir.
    const sayi = 2 + 2;           // Anında tamamlanır, bekleme gerekmez.
    const metin = 'merhaba'.toUpperCase(); // Yine anında, await gerekmez.
    expect(sayi).toBe(4);
    expect(metin).toBe('MERHABA');

    // ASENKRON (eşzamansız): İşlem arka planda devam ederken JS thread'i
    // bloklanmaz. Sonuç hazır olduğunda devam edilir.
    // Playwright'ın neredeyse tüm metotları asenkrondur çünkü:
    //   - Ağ üzerinden tarayıcıyla haberleşirler.
    //   - DOM'un belirli bir duruma gelmesini bekleyebilirler.

    await page.goto('https://www.saucedemo.com');
    // ↑ Tarayıcıya "git" komutu gönderilir. await ile sayfa tam yüklenene
    //   kadar beklenir. Bu sürede Node.js başka işleri yapabilirdi (event loop).

    // Promise zinciri (await olmadan da yazılabilir, ama daha az okunabilir):
    //   page.goto(...).then(() => page.fill(...)).then(() => ...)
    // async/await bu zinciri düz, okunabilir koda dönüştürür.

    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // Playwright'ın expect() assertion'ları da asenkrondur;
    // elementi belirli bir süre (timeout) içinde bekliyebilirler.
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  // -----------------------------------------------------------
  // 4. PARALEL ASENKRON İŞLEMLER (Promise.all)
  // -----------------------------------------------------------
  test('birden fazla işlemi aynı anda beklemek', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');

    // Bazen birden fazla asenkron işlemi aynı anda başlatıp hepsini
    // beklemek isteriz. Promise.all bunu sağlar:
    await Promise.all([
      page.waitForURL(/inventory/),  // URL değişimini bekle
      page.click('#login-button'),   // tıklamayı başlat
    ]);
    // ↑ Her iki işlem eş zamanlı izlenir; ikisi de tamamlanınca devam edilir.
    //   Sırayla await yapsaydık: önce URL beklenir ama tıklama olmadığı için
    //   timeout alırdık. Promise.all ile tıklama + URL bekleme birlikte çalışır.

    await expect(page.locator('.inventory_list')).toBeVisible();
  });
});
