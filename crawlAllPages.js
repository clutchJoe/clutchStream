require("dotenv").config();
const puppeteer = require("puppeteer");
const site_1 = require("./crawlingPages/site_1");
const site_2 = require("./crawlingPages/site_2");
const site_3 = require("./crawlingPages/site_3");
const writeJson = require("./writeFile/json");
const writeM3u = require("./writeFile/m3u");
const writeConf = require("./writeFile/conf");

module.exports = async () => {
    // let data = [];
    // { headless: false },{args: ['--no-sandbox']}
    const data = [];
    const bowser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await bowser.newPage();
    // const page_1 = await bowser.newPage();
    // const page_2 = await bowser.newPage();
    // await page_1.goto(process.env.SITE_1, { waitUntil: "networkidle2" });
    // await page_2.goto(process.env.SITE_2, { waitUntil: "networkidle2" });
    // console.log(`Start crawling sites ${process.env.SITE_1}    ${process.env.SITE_2}`);
    // const p1 = await site_1(page_1);
    // const p2 = await site_2(page_2);

    // await Promise.all([p1,p2])
    //     .then(res => {
    //         console.log(res);
    //         console.log("End of crawl...");
    //         data = res;
    //     })
    //     .then(res => bowser.close())
    //     .catch(err => console.error(err));
    // writeJson(data[0], "list_1.json");
    // writeJson(data[1], "list_2.json");
    // writeM3u(data[0], "list_1.m3u");
    // writeM3u(data[1], "list_2.m3u");
    // writeConf(data);
    // console.log(new Date());
    console.log(`Start crawling sites\n${process.env.SITE_1}\n${process.env.SITE_2}\n${process.env.SITE_3}`);
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
    await bowser.close();
    console.log(`\nEnd of crawl...`);
    // writeJson(data[0], "list_1.json");
    // writeJson(data[1], "list_2.json");
    writeM3u(data[0], "list_1.m3u");
    writeM3u(data[1], "list_2.m3u");
    writeM3u(data[2], "list_3.m3u");
    writeConf(data);
    console.log(new Date());
    return await data;
};
