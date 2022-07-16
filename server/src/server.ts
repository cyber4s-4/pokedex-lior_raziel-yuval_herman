import express from "express";
import { Request, Response } from "express";
import { json } from "body-parser";
import cors from "cors";
import path from "path";
import { inflate } from "node:zlib";
const { promisify } = require("node:util");
const inflate_promise = promisify(inflate);
import { Collection, Db, Document, MongoClient } from "mongodb";
let cluster: string, password: string, UID: string, username: string;
try {
	({ cluster, password, UID, username } = require("./superSecret"));
} catch {
	username = "testuser";
	password = encodeURI("+24813462481346");
	cluster = "cluster0";
	UID = "ddxnye8";
}

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

async function decompressPokemons(pokemons: any) {
	const decompressedPokemons = [];
	for (const pokemon of pokemons) {
		const uncompressedData = JSON.parse(
			(
				await inflate_promise(Buffer.from(pokemon.compressedData, "base64"))
			).toString()
		);

		decompressedPokemons.push({
			_id: pokemon._id,
			name: pokemon.name,
			image: uncompressedData.image,
			description: uncompressedData.description,
			stats: uncompressedData.stats,
			color: uncompressedData.color,
			height: uncompressedData.height,
			abilities: uncompressedData.abilities,
			category: uncompressedData.category,
			weight: uncompressedData.weight,
		});
	}
	return decompressedPokemons;
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
				decompressPokemons(pokemonArr).then((pokemons) =>
					res.status(200).json(pokemons)
				);
			});
	}
});

app.get("/search/:pokemonName", (req: Request, res: Response) => {
	console.log(req.params.pokemonName);

	pokemonsCollection
		.find({ name: RegExp(req.params.pokemonName) })
		.limit(50)
		.toArray()
		.then((pokemonArr) => {
			decompressPokemons(pokemonArr).then((pokemons) =>
				res.status(200).json(pokemons)
			);
		});
});

let pokemonsNames: Document[] = [];
let ongoingNameRequest: Promise<Document[]>;
async function getPokemonNames() {
	if (pokemonsNames.length) return pokemonsNames;
	if (ongoingNameRequest) return ongoingNameRequest;
	ongoingNameRequest = pokemonsCollection
		.find()
		.project({ name: 1 })
		.toArray();
	pokemonsNames = await ongoingNameRequest;
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
