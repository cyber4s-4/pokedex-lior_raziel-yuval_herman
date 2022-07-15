import { Pokemon } from "./components/pokemon";

const baseUrl =
	(window.location.port === "4000" ? "http://localhost:3000/" : "/") +
	"pokemons";

let pokemonsNames: string[] = [];

export async function fetchJson(url: string) {
	return await (await fetch(url)).json();
}

export async function getPokemonComponents(
	offset: number = 0,
	limit: number = Infinity
) {
	const pokemonObjects = (await fetchJson(
		baseUrl + `?limit=${limit}&offset=${offset}`
	)) as object[];
	const pokemonComponents = [];
	for (const pokemon of pokemonObjects) {
		pokemonComponents.push(new Pokemon(pokemon));
	}
	return pokemonComponents.slice(offset, limit + offset);
}

export async function getPokemonNames() {
	if (!pokemonsNames.length) {
		pokemonsNames = (await fetchJson(baseUrl)).map(
			(doc: { _id: string; name: string }) => doc.name
		);
	}
	return pokemonsNames;
}
