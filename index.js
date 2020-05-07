const fs = require("fs");
const axios = require("axios");
const images = {
    noUser: fs.readFileSync(`${__dirname}/images/noUser.png`),
    placeholder: fs.readFileSync(`${__dirname}/images/placeholder.png`)
};

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
    res.type("image/png").send(await getAvatar(user));
});

//User by user id
app.get("/user/:userid", async (req, res) => {
    const user = await db.User.findOne({where: {id: req.params.userid}});
    res.type("image/png").send(await getAvatar(user));
});

// Get Avatar
const getAvatar = async user => {
    if (!user) return images.noUser;
    if (!user.avatar) return images.placeholder;
    try {
        return (await axios.get(`https://fs.alles.cx/${user.avatar}`, {
            responseType: "arraybuffer"
        })).data;
    } catch (e) {
        return images.placeholder;
    }
};

//404
app.use((req, res) => {
    res.status(404).json({err: "invalidRoute"});
});