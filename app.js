const path = require("path");
const express = require("express");
const app = express();
const schedule = require("node-schedule");
const fetchData = require("./crawlAllPages");

const rule = new schedule.RecurrenceRule();
rule.second = 0;
rule.minute = [25, 55];

let source = [
    { head: "Updating..." }
];

app.get("/live", (req, res) => {
    if (source[0].head === "Updating...") {
        res.send([{ head: "Updating..." }]).end();
    } else {
        res.send([...source[0], ...source[1]]).end();
    }
});
app.get("/live_1", (req, res) => {
    if(source[0].head === "Updating..."){
        res.send([{ head: "Updating..." }]).end();
    } else if(source[0] == false){
        res.send([{ head: "Updating..." }]).end();
    } else {
        res.send(source[0]).end();
    }
});
app.get("/live_2", (req, res) => {
    if (source[0].head === "Updating...") {
        res.send([{ head: "Updating..." }]).end();
    } else if(source[1] == false){
        res.send([{ head: "Updating..." }]).end();
    } else {
        res.send(source[1]).end();
    }
});
app.get("/live_3", (req, res) => {
    if (source[0].head === "Updating...") {
        res.send([{ head: "Updating..." }]).end();
    } else if(source[2] == false){
        res.send([{ head: "Updating..." }]).end();
    } else {
        res.send(source[2]).end();
    }
});

schedule.scheduleJob(rule, async () => {
    source = await fetchData();
});

app.get('/archive/:name', function (req, res, next) {
    const options = {
        root: path.join(__dirname, 'archive'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            "Content-Type": 'text/plain',
            'x-sent': true
        }
    }
    const fileName = req.params.name
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err)
        }
    })
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
