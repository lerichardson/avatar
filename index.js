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
app.listen(8080, () => console.log("Listening on Express"));

// User by username
app.get("/u/:username", async (req, res) => {
    res.type("image/png").send(await getAvatar(
        req.params.username,
        true,
        req.query.size
    ));
});

// User by user id
app.get("/user/:userid", async (req, res) => {
    res.type("image/png").send(await getAvatar(
        req.params.userid,
        false,
        req.query.size
    ));
});

// Get Avatar
const getAvatar = async (userParam, username, size) => {
    // Get User
    const user = await getUser(userParam, username);

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

// Get User
const getUser = async (userParam, username) => {
    try {
        return (await axios.get(
            `https://1api.alles.cx/v1/user?${
                username ? "username" : "id"
            }=${encodeURIComponent(userParam)}`,
            {
                auth: {
                    username: process.env.ALLES_ID,
                    password: process.env.ALLES_SECRET
                }
            }
        )).data;
    } catch (err) {
        return null;
    }
};

// 404
app.use((req, res) => {
    res.status(404).json({err: "notFound"});
});