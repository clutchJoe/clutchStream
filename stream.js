const puppeteer = require("puppeteer");

(async () => {
	// const url = "http://mssev.com/live/2019/";
	const bowser = await puppeteer.launch({ headless: false }); // { headless: false }
    const page = await bowser.newPage();
    await page.goto("http://givemereddit.stream/nba", { waitUntil: "networkidle2" });
    const data = await page.evaluate(() => {
    	let lists = [];
        const items = Array.from(document.querySelectorAll("a.w-full.rounded"));
        for(let item of items){
            let data = {};
            data.head = item.children[0].children[1].children[0].innerText;
            data.updateTime = item.children[0].children[1].children[1].innerText;
            data.link = item.getAttribute("href");
            lists.push(data);
        }
        return lists;
    });
    for(let item of data){
    	await page.goto(item.link, { waitUntil: "networkidle2" });
    	const sourceLink = await page.evaluate(() => {
    		const scripts = Array.from(document.querySelectorAll("body script")).reverse();
    		const tar = scripts.filter(script => script.textContent.trim().startsWith("window.onload = function"));
    		const source = tar[0].textContent.split(",")[0].split("'")[1];
    		// const source = script[1].textContent.split(",")[0].split("'")[1];
    		return source;
    	});
    	item.link = sourceLink;
    };
    console.log(data);
    await bowser.close();
})();