import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);

app.use("/", (req, res) => {
    res.render("index", {
        title: "Hello World",
        message: "Hello World"
    })
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});