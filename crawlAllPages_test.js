require("dotenv").config();
const puppeteer = require("puppeteer");
const site_1 = require("./crawlingPages/site_1");
const site_2 = require("./crawlingPages/site_2");
const writeJson = require("./writeFile/json");
const writeM3u = require("./writeFile/m3u");
const writeConf = require("./writeFile/conf");

(async () => {
    const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    const page = await bowser.newPage();
    // const page_1 = await bowser.newPage();
    // const page_2 = await bowser.newPage();
    // await page.goto(process.env.SITE_1, { waitUntil: "networkidle2" });
    // await page_1.goto(process.env.SITE_1, { waitUntil: "networkidle2" });
    // await page_2.goto(process.env.SITE_2, { waitUntil: "networkidle2" });
    // const p1 = await site_1(page_1);
    // const p2 = await site_2(page_2);

    // Promise.all([p1,p2])
    //     .then(res => console.log(res))
    //     .then(res => bowser.close())
    //     .catch(err => console.error(err));
    console.log(`Start crawling sites ${process.env.SITE_1}    ${process.env.SITE_2}`);
    const p1 = await site_1(page);
    const p2 = await site_2(page);
    const data = [p1, p2];
    await bowser.close();
    console.log(data);
    console.log("End of crawl...");
    writeJson(data[0], "list_1.json");
    writeJson(data[1], "list_2.json");
    writeM3u(data[0], "list_1.m3u");
    writeM3u(data[1], "list_2.m3u");
    writeConf(data);
    console.log(new Date());
})();
