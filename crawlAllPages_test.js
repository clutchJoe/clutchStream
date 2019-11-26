require("dotenv").config();
const puppeteer = require("puppeteer");
const site_1 = require("./crawlingPages/site_1");
const site_2 = require("./crawlingPages/site_2");
const site_3 = require("./crawlingPages/site_3");
const site_4 = require("./crawlingPages/site_4");
const site_5 = require("./crawlingPages/site_5");
const site_6 = require("./crawlingPages/site_6");
const site_7 = require("./crawlingPages/site_7");
const site_8 = require("./crawlingPages/site_8");
const site_9 = require("./crawlingPages/site_9");
const writeM3u = require("./writeFile/m3u");
const writeConf = require("./writeFile/conf");

(async () => {
    const data = [];
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
    console.log(`Start crawling sites ${process.env.SITE_1}\n${process.env.SITE_2}\n${process.env.SITE_3}\n${process.env.SITE_4}\n${process.env.SITE_5}`);
    try {
        const p1 = await site_1(page);
        data.push(p1);
    } catch (err){
        data.push([]);
        console.error(`Site_1 crawling has some error...`);
    }
    try {
        const p2 = await site_2(page);
        data.push(p2);
    } catch (err){
        data.push([]);
        console.error(`Site_2 crawling has some error...`);
    }
    try {
        const p3 = await site_3(page);
        data.push(p3);
    } catch (err){
        data.push([]);
        console.error(`Site_3 crawling has some error...`);
    }
    try {
        const p4 = await site_4(page);
        data.push(p4);
    } catch (err){
        data.push([]);
        console.error(`Site_4 crawling has some error...`);
    }
    try {
        const p5 = await site_5(page);
        data.push(p5);
    } catch (err){
        data.push([]);
        console.error(`Site_5 crawling has some error...`);
    }
    try {
        const p6 = await site_6(page);
        data.push(p6);
    } catch (err){
        data.push([]);
        console.error(`Site_6 crawling has some error...`);
    }
    try {
        const p7 = await site_7(page);
        data.push(p7);
    } catch (err){
        data.push([]);
        console.error(`Site_7 crawling has some error...`);
    }
    try {
        const p8 = await site_8(page);
        data.push(p8);
    } catch (err){
        data.push([]);
        console.error(`Site_8 crawling has some error...`);
    }
    try {
        const p9 = await site_9(page);
        data.push(p9);
    } catch (err){
        data.push([]);
        console.error(`Site_9 crawling has some error...`);
    }
    
    await bowser.close();
    console.log(data);
    console.log("\nEnd of crawl...");
    writeM3u(data[0], "list_1.m3u");
    writeM3u(data[1], "list_2.m3u");
    writeM3u(data[2], "list_3.m3u");
    writeM3u(data[3], "list_4.m3u");
    writeM3u(data[4], "list_5.m3u");
    writeM3u(data[5], "list_6.m3u");
    writeM3u(data[6], "list_7.m3u");
    writeM3u(data[7], "list_8.m3u");
    writeM3u(data[8], "list_9.m3u");
    writeConf(data);
    console.log(new Date());
})();
