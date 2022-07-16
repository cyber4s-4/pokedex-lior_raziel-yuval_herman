const axios = require("axios").default;
const fs = require("fs");
const { inspect } = require("util");
const { MongoClient } = require("mongodb");
const { cluster, password, UID, username } = require("./src/superSecret.ts");
const { deflate } = require("node:zlib");
const { promisify } = require("node:util");
const deflate_promise = promisify(deflate);
const uri = `mongodb+srv://${username}:${password}@${cluster}.${UID}.mongodb.net/?retryWrites=true&w=majority`;

// fetch all pokemon data into pokemon object array and save as json file.
async function fetchJson(url) {
	return await (
		await axios.get(url)
	).data;
}

function saveToJSONFile(data) {
	fs.writeFileSync("server/data/pokemons.json", JSON.stringify(data));
}

function resolveImage(spritesObj) {
	return (
		spritesObj.other.dream_world.front_default ||
		spritesObj.other["official-artwork"].front_default ||
		spritesObj.front_default ||
		""
	).slice(72);
}

async function fetchPokemon(url) {
	try {
		const pokemonData = await fetchJson(url);
		const name = pokemonData.name;
		const species = await fetchJson(pokemonData.species.url);
		const stats = pokemonData.stats;
		console.log("fetched " + name + " num: " + pokemonData.id);
		return {
			name: name,
			image: resolveImage(pokemonData.sprites),
			description: species.flavor_text_entries.find(
				(element) => element.language.name === "en"
			).flavor_text,
			stats: stats.map((stat) => {
				return {
					base_stat: stat.base_stat,
					effort: stat.effort,
					name: stat.stat.name,
				};
			}),
			color: species.color.name,
			height: pokemonData.height,
			abilities: pokemonData.abilities.map((e) => e.ability.name),
			category: species.genera.find((e) => e.language.name === "en").genus,
			weight: pokemonData.weight,
		};
	} catch (error) {
		console.log("failed " + url + "\ncheck 'error.log' for more details");
		fs.writeFileSync("error.log", JSON.stringify(inspect(error)), {
			flag: "a",
		});
	}
}

async function main() {
	const client = new MongoClient(uri);
	console.log("connecting to database...");
	await client.connect();
	const pokedexDb = client.db("pokedex");
	const pokemonsCollection = pokedexDb.collection("pokemons");
	console.log("deleting pokemons");
	await pokemonsCollection.deleteMany({});
	const pokemonArray = [];
	async function fetchPokemonArr(serverResult) {
		const { results, next } = serverResult;
		console.log(next);
		const fetchPromises = [];
		for (let i = 0; i < results.length; i++) {
			try {
				fetchPromises.push(fetchPokemon(results[i].url));
			} catch {
				console.log;
			}
		}
		pokemonArray.push(...(await Promise.all(fetchPromises)));
		if (next) {
			fetchJson(next).then(fetchPokemonArr);
			return;
		}
		console.log("combining pokes...");
		const pokLength = pokemonArray.length;
		for (let i = 0; i < pokLength; i++) {
			for (let j = 0; j < pokLength; j++) {
				if (i === j) continue;
				pokemonArray.push(combinepoks(pokemonArray[i], pokemonArray[j]));
			}
		}
		console.log("compressing pokemons...");
		for (let i = 0; i < pokemonArray.length; i++) {
			pokemonArray[i] = await compressPokemon(pokemonArray[i]);
		}
		try {
			await pokemonsCollection.insertMany(pokemonArray);
		} catch (error) {
			console.log(
				"failed to upload databse to mongo\ncheck 'error.log' for more details"
			);
			fs.writeFileSync("error.log", JSON.stringify(inspect(error)), {
				flag: "a",
			});
			saveToJSONFile(pokemonArray);
		}
		client.close();
	}

	fetchJson("https://pokeapi.co/api/v2/pokemon/").then(fetchPokemonArr);
}

function combinepoks(pokemon1, pokemon2) {
	return {
		name: pokemon1.name,
		image: pokemon2.image,
		description: pokemon1.description,
		stats: pokemon2.stats,
		color: pokemon1.color,
		height: pokemon2.height,
		abilities: pokemon1.abilities,
		category: pokemon2.category,
		weight: pokemon1.weight,
	};
}

async function compressPokemon(pokemon) {
	return {
		name: pokemon.name,
		compressedData: (
			await deflate_promise(
				JSON.stringify({
					image: pokemon.image,
					description: pokemon.description,
					stats: pokemon.stats,
					color: pokemon.color,
					height: pokemon.height,
					abilities: pokemon.abilities,
					category: pokemon.category,
					weight: pokemon.weight,
				})
			)
		).toString("base64"),
	};
}

main();
