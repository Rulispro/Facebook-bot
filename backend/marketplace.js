const fs = require("fs");

module.exports = async function (page, category, postData, imageBase64) {
    console.log(`🔹 Posting ke Marketplace di kategori: ${category}...`);

    let categoryURL = {
        "create/item": "https://www.facebook.com/marketplace/create",
        "create/vehicle": "https://www.facebook.com/marketplace/create/vehicle",
        "create/housing-for-rent": "https://www.facebook.com/marketplace/create/housing-for-rent"
    };

    await page.goto(categoryURL[category]);
    await page.waitForTimeout(5000);

    await page.type("input[name='title']", postData.title);
    await page.type("input[name='price']", postData.price);
    await page.type("input[name='location']", postData.location);
    await page.type("textarea[name='description']", postData.description);

    // Simpan gambar Base64 jadi file sementara
    let imagePath = "temp_image.jpg";
    let imageData = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFileSync(imagePath, imageData, { encoding: "base64" });

    let fileInput = await page.$("input[type='file']");
    if (fileInput) {
        await fileInput.uploadFile(imagePath);
        await page.waitForTimeout(3000);
    }

    let publishButton = await page.$x("//span[contains(text(), 'Terbitkan')]/ancestor::div[contains(@role, 'button')]");
    if (publishButton.length > 0) {
        await publishButton[0].click();
        console.log("✅ Posting berhasil.");
    }

    await page.waitForTimeout(5000);
};
