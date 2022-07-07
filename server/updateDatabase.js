const axios = require("axios").default;
const fs = require("fs");

// fetch all pokemon data into pokemon object array and save as json file.
async function fetchJson(url) {
	return await (
		await axios.get(url)
	).data;
}

function resolveImage(spritesObj) {
	return (
		spritesObj.other.dream_world.front_default ||
		spritesObj.other["official-artwork"].front_default ||
		spritesObj.front_default
	);
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
			stats: stats,
			color: species.color.name,
			height: pokemonData.height,
			abilities: pokemonData.abilities.map((e) => e.ability.name),
			category: species.genera.find((e) => e.language.name === "en").genus,
			weight: pokemonData.weight,
		};
	} catch (error) {
		console.log("failed " + url);
	}
}

function saveToJSONFile(data) {
	fs.writeFileSync("server/data/pokemons.json", JSON.stringify(data));
}

const pokemons = [];
const addToArray = (arr) => {
	pokemons.push(...arr);
};

fetchJson("https://pokeapi.co/api/v2/pokemon/").then(fetchPokemonArr);

function fetchPokemonArr(serverResult) {
	const { results, next } = serverResult;
	const fetchPromises = [];
	for (let i = 0; i < results.length; i++) {
		fetchPromises.push(fetchPokemon(results[i].url));
	}
	Promise.all(fetchPromises).then(addToArray);
	if (!next) saveToJSONFile(pokemons);
	fetchJson(next).then(fetchPokemonArr);
}
