const express = require("express");
const conectarDB = require("./database");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 4000;

conectarDB();
app.use(express.json());//body parser

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/waterresources", require("./routes/waterResources"));

app.listen(PORT, () => {
    console.log(`Listening http://localhost:${4000}`);
});
