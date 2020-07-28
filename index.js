// Express
const express = require("express");
const app = express();
app.use(require("cors")());
app.use(require("body-parser").json());
app.use((_err, _req, res, _next) => res.status(500).json({err: "internalError"}));
app.listen(8080, () => console.log("Listening on Express"));

// Get Avatar
app.get("/:id", require("./getAvatar"));

// Set Avatar
app.post("/:id", require("./setAvatar"));

// 404
app.use((_req, res) => res.status(404).json({err: "notFound"}));