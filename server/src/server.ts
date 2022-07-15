import express from "express";
import { Request, Response } from "express";
import { json } from "body-parser";
import { Collection, Db, Document, MongoClient } from "mongodb";
import path from "path";
import cors from "cors";
const { cluster, password, UID, username } = require("./superSecret");

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
	if (!("limit" in req.query) && !("offset" in req.query)) {
		getPokemonNames().then((pokemonArr) => {
			res.status(200).json(pokemonArr);
		});
	} else {
		pokemonsCollection
			.find()
			.skip(Number(req.query.offset))
			.limit(Number(req.query.limit))
			.toArray()
			.then((pokemonArr) => {
				res.status(200).json(pokemonArr);
			});
	}
});

let pokemonsNames: Document[] = [];
async function getPokemonNames() {
	if (pokemonsNames.length) {
		return pokemonsNames;
	}
	pokemonsNames = await pokemonsCollection
		.find()
		.project({ name: 1 })
		.toArray();
	Object.freeze(pokemonsNames);
	return pokemonsNames;
}

async function startServer() {
	const uri = `mongodb+srv://${username}:${password}@${cluster}.${UID}.mongodb.net/?retryWrites=true&w=majority`;
	const client = new MongoClient(uri);
	await client.connect();
	pokedexDb = client.db("pokedex");
	pokemonsCollection = pokedexDb.collection("pokemons");
	Object.freeze(pokedexDb);
	Object.freeze(pokemonsCollection);
	getPokemonNames().then(() => console.log("all names downloaded"));
	app.listen(process.env.PORT || 3000);
	console.log("listening on " + (process.env.PORT || 3000));
}
