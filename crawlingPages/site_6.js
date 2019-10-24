require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_6, { waitUntil: "networkidle2" });
    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll("div.entry-content"));
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                data.head = item.children[0].children[0].innerText;
                data.updateTime = `${new Date().getMonth() + 1}.${new Date().getDate()}`;
                data.link = item.children[0].children[0].href;
                lists.push(data);
            }
            return lists;
        }
    });

    if(!(data == false)){
        for (let item of data) {
            await page.goto(item.link, { waitUntil: "networkidle2" });
            const sourceLink = await page.evaluate(() => {
                const divs = Array.from(document.querySelectorAll("body script"));
                const tar = divs.findIndex(i => i.src==="https://cdn.jsdelivr.net/npm/clappr-chromecast-plugin@latest/dist/clappr-chromecast-plugin.min.js");
                return divs[tar + 1].innerText.trim().split('source:')[1].split('"')[1]
            })
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
