const puppeteer = require("puppeteer");

// Fungsi untuk Login dengan Cookies
async function loginWithCookies(page, cookies) {
    await page.setCookie(...cookies);
    await page.goto("https://www.facebook.com/");
    await page.waitForTimeout(5000);
}

// Fungsi Utama untuk Menjalankan Bot
async function runBot() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Masukkan cookies di sini
    let cookies = []; // Ambil dari IndexedDB atau file konfigurasi

    await loginWithCookies(page, cookies);

    console.log("Bot Facebook berjalan...");

    // Jalankan fitur sesuai kebutuhan
    await require("./autolike")(page);
    await require("./autounfriend")(page);
    await require("./autoaddfriend")(page);
    await require("./autoconfirm")(page);
    await require("./autoposting")(page);
    await require("./marketplace")(page);
    await require("./scrape_groups")(page);
    await require("./autojoin")(page);

    await browser.close();
}

// Jalankan bot
runBot().catch(console.error);
