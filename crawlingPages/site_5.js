require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_5, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll("div.evsk"));
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                data.head = item.children[1].children[1].children[0].children[0].children[0].innerText.trim();
                data.updateTime = item.children[1].children[1].children[0].children[0].children[1].innerText.split('  ')[0].trim().split("\n\n").join('');
                data.link = item.children[0].href;
                lists.push(data);
            }
            return lists;
        }
    });

    if(!(data == false)){
        for (let item of data) {
            await page.goto(item.link, { waitUntil: "networkidle2" });
            await page.frames();
            let phpLink = "";
            try {
                phpLink = await page.$eval("#play iframe", iframes => iframes.src);
            } catch (err) {
                console.error("No php link...");
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            }
            await page.goto(phpLink, { waitUntil: "networkidle2" });
            const sourceLink = await page.$eval(
                "body script",
                el =>
                    el.innerText
                        .trim()
                        .split("atob('")[1]
                        .split("'")[0]
            );
            if(sourceLink == ""){
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
            }else{
                item.link = Buffer.from(sourceLink, 'base64').toString();
            }
        }
    }

    // console.log(data);
    return data;
    // await bowser.close();
};
