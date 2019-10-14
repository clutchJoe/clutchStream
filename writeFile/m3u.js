const fs = require("fs");

module.exports = (data, name) => {
    let m3u = "#EXTM3U\n\n";
    const tip = `#EXTINF:-1, Latest update (${new Date().getMonth() + 1}.${new Date().getDate()}/${new Date().getHours()}:${new Date().getMinutes()})\nhttps://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8\n\n`
    m3u += tip;
    data.map(item => m3u += `#EXTINF:-1, ${item.head}  ${item.updateTime}\n${item.link}\n\n`);

    fs.writeFile(`./archive/${name}`, m3u, err => {
        if (err) throw err;
        console.log(`${name} file created and data written...`);
    });
}