const puppeteer = require("puppeteer");

module.exports = async function autoAddFriend() {
    console.log("🚀 Memulai Auto Add Friend untuk semua akun...");

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // 🔹 Ambil semua akun dari IndexedDB
    let accounts = await page.evaluate(async () => {
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
        });
    });

    if (!accounts || accounts.length === 0) {
        console.log("❌ Tidak ada akun yang tersimpan!");
        await browser.close();
        return;
    }

    for (let account of accounts) {
        let { name, cookies } = account;
        console.log(`🔹 Login ke akun: ${name}`);

        await page.setCookie(...cookies);
        await page.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });
        await page.waitForTimeout(3000);

        // 🔹 Ambil data auto add friend dari IndexedDB
        let friendData = await page.evaluate(async () => {
            return new Promise((resolve) => {
                let request = indexedDB.open("FacebookBotDB", 1);
                request.onsuccess = function () {
                    let db = request.result;
                    let transaction = db.transaction("settings", "readonly");
                    let store = transaction.objectStore("settings");
                    let getRequest = store.get("autoAddFriend");

                    getRequest.onsuccess = function () {
                        resolve(getRequest.result);
                    };
                };
            });
        });

        if (!friendData) {
            console.log("❌ Data Auto Add Friend tidak tersedia.");
            continue;
        }

        let { targetUsername, source, maxAdd, minInterval, maxInterval } = friendData;
        console.log(`🎯 Target: ${targetUsername}, Sumber: ${source}, Maksimal: ${maxAdd} teman`);

        let targetURL = `https://www.facebook.com/${targetUsername}/${source}`;
        await page.goto(targetURL, { waitUntil: "networkidle2" });
        await page.waitForTimeout(3000);

        let addButtons = await page.$x("//span[contains(text(), 'Tambah Teman')]/ancestor::div[contains(@role, 'button')]");

        let count = 0;
        for (let button of addButtons) {
            if (count >= maxAdd) break;

            await button.click();
            console.log(`✅ ${name} menambahkan ${count + 1} teman.`);
            count++;

            let interval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;
            await page.waitForTimeout(interval * 1000);
        }

        console.log(`🎉 ${name} selesai! Berhasil menambahkan ${count} teman.`);
    }

    await browser.close();
};
