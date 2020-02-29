const fs = require("fs");

//Express
const express = require("express");
const app = express();
app.use(require("cors")());
app.listen(8004, () => {
    console.log("Listening on Express");
});

//MongoDB
const db = require("./util/mongo");
var connected = false;
db.connect((err) => {
    if (err) throw err;
    connected = true;
    console.log("Connected to MongoDB");
});

app.use((req, res, next) => {
    if (connected) return next();
    res.status(502).json({err: "notReady"});
});





//User by username
app.get("/u/:username", async (req, res) => {
    const user = await db("accounts").findOne({username: req.params.username});
    if (!user) return res.sendFile(`${__dirname}/images/noUser.png`);
    if (!fs.existsSync(`${__dirname}/data/users/${user._id}`)) return res.type("image/png").sendFile(`${__dirname}/images/placeholder.png`);
    res.sendFile(`${__dirname}/data/users/${user._id}`);
});

//User by user id
app.get("/user/:userid", async (req, res) => {
    const user = await db("accounts").findOne({_id: req.params.userid});
    if (!user) return res.sendFile(`${__dirname}/images/noUser.png`);
    if (!fs.existsSync(`${__dirname}/data/users/${user._id}`)) return res.type("image/png").sendFile(`${__dirname}/images/placeholder.png`);
    res.sendFile(`${__dirname}/data/users/${user._id}`);
});






//404
app.use((req, res) => {
    res.status(404).json({err: "invalidRoute"});
});