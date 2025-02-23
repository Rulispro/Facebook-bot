const puppeteer = require("puppeteer");

// Simpan cookies dari IndexedDB ke variabel global
let allCookies = [];

// Fungsi untuk mendapatkan cookies dari IndexedDB (Frontend)
async function getCookiesFromIndexedDB() {
    return new Promise((resolve) => {
        let request = indexedDB.open("FacebookBotDB", 1);
        request.onsuccess = function () {
            let db = request.result;
            let transaction = db.transaction("accounts", "readonly");
            let store = transaction.objectStore("accounts");
            let getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = function () {
                resolve(getAllRequest.result);
            };
        };
        request.onerror = function () {
            console.error("Gagal mengambil data dari IndexedDB");
            resolve([]);
        };
    });
}

// Fungsi untuk login dengan cookies
async function loginWithCookies(page, cookies) {
    await page.setCookie(...cookies);
    await page.goto("https://www.facebook.com/");
    await page.waitForTimeout(5000);
}

// Fungsi menjalankan bot untuk satu akun
async function runBotForAccount(cookies) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await loginWithCookies(page, cookies);
    console.log("Bot berjalan untuk akun:", cookies[0]?.value || "Tanpa Nama");

    // Jalankan semua fitur
    await require("./autolike")(page);
    await require("./autounfriend")(page);
    await require("./autoaddfriend")(page);
    await require("./autoconfirm")(page);
    await require("./autoposting")(page);
    await require("./scrape_groups")(page);
    await require("./marketplace")(page);

    await browser.close();
}

// Fungsi utama untuk menjalankan bot multi-akun
async function runMultiAccountBot() {
    // Ambil cookies dari IndexedDB
    allCookies = await getCookiesFromIndexedDB();

    if (allCookies.length === 0) {
        console.log("Tidak ada akun yang login.");
        return;
    }

    console.log(`Menjalankan bot untuk ${allCookies.length} akun...`);

    // Jalankan setiap akun satu per satu
    for (let cookies of allCookies) {
        await runBotForAccount(cookies);
    }
}

// Jalankan bot multi-akun
runMultiAccountBot().catch(console.error);
,
