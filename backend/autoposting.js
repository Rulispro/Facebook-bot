const fs = require("fs");

module.exports = async function (page, groupLinks, postData, postingHours) {
    console.log(`🔹 Mulai autoposting ke grup...`);

    for (let group of groupLinks) {
        let currentHour = new Date().getHours();
        if (!postingHours.includes(`${currentHour}:00`)) {
            console.log(`⏳ Bukan jam yang dipilih (${currentHour}:00), menunggu...`);
            continue;
        }

        console.log(`📌 Posting ke grup: ${group}`);
        await page.goto(group);
        await page.waitForTimeout(5000);

        await page.type("div[role='textbox']", postData.caption);
        
        let fileInput = await page.$("input[type='file']");
        if (fileInput && postData.imagePath) {
            await fileInput.uploadFile(postData.imagePath);
            await page.waitForTimeout(3000);
        }

        let publishButton = await page.$x("//span[contains(text(), 'Kirim')]/ancestor::div[contains(@role, 'button')]");
        if (publishButton.length > 0) {
            await publishButton[0].click();
            console.log("✅ Postingan berhasil.");
        }

        await page.waitForTimeout(5000);
    }
};
