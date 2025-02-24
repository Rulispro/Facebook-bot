const fs = require("fs");

module.exports = async function (page, groupName) {
    console.log(`🔹 Scraping grup dengan nama: ${groupName}`);
    let groups = [];

    await page.goto(`https://www.facebook.com/search/groups?q=${groupName}`);
    await page.waitForTimeout(5000);

    let groupElements = await page.$$("a[href*='/groups/']");
    for (let group of groupElements) {
        let link = await page.evaluate(el => el.href, group);
        let name = await page.evaluate(el => el.innerText, group);
        groups.push({ name, link });
    }

    fs.writeFileSync("groups.json", JSON.stringify(groups, null, 2));
    console.log("✅ Scrape selesai. Data disimpan di groups.json");
};
