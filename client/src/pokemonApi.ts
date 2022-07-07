import { Pokemon } from "./components/pokemon";

const baseUrl = "https://localhost:3000/";

export async function fetchJson(url: string) {
	return await (await fetch(url)).json();
}

export async function getPokemonComponents() {
	const pokemonObjects = await fetchJson(baseUrl);
	const pokemonComponents: Pokemon[] = [];
	for (const pokemon of pokemonObjects) {
		pokemonComponents.push(new Pokemon(pokemon));
	}
	return pokemonComponents;
}
