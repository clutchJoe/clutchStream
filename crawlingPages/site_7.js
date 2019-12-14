require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_7, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll("table tbody tr"));
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                data.head = item.children[0].children[1].innerText.trim();
                data.updateTime = item.children[1].children[0].innerText.trim();
                data.link = item.children[2].children[0].href;
                lists.push(data);
            }
            return lists;
        }
    });

    if(!(data == false)){
        for (let item of data) {
            // let phpLink = "";
            // try {
            //     await page.goto(item.link, { waitUntil: "networkidle2" });
            //     await page.frames();
            //     phpLink = await page.$eval("body iframe", iframe => iframe.src);
            // } catch (err) {
            //     console.error("No php link...");
            //     item.head = "(No Signal) "  + item.head;
            //     item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
            //     continue;
            // }
            let sourceLink = "";
            try {
                await page.goto(item.link, { waitUntil: "networkidle2" });
                sourceLink = await page.$$eval(
                    "body script",
                    els =>
                        els.find(i => i.textContent.indexOf("new Clappr.Player") != -1)
                        .textContent.split('so = "')[1].split('";')[0]
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
