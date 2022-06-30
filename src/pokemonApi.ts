import { Pokemon } from "./components/pokemon";

const baseUrl = "https://pokeapi.co/api/v2/";

export async function fetchJson(url: string) {
	return await (await fetch(url)).json();
}

export async function getPokemonList(offset: number = 0, limit: number = 20) {
	const pokemonList = (
		await fetchJson(`${baseUrl}pokemon/?limit=${limit}&offset=${offset}`)
	).results;
	for (let i = 0; i < pokemonList.length; i++) {
		const name = pokemonList[i].name;
		const pokemonData = await fetchJson(pokemonList[i].url);
		const species = await fetchJson(pokemonData.species.url);
		const stats = pokemonData.stats;

		pokemonList[i] = new Pokemon(
			name,
			pokemonData.sprites.other.dream_world.front_default,
			species.flavor_text_entries.find(
				(element: any) => element.language.name === "en"
			).flavor_text,
			stats
		);
	}

	return pokemonList;
}
