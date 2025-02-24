module.exports = async function (page, reactionType, minTime, maxTime) {
    console.log(`Menjalankan autolike beranda dengan reaction: ${reactionType}...`);

    await page.goto("https://www.facebook.com/");
    await page.waitForTimeout(5000);

    let maxLikes = 120;
    let likeCount = 0;
    let reactionSelectors = {
        "Like": "div[aria-label='Like'], div[aria-label='Suka']",
        "Love": "div[aria-label='Love'], div[aria-label='Super']",
        "Care": "div[aria-label='Care'], div[aria-label='Peduli']",
        "Haha": "div[aria-label='Haha'], div[aria-label='Tertawa']",
        "Wow": "div[aria-label='Wow']",
        "Sad": "div[aria-label='Sad'], div[aria-label='Sedih']",
        "Angry": "div[aria-label='Angry'], div[aria-label='Marah']"
    };

    while (likeCount < maxLikes) {
        let likeButtons = await page.$$(reactionSelectors[reactionType]);
        if (likeButtons.length === 0) {
            console.log("Tidak ada tombol reaction ditemukan, scroll down...");
            await page.evaluate(() => window.scrollBy(0, 1000));
            await page.waitForTimeout(3000);
            continue;
        }

        for (let button of likeButtons) {
            await button.click();
            likeCount++;
            console.log(`Reaction ke-${likeCount} dengan ${reactionType}`);
            if (likeCount >= maxLikes) break;
            let waitTime = Math.random() * (maxTime - minTime) + minTime;
            await page.waitForTimeout(waitTime);
        }
    }

    console.log("Autolike selesai.");
};
