const Avatar = require("./db");
const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");
const placeholder = fs.readFileSync(`${__dirname}/images/placeholder.png`);

module.exports = async (req, res) => {
    // Get most recent avatar for user
    const avatar = (
        await Avatar.findAll({
            where: {
                user: req.params.id
            },
            order: [["createdAt", "DESC"]],
            limit: 1
        })
    )[0];

    // Get Image
    let image;
    if (avatar) {
        try {
            image = (
                await axios.get(`https://fs.alles.cx/${avatar.source}`, {
                    responseType: "arraybuffer"
                })
            ).data;
        } catch (e) {
            image = placeholder;
        }
    } else image = placeholder;

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