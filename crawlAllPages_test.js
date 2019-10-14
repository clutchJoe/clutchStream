require("dotenv").config();
const puppeteer = require("puppeteer");
const site_1 = require("./crawlingPages/site_1");
const site_2 = require("./crawlingPages/site_2");

(async () => {
    const bowser = await puppeteer.launch({ headless: false }); // { headless: false }
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
    console.log([p1, p2]);
    // console.log(p2);
    await bowser.close();
})();
