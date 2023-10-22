const express = require("express");
const conectarDB = require("./database");
const cors = require("cors");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 4000;

conectarDB();
app.use(express.json());//body parser
app.use(cors())

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/waterresources", require("./routes/waterResources"));
app.use("/api/waterresources2", require("./routes/waterResources2"));

app.listen(PORT, () => {
    console.log(`Listening http://localhost:${4000}`);
});
