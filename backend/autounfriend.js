module.exports = async function (page, minTime, maxTime) {
    console.log("Menjalankan autounfriend...");

    await page.goto("https://www.facebook.com/friends");
    await page.waitForTimeout(5000);

    let maxUnfriends = 50;
    let unfriendCount = 0;

    while (unfriendCount < maxUnfriends) {
        let unfriendButtons = await page.$x("//span[contains(text(), 'Teman')]/ancestor::div[contains(@role, 'button')]");
        if (unfriendButtons.length === 0) {
            console.log("Tidak ada teman yang bisa dihapus.");
            break;
        }

        for (let button of unfriendButtons) {
            await button.click();
            await page.waitForTimeout(2000);
            
            let confirmButton = await page.waitForXPath("//span[contains(text(), 'Hapus sebagai teman')]/ancestor::div[contains(@role, 'button')]");
            if (confirmButton) {
                await confirmButton.click();
                unfriendCount++;
                console.log(`Unfriend ke-${unfriendCount}`);
                if (unfriendCount >= maxUnfriends) break;
                let waitTime = Math.random() * (maxTime - minTime) + minTime;
                await page.waitForTimeout(waitTime);
            }
        }
    }

    console.log("Autounfriend selesai.");
};
