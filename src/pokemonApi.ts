import { Pokemon } from "./components/pokemon";

const baseUrl = "https://pokeapi.co/api/v2/";

export interface PokemonName {
	name: string;
	url: string;
}

export async function fetchJson(url: string) {
	return await (await fetch(url)).json();
}

/**
 * Initiates fetches for pokemon names from the api
 * @param offset Offset from names array beginning
 * @param limit Amount of names to load
 * @returns A Promise list with pokemon names
 */
export async function getPokemonNameList(
	offset: number = 0,
	limit: number = 20
): Promise<PokemonName[]> {
	return (
		await fetchJson(`${baseUrl}pokemon/?limit=${limit}&offset=${offset}`)
	).results;
}

/**
 * Tries to load images and uses several fallbacks if image is unavailable
 * @param spritesObj A sprite object received from the API
 * @returns String or undefined
 */
function resolveImage(spritesObj: any): string | undefined {
	return (
		spritesObj.other.dream_world.front_default ||
		spritesObj.other["official-artwork"].front_default ||
		spritesObj.front_default
	);
}

/**
 * Creates a promise that will resolve to a Pokemon Object after API fetches.
 * @param pokemonNameObj A pokemon name object from the API
 * @returns A Pokemon promise
 */
async function makePokemonPromise(pokemonNameObj: PokemonName) {
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

/**
 * Initiates fetches for pokemon' and returns a promise array
 * @param offset Offset from array beginning
 * @param limit Amount of pokemon's to load
 * @param pokemonNameList A list of pokemon names to use, if not provided, fetch from server using offset and limit
 * @returns Pokemon promise array
 */
export async function getPokemonComponents(
	offset: number = 0,
	limit: number = 20,
	pokemonNameList: null | PokemonName[] = null
) {
	pokemonNameList =
		pokemonNameList?.slice(offset, limit) ??
		(await PokemonNamesPromise()).slice(offset, limit);
	const pokemonList: Promise<Pokemon>[] = [];
	for (let i = 0; i < pokemonNameList.length; i++) {
		pokemonList.push(makePokemonPromise(pokemonNameList[i]));
	}
	return pokemonList;
}

const promise = getPokemonNameList(0, 99999);
// A promise that resolves to all pokemon names
export const PokemonNamesPromise = promise.then.bind(promise);
