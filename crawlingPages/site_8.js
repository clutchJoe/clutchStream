require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_8, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll("div.entry-content p"));
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                if (item.childElementCount != 0) {
                    data.head = item.children[1].innerText.trim();
                    data.updateTime = `${new Date().getMonth() + 1}.${new Date().getDate()}`;
                    data.link = item.children[1].href;
                    lists.push(data);
                }
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
                phpLink = await page.$$eval("iframe", iframes => iframes.filter(iframe => iframe.hasAttribute("sandbox"))[0].src);
            } catch (err) {
                console.error("No php link...");
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            }
            await page.goto(phpLink, { waitUntil: "networkidle2" });
            let sourceLink = "";
            try {
                sourceLink = await page.$eval(
                    "body script",
                    el =>
                        el.innerText
                            .trim()
                            .split("atob('")[1]
                            .split("'")[0]
                );
            } catch (err) {
                console.error("something wrong...");
                item.head = "(Wrong) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            }
            
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
