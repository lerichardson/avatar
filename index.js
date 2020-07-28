// Express
const express = require("express");
const app = express();
app.use(require("cors")());
app.listen(8080, () => console.log("Listening on Express"));

// Get Avatar
app.get("/:id", require("./getAvatar"));

// 404
app.use((_req, res) => res.status(404).json({err: "notFound"}));