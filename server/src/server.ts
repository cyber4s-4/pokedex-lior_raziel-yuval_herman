import express from "express";
import { Request, Response } from "express";
import { json } from "body-parser";
import { Collection, Db, MongoClient } from "mongodb";
import path from "path";
import cors from "cors";
const { cluster, password, UID, username } = require("./superSecret.ts");

let pokedexDb: Db;
let pokemonsCollection: Collection;

startServer();
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

app.get("/pokemons", (req: Request, res: Response) => {
	pokemonsCollection
		.find()
		.toArray()
		.then((pokemonArr) => {
			res.status(200).send(JSON.stringify(pokemonArr));
		});
});

async function startServer() {
	const uri = `mongodb+srv://${username}:${password}@${cluster}.${UID}.mongodb.net/?retryWrites=true&w=majority`;
	const client = new MongoClient(uri);
	await client.connect();
	pokedexDb = client.db("pokedex");
	pokemonsCollection = pokedexDb.collection("pokemons");
	Object.freeze(pokedexDb);
	Object.freeze(pokemonsCollection);
	app.listen(app.listen(process.env.PORT || 3000));
	console.log("listening on " + process.env.PORT || 3000);
}
