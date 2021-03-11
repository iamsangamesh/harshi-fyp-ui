const express = require('express');
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use("/public", express.static("./public"));
app.use("/Avatar", express.static("./Avatar"));

app.get("/", (req, res) => {
    res.render("index")
})

app.listen(9000, () => {
    console.log("running on 9000 port")
})