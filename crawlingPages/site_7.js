require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    const temp = [];
    for (i = 0; i < 3; i++) {
        await page.goto(`${process.env.SITE_7}page/${i + 1}/`, { waitUntil: "networkidle2" });
        const list = await page.evaluate(() => {
            let lists = [];
            const items = Array.from(document.querySelectorAll("div.post-content"));
            // 判断是否为空数组
            if(items == false){
                return items;
            } else {
                for (let item of items) {
                    let data = {};
                    data.head = item.children[1].children[0].innerText.trim();
                    data.updateTime = item.children[2].innerText.trim();
                    data.link = item.children[1].children[0].href;
                    lists.push(data);
                }
                return lists;
            }
        });
        temp.push(...list);
    }
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
    const day = getLocalTime(-8).getDate();
    let data = temp.filter(i => i.updateTime.split(" ")[1].split(",")[0] == day);
    if (data == false) data = temp.filter(i => i.updateTime.split(" ")[1].split(",")[0] == day-1);

    if(!(data == false)){
        for (let item of data) {
            let sourceLink = "";
            try {
                await page.goto(item.link, { waitUntil: "networkidle2" });
                sourceLink = await page.$$eval(
                    "body script",
                    els =>
                        els.find(i => i.innerText.indexOf('player = new Clappr.Player') != -1).innerText
                            .split("source:")[1]
                            .split('"')[1]
                );
            } catch (err) {
                console.error("site_7: something wrong on sourceLink...");
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
