import express from "express";
import ejs from "ejs";
import { instagramController } from "./instagram.controller";

const app = express();

app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);

app.get("/:username", instagramController);

app.listen(3000, () => console.log(`running on 3000`));
