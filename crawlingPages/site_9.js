require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_9, { waitUntil: "networkidle2" });
    const data = await page.evaluate(() => {
        let lists = [];
        // const temp = Array.from(document.querySelectorAll("div.page-content p")[1].children);
        const h1 = Array.from(document.querySelectorAll("div.page-content h1"));
        let day = '';
        new Date().getDate() < 10 ? day = '0' + new Date().getDate() : day = new Date().getDate();
        const tar = h1.find(i => i.innerText.split(" ")[1] == day);
        const temp = Array.from(tar.nextElementSibling.nextElementSibling.children);
        const items = temp.filter(i => i.nodeName == "SPAN").filter(i => i.innerText.indexOf("NBA") != -1);
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            const time = document.querySelectorAll("div.page-content h1")[2].innerText.split("day ")[1];
            for (let item of items) {
                let data = {};
                data.head = item.nextSibling.textContent.trim();
                data.updateTime = time;
                data.link = item.nextElementSibling.href;
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
                phpLink = await page.$$eval("iframe", iframes => iframes.filter(iframe => iframe.src.endsWith(".php"))[0].src);
            } catch (err) {
                console.error("site_9: No php link...");
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            }
            let sourceLink = "";
            try {
                await page.goto(phpLink, { waitUntil: "networkidle2" });
                sourceLink = await page.$$eval(
                    "body script",
                    els =>
                        els.find(i => i.innerText.trim().startsWith("var playerElement")).innerText
                            .split("atob('")[1]
                            .split("')")[0]
                );
            } catch (err) {
                console.error("site_9: something wrong on sourceLink...");
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
