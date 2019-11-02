require("dotenv").config({ path: "../.env" });
const puppeteer = require("puppeteer");

(async () => {
    const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    const page = await bowser.newPage();
    await page.goto("http://cyclingentertainment.stream/events/2019/", { waitUntil: "networkidle2" });
    await Promise.all([
        page.click("span[data-skin='weekly']"),
        page.waitFor(1500)
    ]);
    const data = await page.evaluate(() => {
        let lists = [];
        const temp = Array.from(document.querySelectorAll('li.mec-weekly-view-date-events'));
        const items = Array.from(temp.filter(i => i.className.indexOf("mec-util-hidden") == -1)[0].children)
        // 判断是否为空数组
        if(items == false){
            return items;
        } else {
            for (let item of items) {
                let data = {};
                if (item.childElementCount == 5) {
                    data.head = item.children[3].children[0].innerText;
                    data.updateTime = item.children[2].innerText.trim();
                    data.link = item.children[3].children[0].href;
                } else {
                    data.head = item.children[2].children[0].innerText;
                    data.updateTime = `${new Date().getMonth() + 1}.${new Date().getDate()}`;
                    data.link = item.children[2].children[0].href;
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
                        els.filter(script => script.textContent.trim().startsWith("var player = new Clappr.Player" || "var playerElement = "))[0].textContent
                            .trim()
                            .split("source:" || "source: '")[1]
                            .split('"')[1] || split("',")[0]
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

    console.log(data);
    // return data;
    await bowser.close();
})();
