require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_2, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
        // const tar = Array.from(document.querySelectorAll("div.mec-has-event")).reverse()[0];
        // tar.click();
        const id = Array.from(document.querySelectorAll("div.mec-has-event"))[0].id.split('day')[1];
        let lists = [];
        const items = Array.from(document.querySelector(`#mec_daily_view_date_events${id}`).children);
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                if (item.childElementCount == 3) {
                    data.head = item.children[2].children[0].innerText;
                    data.updateTime = item.children[1].innerText.trim();
                    data.link = item.children[2].children[0].href;
                } else {
                    data.head = item.children[1].children[0].innerText;
                    data.updateTime = `${new Date().getMonth() + 1}.${new Date().getDate()}`;
                    data.link = item.children[1].children[0].href;
                }
                lists.push(data);
            }
            return lists;
        }
    });

    if(!(data == false)){
        for (let item of data) {
            await page.goto(item.link, { waitUntil: "networkidle2" });
            
            let sourceLink = "";
            try {
                sourceLink = await page.$$eval(
                    "body script",
                    els =>
                        els.filter(script => script.textContent.trim().startsWith("var playerElement = "))[0].textContent
                            .trim()
                            .split("source: '")[1]
                            .split("',")[0]
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
