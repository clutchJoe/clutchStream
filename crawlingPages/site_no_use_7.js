require("dotenv").config({ path: "../.env" });
const puppeteer = require("puppeteer");

(async () => {
    const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    const page = await bowser.newPage();
    await page.goto("http://www.volokit.com/all-games/schedule/nba.php", { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll("tr"));
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let i = 1; i < items.length; i++) {
                let data = {};
                data.head = items[i].children[1].children[3].innerText;
                data.updateTime = items[i].children[0].children[0].innerText;
                data.link = items[i].children[1].children[3].href;
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
                phpLink = await page.$eval("#volokit-feed", iframes => iframes.src);
                if (!phpLink.endsWith(".php")) {
                    console.error("No php link...1");
                    item.head = "(No Signal) "  + item.head;
                    item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                    continue;
                } else {
                    try {
                        await page.goto(phpLink, { waitUntil: "networkidle2" });
                        phpLink = await page.$eval("#volokit-feed", iframes => iframes.src);
                        if (!phpLink.endsWith(".php")) {
                            item.head = "(No Signal) "  + item.head;
                            item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                            continue;
                        }
                    } catch {
                        console.error("No php link...");
                        item.head = "(No Signal) "  + item.head;
                        item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                        continue;
                    }
                }
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

    console.log(data);
    // return data;
    await bowser.close();
})();
