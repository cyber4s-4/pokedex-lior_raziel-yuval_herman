import express from "express";
import { Request, Response } from "express";
import { json } from "body-parser";
import cors from "cors";
import path from "path";
import { inflate } from "node:zlib";
const { promisify } = require("node:util");
const inflate_promise = promisify(inflate);
import { Client, QueryResult } from "pg";

const client = new Client({
	connectionString:
		"postgres://hztyuidzruugcd:20cf48c8362d7f6978d05b28e1c98d78dea7f719f00656acbce56e0de4ca68a2@ec2-34-235-198-25.compute-1.amazonaws.com:5432/dbkv62fjl5db8d",
	ssl: {
		rejectUnauthorized: false,
	},
});

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
				await inflate_promise(Buffer.from(pokemon.compresseddata, "base64"))
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
		getPokemonNames().then(({ rows }) => {
			res.status(200).json(rows);
		});
	} else {
		client
			.query("SELECT * FROM pokemon LIMIT $1 OFFSET $2;", [
				req.query.limit,
				req.query.offset,
			])
			.then(({ rows }) => {
				decompressPokemons(rows).then((pokemons) =>
					res.status(200).json(pokemons)
				);
			});
	}
});

app.get("/search/:pokemonName", (req: Request, res: Response) => {
	console.log(req.params.pokemonName);

	client
		.query("SELECT * FROM pokemon LIMIT 50 where name LIKE $1%", [
			req.params.pokemonName,
		])
		.then(({ rows }) => {
			decompressPokemons(rows).then((pokemons) =>
				res.status(200).json(pokemons)
			);
		});
});

let pokemonsNames: QueryResult;
let ongoingNameRequest: Promise<QueryResult>;
async function getPokemonNames() {
	if (pokemonsNames && pokemonsNames.rows.length) return pokemonsNames;
	if (ongoingNameRequest) return ongoingNameRequest;
	ongoingNameRequest = client.query("SELECT name FROM pokemon");
	pokemonsNames = await ongoingNameRequest;
	Object.freeze(pokemonsNames);
	return pokemonsNames;
}

async function startServer() {
	await client.connect();
	getPokemonNames().then(() => console.log("all names downloaded"));
	app.listen(process.env.PORT || 3000);
	console.log("listening on " + (process.env.PORT || 3000));
}
