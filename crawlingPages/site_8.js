require("dotenv").config({ path: "../.env" });
// const puppeteer = require("puppeteer");

module.exports = async (page) => {
	// const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    // const page = await bowser.newPage();
    await page.goto(process.env.SITE_8, { waitUntil: "networkidle2" });

    const data = await page.evaluate(() => {
    	let lists = [];
    	const items = Array.from(document.querySelectorAll(".entry-header-wrapper"));
    	if(items == false){
            return items;
        } else {
        	for(let item of items){
        		let data = {};
                data.head = item.children[1].children[0].children[0].textContent;
                data.updateTime = item.children[0].children[1].children[1].children[0].textContent;
                data.link = item.children[1].children[0].children[0].href;
                lists.push(data);
        	}
        	return lists;
        }
    });

    if(!(data == false)) {
    	for (let item of data) {
    		let sourceLink = "";
            try {
                await page.goto(item.link, { waitUntil: "networkidle2" });
                sourceLink = await page.$$eval(
                    "body script",
                    els =>
                        els.find(i => i.innerText.trim().startsWith("var player")).innerText
                            .split("url_play = '")[1]
                            .split("';")[0]
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