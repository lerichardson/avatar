const fs = require("fs");
const axios = require("axios");
const sharp = require("sharp");
const images = {
    noUser: fs.readFileSync(`${__dirname}/images/noUser.png`),
    placeholder: fs.readFileSync(`${__dirname}/images/placeholder.png`)
};

// Express
const express = require("express");
const app = express();
app.use(require("cors")());

// Database
const db = require("./util/db");
db.sync().then(() => {
    //Express Listen
    app.listen(8004, () => {
        console.log("Listening on Express");
    });
});

// User by username
app.get("/u/:username", async (req, res) => {
    res.type("image/png").send(await getAvatar(
        {username: req.params.username},
        req.query.size
    ));
});

// User by user id
app.get("/user/:userid", async (req, res) => {
    res.type("image/png").send(await getAvatar(
        {id: req.params.userid},
        req.query.size
    ));
});

// Get Avatar
const getAvatar = async (userQuery, size) => {
    // Get User
    const user = await db.User.findOne({
        where: userQuery
    });

    // Image Size
    size =
        typeof size === "string" &&
        !isNaN(size) &&
        Number.isInteger(Number(size)) &&
        Number(size) > 0 &&
        Number(size) <= 500
            ? Number(size) : 200;

    // Get, Manipulate and Return
    return await sharp(await getAvatarImage(user))
        .resize(size)
        .png()
        .toBuffer();
};

// Get Avatar Image
const getAvatarImage = async user => {
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

// 404
app.use((req, res) => {
    res.status(404).json({err: "invalidRoute"});
});