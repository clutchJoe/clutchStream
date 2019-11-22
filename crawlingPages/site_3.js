require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_3, { waitUntil: "networkidle2" });
    const data = await page.evaluate(() => {
        // const tar = Array.from(document.querySelectorAll("div.mec-has-event")).reverse()[0];
        // tar.click();
        // const id = Array.from(document.querySelectorAll("div.mec-has-event")).reverse()[0].id.split('day')[1];
        function getLocalTime(i) {
            //参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
            if (typeof i !== 'number') return;
            const d = new Date();
            //得到1970年一月一日到现在的秒数
            const len = d.getTime();
            //本地时间与GMT时间的时间偏移差
            const offset = d.getTimezoneOffset() * 60000;
            //得到现在的格林尼治时间
            const utcTime = len + offset;
            return new Date(utcTime + 3600000 * i);
        }
        const day = getLocalTime(8).getDate();
        const all = Array.from(document.querySelectorAll("div.mec-daily-view-day"));
        const id = all.find(i => i.innerText.trim() == day).id.split('day')[1];
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
            let sourceLink = "";
            try {
                await page.goto(item.link);
                await page.waitForSelector('div#player');
                sourceLink = await page.$$eval(
                    "body script",
                    els => {
                        const start = els.filter(script => script.textContent.trim().startsWith("var player = new Clappr.Player"));
                        if (start != false) {
                            return start[0].textContent
                                .trim()
                                .split("source:")[1]
                                .split('"')[1]
                        } else {
                            return els.filter(script => script.textContent.trim().startsWith("var playerElement = "))[0].textContent
                                .trim()
                                .split("source: '")[1]
                                .split("',")[0]
                        }
                });
            } catch (err) {
                console.error("site_3: something wrong on sourceLink...");
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
