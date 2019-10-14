const fs = require("fs");

module.exports = (data, name) => {
    const json = { uuid: "64350b50-a810-4901-b86b-7a5106bdef2c", title: "clutch Stream" };
    const fomatData = [];
    data.map(item => {
        const tar = {};
        tar.name = `${item.head}  (${item.updateTime})`;
        tar.url = item.link;
        fomatData.push(tar);
    });
    const tip = {
        name: `Latest update (${new Date().getMonth() + 1}.${new Date().getDate()}/${new Date().getHours()}:${new Date().getMinutes()})`,
        url: `https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8`
    }
    fomatData.unshift(tip);
    json.channels = fomatData;
    fs.writeFile(`./archive/${name}`, JSON.stringify(json, null, "  "), err => {
        if (err) throw err;
        console.log(`${name} file created and data written...`);
    });
}