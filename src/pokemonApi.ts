import { Pokemon } from "./components/pokemon";

const baseUrl = "https://pokeapi.co/api/v2/";

export interface PokemonName {
	name: string;
	url: string;
}

export async function fetchJson(url: string) {
	return await (await fetch(url)).json();
}

export async function getPokemonNameList(
	offset: number = 0,
	limit: number = 20
): Promise<PokemonName[]> {
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
export const PokemonNamesPromise = promise.then.bind(promise);
