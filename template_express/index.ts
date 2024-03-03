import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const app : Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 3000);

app.use("/", (req, res) => {
    res.status(200);
    res.json({
        message: "Hello World"
    });
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});