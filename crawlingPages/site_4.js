require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_4, { waitUntil: "networkidle2" });
    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll("div.score-tile__status a.score-tile-wrapper"));
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                data.updateTime = item.innerText.split("\n").reverse()[0];
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
            const tar = await page.evaluate(() => {
                let temp = {};
                temp.head = document.querySelector("h1.article-title").innerText;
                // temp.updateTime = document.querySelector("dd.published").innerText;
                const find = Array.from(document.querySelectorAll("body iframe"));
                temp.phpLink = find.filter(i => i.src.endsWith(".php"));
                if (temp.phpLink == false) {
                    temp.phpLink = "empty";
                } else {
                    temp.phpLink = temp.phpLink[0].src;
                }
                return temp;
            });
            item.head = tar.head;
            // item.updateTime = tar.updateTime;
            if (tar.phpLink === "empty") {
                console.error("site_4: No php link...");
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            } else {
                let sourceLink = "";
                try {
                    await page.goto(tar.phpLink, { waitUntil: "networkidle2" });
                    sourceLink = await page.$$eval(
                        "body script",
                        els =>
                            els.filter(i => i.textContent.trim().startsWith("var playerElement"))[0].innerText
                                .split("source: '")[1]
                                .split("'")[0]
                    );
                } catch (err) {
                    console.error("site_4: something wrong on sourceLink...");
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
    }

    // console.log(data);
    return data;
    // await bowser.close();
};
