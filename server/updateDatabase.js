// fetch all pokemon data into pokemon object array and save as json file.
async function fetchJson(url) {
	return await (await fetch(url)).json();
}

function resolveImage(spritesObj) {
	return (
		spritesObj.other.dream_world.front_default ||
		spritesObj.other["official-artwork"].front_default ||
		spritesObj.front_default
	);
}

async function fetchPokemon(url) {
	// console.log(url);
	const pokemonData = await fetchJson(url);
	const name = pokemonData.name;
	const species = await fetchJson(pokemonData.species.url);
	const stats = pokemonData.stats;
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
}

function saveToJSONFile(data) {
	console.log(data); //JSON.stringify(data));
}

fetchJson("https://pokeapi.co/api/v2/pokemon/?limit=9999").then(
	({ results }) => {
		const fetchPromises = [];
		for (let i = 0; i < results.length; i++) {
			fetchPromises.push(fetchPokemon(results[i].url));
		}
		Promise.all(fetchPromises).then(saveToJSONFile);
	}
);
