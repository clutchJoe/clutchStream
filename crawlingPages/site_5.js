require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_5, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll("div.btn-group a"));
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                data.head = item.children[0].innerText.trim();
                data.updateTime = `${new Date().getMonth() + 1}.${new Date().getDate()}`;
                data.link = item.href;
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
                phpLink = await page.$eval("body iframe#ipopp", iframe => iframe.src);
            } catch (err) {
                console.error("site_5: No php link...");
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
                            .split("atob('")[1]
                            .split("'")[0]
                );
            } catch (err) {
                console.error("site_5: something wrong on sourceLink...");
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
