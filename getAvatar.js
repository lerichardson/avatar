const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const images = {
    noUser: fs.readFileSync(`${__dirname}/images/noUser.png`),
    placeholder: fs.readFileSync(`${__dirname}/images/placeholder.png`)
};

module.exports = async (req, res) => {
    const {id} = req.params;

    // Get User
    let user;
    try {
        user = (await axios.get(
            `https://1api.alles.cx/v1/user?id=${encodeURIComponent(id)}`,
            {
                auth: {
                    username: process.env.ALLES_ID,
                    password: process.env.ALLES_SECRET
                }
            }
        )).data;
    } catch (err) {}

    // Get Image
    let image;
    if (!user) image = images.noUser;
    else if (!user.avatar) image = images.placeholder;
    else {
        try {
            image = (await axios.get(`https://fs.alles.cx/${user.avatar}`, {
                responseType: "arraybuffer"
            })).data;
        } catch (e) {
            image = images.placeholder;
        }
    }

    // Image Size
    const size =
        typeof req.query.size === "string" &&
        !isNaN(req.query.size) &&
        Number.isInteger(Number(req.query.size)) &&
        Number(req.query.size) > 0 &&
        Number(req.query.size) <= 500
            ? Number(req.query.size) : 200;
    
    // Manipulate Image
    image = await sharp(image)
        .resize(size)
        .png()
        .toBuffer();

    // Response
    res.type("image/png").send(image);
};