import express from "express";
import { Request, Response } from "express";
import { json } from "body-parser";
const { cluster, password, UID, username } = require("superSecret.ts");
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import cors from "cors";

const uri = `mongodb+srv://${username}:${password}@${cluster}.${UID}.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
client.connect();

const app = express();
app.use(json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../../client/dist")));

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

app.listen(app.listen(process.env.PORT || 3000));
console.log("listening on " + process.env.PORT || 3000);
