require("dotenv").config();
const puppeteer = require("puppeteer");
const site_1 = require("./crawlingPages/site_1");
const site_2 = require("./crawlingPages/site_2");
const site_3 = require("./crawlingPages/site_3");
const site_4 = require("./crawlingPages/site_4");
const site_5 = require("./crawlingPages/site_5");
const site_6 = require("./crawlingPages/site_6");
const site_7 = require("./crawlingPages/site_7");
const site_8 = require("./crawlingPages/site_8");
const site_9 = require("./crawlingPages/site_9");

(async () => {
    const data = [];
    const bowser = await puppeteer.launch({ headless: false }); // { headless: false },{ args: ['--no-sandbox'] }
    const page_1 = await bowser.newPage();
    const page_2 = await bowser.newPage();
    const page_3 = await bowser.newPage();

    const p1 = new Promise((resolve, reject) => {
		const data = site_1(page_1)
		resolve(data);
	})
	.then(res => data[0] = res)
	.then(res => console.log("site_1 crawling finished..."))
	.catch(err => {
		data[0] = []; 
		console.error(`Site_1 crawling has some error...`)
	});

    const p2 = new Promise((resolve, reject) => {
		const data = site_2(page_2)
		resolve(data);
	})
	.then(res => data[1] = res)
	.then(res => console.log("site_2 crawling finished..."))
	.catch(err => {
		data[1] = []; 
		console.error(`Site_2 crawling has some error...`)
	});

	const p3 = new Promise((resolve, reject) => {
		const data = site_3(page_3)
		resolve(data);
	})
	.then(res => data[2] = res)
	.then(res => console.log("site_3 crawling finished..."))
	.catch(err => {
		data[2] = []; 
		console.error(`Site_3 crawling has some error...`)
	});

	await Promise.all([p1, p2, p3]);

	const p4 = new Promise((resolve, reject) => {
		const data = site_4(page_1)
		resolve(data);
	})
	.then(res => data[3] = res)
	.then(res => console.log("site_4 crawling finished..."))
	.catch(err => {
		data[3] = []; 
		console.error(`Site_4 crawling has some error...`)
	});

	const p5 = new Promise((resolve, reject) => {
		const data = site_5(page_2)
		resolve(data);
	})
	.then(res => data[4] = res)
	.then(res => console.log("site_5 crawling finished..."))
	.catch(err => {
		data[4] = []; 
		console.error(`Site_5 crawling has some error...`)
	});

	const p6 = new Promise((resolve, reject) => {
		const data = site_6(page_3)
		resolve(data);
	})
	.then(res => data[5] = res)
	.then(res => console.log("site_6 crawling finished..."))
	.catch(err => {
		data[5] = []; 
		console.error(`Site_6 crawling has some error...`)
	});

	await Promise.all([p4, p5, p6]);

	const p7 = new Promise((resolve, reject) => {
		const data = site_7(page_1)
		resolve(data);
	})
	.then(res => data[6] = res)
	.then(res => console.log("site_7 crawling finished..."))
	.catch(err => {
		data[6] = []; 
		console.error(`Site_7 crawling has some error...`)
	});

	const p8 = new Promise((resolve, reject) => {
		const data = site_8(page_2)
		resolve(data);
	})
	.then(res => data[7] = res)
	.then(res => console.log("site_8 crawling finished..."))
	.catch(err => {
		data[7] = []; 
		console.error(`Site_8 crawling has some error...`)
	});

	const p9 = new Promise((resolve, reject) => {
		const data = site_9(page_3)
		resolve(data);
	})
	.then(res => data[8] = res)
	.then(res => console.log("site_9 crawling finished..."))
	.catch(err => {
		data[8] = []; 
		console.error(`Site_9 crawling has some error...`)
	});

	await Promise.all([p7, p8, p9]);

	try {
		await bowser.close();
	    console.log(data);
	    console.log(new Date());
	} catch (err) {
		console.error("Something wrong...");
	}

	// Promise.all([p1, p2])
	// .then(res => console.log(data))
	// .then(res => bowser.close())
	// .then(res => console.log(new Date()))
	// .catch(err => console.error("error..."))

    // await bowser.close();
    // console.log(data);
    // console.log(new Date());
})();