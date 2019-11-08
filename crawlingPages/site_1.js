require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_1, { waitUntil: "networkidle2" });
    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll("tbody tr"));
        items.shift();
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                const head = item.children[0].children[0].innerText.split(" live")[0] + " VS " + item.children[2].children[0].innerText.split(" live")[0];
                let time = "";
                item.children[1].childElementCount == 3 ? time = item.children[1].children[2].innerText : time = item.children[1].children[4].innerText;
                data.head = "(Away) " + head;
                data.updateTime = time;
                data.link = item.children[0].children[0].href;
                lists.push(data);
                data = {};
                data.head = "(Home) " + head;
                data.updateTime = time;
                data.link = item.children[2].children[0].href;
                lists.push(data);
            }
            return lists;
        }
    });

    if(!(data == false)){
        for (let item of data) {
            let phpLink = "";
            try {
                await page.goto(item.link, { waitUntil: "networkidle2" });
                await page.frames();
                phpLink = await page.$$eval("iframe", iframes => iframes.find(iframe => iframe.src.endsWith(".php")).src);
            } catch (err) {
                console.error("site_1: No php link...");
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            }
            let sourceLink = "";
            try {
                await page.goto(phpLink, { waitUntil: "networkidle2" });
                sourceLink = await page.$eval(
                    "body script",
                    el =>
                        el.innerText
                            .trim()
                            .split('source: "')[1]
                            .split('",')[0]
                );
            } catch (err) {
                console.error("site_1: something wrong on sourceLink...");
                item.head = "(Wrong) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            }
            
            if(sourceLink == ""){
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
            }else{
                item.link = sourceLink;
            }
        }
    }

    // console.log(data);
    return data;
    // await bowser.close();
};
