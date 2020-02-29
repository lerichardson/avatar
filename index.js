const fs = require("fs");

//Express
const express = require("express");
const app = express();
app.use(require("cors")());

//Database
const db = require("./util/db");
db.sync().then(() => {
    //Express Listen
    app.listen(8004, () => {
        console.log("Listening on Express");
    });
});

//User by username
app.get("/u/:username", async (req, res) => {
    const user = await db.User.findOne({where: {username: req.params.username}});
    if (!user) return res.sendFile(`${__dirname}/images/noUser.png`);
    if (!fs.existsSync(`${__dirname}/data/users/${user.id}`)) return res.sendFile(`${__dirname}/images/placeholder.png`);
    res.type("image/png").sendFile(`${__dirname}/data/users/${user.id}`);
});

//User by user id
app.get("/user/:userid", async (req, res) => {
    const user = await db.User.findOne({where: {id: req.params.userid}});
    if (!user) return res.sendFile(`${__dirname}/images/noUser.png`);
    if (!fs.existsSync(`${__dirname}/data/users/${user.id}`)) return res.sendFile(`${__dirname}/images/placeholder.png`);
    res.type("image/png").sendFile(`${__dirname}/data/users/${user.id}`);
});

//404
app.use((req, res) => {
    res.status(404).json({err: "invalidRoute"});
});