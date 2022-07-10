import { Pokemon } from "./components/pokemon";

const baseUrl = `http://${process.env.HEROKU_APP_NAME}/pokemons`;
const pokemonComponents: Pokemon[] = [];

export async function fetchJson(url: string) {
	return await (await fetch(url)).json();
}

export async function getPokemonComponents(
	offset: number = 0,
	limit: number = Infinity
) {
	if (pokemonComponents.length)
		return pokemonComponents.slice(offset, limit + offset);

	const pokemonObjects = (await fetchJson(baseUrl)) as object[];

	for (const pokemon of pokemonObjects) {
		pokemonComponents.push(new Pokemon(pokemon));
	}
	return pokemonComponents.slice(offset, limit + offset);
}
