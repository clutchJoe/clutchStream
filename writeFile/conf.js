const fs = require("fs");

module.exports = (data) => {
	let text = "";
	for(let i = 0; i < data.length; i++){
		let group = `[Group]\ngroupName=SITE_${i + 1}\n`
		group += `Latest update (${new Date().getMonth() + 1}.${new Date().getDate()}/${new Date().getHours()}:${new Date().getMinutes()}),https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8\n`
		if(data[i] == false){
			group += `No Signal,https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8\n`;
			text += group;
		}else{
			data[i].map(item => group += `${item.head}  (${item.updateTime}),${item.link}\n`);
			text += group;
		}
	}
	fs.writeFile(`./archive/all.conf`, text, err => {
        if (err) throw err;
        console.log(`all.conf file created and data written...`);
    });
}