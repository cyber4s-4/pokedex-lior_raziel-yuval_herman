import { Pokemon } from "./components/pokemon";

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
	)) as object[];
	return convert2Component(pokemonObjects);
}

export async function searchPokemonComponents(query: string) {
	const pokemonObjects = (await fetchJson(
		baseUrl + `search/${query}`
	)) as object[];

	return convert2Component(pokemonObjects);
}

function convert2Component(pokemonObjects: object[]) {
	const pokemonComponents = [];
	for (const pokemon of pokemonObjects) {
		pokemonComponents.push(new Pokemon(pokemon));
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
