require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_8, { waitUntil: "networkidle2" });
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
            let temp = "";
            try {
                await page.goto(item.link, { waitUntil: "networkidle2" });
                temp = await page.$$eval(
                    "table#dataTable tbody", 
                    els => 
                    Array.from(els[1].children)
                    .find(i => i.children[1].innerText.indexOf("givemeredditstream") != -1)
                    .children[3].children[0].href
                );
            } catch (err) {
                console.error("site_8: No temp link...");
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            }
            let sourceLink = "";
            try {
                await page.goto(temp, { waitUntil: "networkidle2" });
                sourceLink = await page.$$eval(
                    "body script",
                    els =>
                        els.find(i => i.innerText.indexOf("Clappr.Player") != -1).innerText
                            .split("source:")[1]
                            .split("'")[1]
                );
            } catch (err) {
                console.error("site_8: something wrong on sourceLink...");
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
