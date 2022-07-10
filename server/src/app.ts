import express from "express";
import { Request, Response } from "express";
import { json } from "body-parser";
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../../client/dist/")));

interface User {
	name: string;
	about: string;
	avatar: string;
	id: string;
}

const filePath: string = path.join(__dirname, "../data/pokemons.json");
const pokemons: User[] = JSON.parse(fs.readFileSync(filePath, "utf8"));

app.get("/pokemons", (req: Request, res: Response) => {
	res.status(200).send(pokemons);
});

app.get("/", (req: Request, res: Response) => {
	console.log("hi");

	res.status(200).sendFile(
		path.join(__dirname, "../../client/dist/index.html")
	);
});

app.listen(3000);
console.log("listening on 3000");
