require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
    // const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_3, { waitUntil: "networkidle2" });
    const data = await page.evaluate(() => {
        let lists = [];
        const items = Array.from(document.querySelectorAll("a.w-full.rounded"));
        if(items == false){
            return items;
        } else {
            for(let item of items){
                let data = {};
                data.head = item.children[0].children[1].children[0].innerText;
                data.updateTime = item.children[0].children[1].children[1].innerText;
                data.link = item.getAttribute("href");
                lists.push(data);
            }
        }
        
        return lists;
    });

    if(!(data == false)){
    	for (let item of data) {
	        await page.goto(item.link, { waitUntil: "networkidle2" });
            // await page.frames();
	        let sourceLink = "";
            try {
                sourceLink = await page.$$eval("body script", el => {
                    const tar = el.filter(script => script.textContent.trim().startsWith("window.onload = function"));
                    if (tar == false) {
                        return false;
                    } else {
                        return tar[0].textContent.split(",")[0].split("'")[1];
                    }
                });
            } catch (err) {
                console.error("something wrong...");
                item.head = "(Wrong) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
                continue;
            }
            
            if(sourceLink != ""){
                item.link = sourceLink;
            } else {
                item.head = "(No Signal) "  + item.head;
                item.link = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
            }
	    }
    }
    // console.log(data);
    return data;
    // await bowser.close();
};