require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_1, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll(".container .col-md-8 a"));
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                data.head = item.children[0].children[1].children[0].innerText;
                data.updateTime = item.children[0].children[1].children[1].innerText;
                data.link = item.getAttribute("href");
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
                phpLink = await page.$$eval("iframe", iframes => iframes.filter(iframe => iframe.src.endsWith(".php"))[0].src);
            } catch (err) {
                console.error("No php link...");
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            }
            // const phpLink = await page.$$eval("iframe", iframes => iframes.filter(iframe => iframe.src.endsWith(".php"))[0].src);
            await page.goto(phpLink, { waitUntil: "networkidle2" });
            let sourceLink = "";
            try {
                sourceLink = await page.$eval(
                    "body script",
                    el =>
                        el.innerText
                            .trim()
                            .split('source: "')[1]
                            .split('",')[0]
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
                item.link = sourceLink;
            }
        }
    }

    // console.log(data);
    return data;
    // await bowser.close();
};
