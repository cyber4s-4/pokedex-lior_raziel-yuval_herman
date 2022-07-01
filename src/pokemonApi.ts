import { Pokemon } from "./components/pokemon";

const baseUrl = "https://pokeapi.co/api/v2/";

export async function fetchJson(url: string) {
	return await (await fetch(url)).json();
}

export async function getPokemonNameList(
	offset: number = 0,
	limit: number = 20
) {
	return (
		await fetchJson(`${baseUrl}pokemon/?limit=${limit}&offset=${offset}`)
	).results;
}

function resolveImage(spritesObj: any): string {
	return (
		spritesObj.other.dream_world.front_default ||
		spritesObj.other["official-artwork"].front_default ||
		spritesObj.front_default
	);
}

async function makePokemonPromise(pokemonNameObj: any) {
	const name = pokemonNameObj.name;
	const pokemonData = await fetchJson(pokemonNameObj.url);
	const species = await fetchJson(pokemonData.species.url);
	const stats = pokemonData.stats;

	return new Pokemon(
		name,
		resolveImage(pokemonData.sprites),
		species.flavor_text_entries.find(
			(element: any) => element.language.name === "en"
		).flavor_text,
		stats
	);
}

export async function getPokemonComponents(
	offset: number = 0,
	limit: number = 20,
	pokemonNameList: null | any[] = null
) {
	const pokemonList =
		pokemonNameList ?? (await PokemonNamesPromise()).slice(offset, limit);
	for (let i = 0; i < pokemonList.length; i++) {
		pokemonList[i] = makePokemonPromise(pokemonList[i]);
	}
	return pokemonList;
}

const promise = getPokemonNameList(0, 99999);
export const PokemonNamesPromise = promise.then.bind(promise);
