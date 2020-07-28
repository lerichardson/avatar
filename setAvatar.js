const Avatar = require("./db");
const uuid = require("uuid").v4;

module.exports = async (req, res) => {
    if (typeof req.body.source !== "string") return res.status(400).json({err: "badRequest"});
    if (req.headers.authorization !== process.env.SECRET) return res.status(401).json({err: "badAuthorization"});

    res.json(await Avatar.create({
        id: uuid(),
        user: req.params.id,
        source: req.body.source
    }));
};