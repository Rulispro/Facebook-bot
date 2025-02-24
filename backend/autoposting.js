const fs = require("fs");

module.exports = async function (page, groupURL, text, mediaBase64) {
    console.log(`🔹 Posting ke grup: ${groupURL}...`);
    
    await page.goto(groupURL);
    await page.waitForTimeout(5000);

    // Cek apakah bisa posting (ada input status)
    let postBox = await page.$("div[role='textbox']");
    if (!postBox) {
        console.log("❌ Tidak bisa memposting di grup ini.");
        return;
    }

    // Klik input status
    await postBox.click();
    await page.waitForTimeout(3000);

    // Ketik teks status
    await page.keyboard.type(text, { delay: 50 });
    await page.waitForTimeout(3000);

    // Simpan media Base64 ke file sementara
    let mediaType = mediaBase64.startsWith("data:image/") ? "image.jpg" : "video.mp4";
    let mediaData = mediaBase64.replace(/^data:(image|video)\/\w+;base64,/, "");
    fs.writeFileSync(mediaType, mediaData, { encoding: "base64" });

    // Upload media
    let fileInput = await page.$("input[type='file']");
    if (fileInput) {
        await fileInput.uploadFile(mediaType);
        await page.waitForTimeout(5000);
    }

    // Klik tombol "Kirim" atau "Posting"
    let postButton = await page.$x("//span[contains(text(), 'Kirim') or contains(text(), 'Posting')]/ancestor::div[contains(@role, 'button')]");
    if (postButton.length > 0) {
        await postButton[0].click();
        console.log("✅ Posting berhasil.");
    }

    await page.waitForTimeout(5000);
};
