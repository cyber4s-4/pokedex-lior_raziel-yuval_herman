import { Pokemon } from "./components/pokemon";

interface pokemonObject {
	_id: string;
	name: string;
	image: string;
	description: string;
	stats: {
		base_stat: number;
		effort: number;
		name: string;
	}[];
	color: string;
	height: number;
	abilities: string[];
	category: string;
	weight: number;
}

const baseUrl =
	window.location.port === "4000" ? "http://localhost:3000/" : "/";

let pokemonsNames: string[] = [];

export async function fetchJson(url: string) {
	return await (await fetch(url)).json();
}

export async function getPokemonComponents(
	offset: number = 0,
	limit: number = Infinity
) {
	const pokemonObjects = (await fetchJson(
		baseUrl + `pokemons?limit=${limit}&offset=${offset}`
	)) as pokemonObject[];
	return convert2Component(pokemonObjects);
}

export async function searchPokemonComponents(query: string) {
	const pokemonObjects = (await fetchJson(
		baseUrl + `search/${query}`
	)) as pokemonObject[];

	return convert2Component(pokemonObjects);
}

function convert2Component(pokemonObjects: pokemonObject[]) {
	const pokemonComponents = [];
	for (const pokemon of pokemonObjects) {
		pokemon.image =
			"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon" +
			pokemon.image;
		pokemonComponents.push(new Pokemon(pokemon, pokemon._id));
	}

	return pokemonComponents;
}

export async function getPokemonNames() {
	if (!pokemonsNames.length) {
		pokemonsNames = (await fetchJson(baseUrl + "pokemons")).map(
			(doc: { _id: string; name: string }) => doc.name
		);
	}
	return pokemonsNames;
}
