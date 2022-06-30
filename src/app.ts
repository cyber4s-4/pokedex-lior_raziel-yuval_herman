import { Component } from "./components/component";
import { Pokemon } from "./components/pokemon";

const baseUrl = "https://pokeapi.co/api/v2/";

async function fetchJson(url: string) {
	return await (await fetch(url)).json();
}

async function getPokemonList() {
	const pokemonList = (await fetchJson(baseUrl + "pokemon")).results;
	for (let i = 0; i < pokemonList.length; i++) {
		const name = pokemonList[i].name;
		const pokemonData = await fetchJson(pokemonList[i].url);
		const species = await fetchJson(pokemonData.species.url);
		// console.log(species);
		
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

	renderComponentList(
		pokemonList,
		document.getElementsByClassName("pokemon-list")[0] as HTMLElement
	);
}

function renderComponentList(components: Component[], listParent: HTMLElement) {
	for (const component of components) {
		listParent.appendChild(component.createHtml());
	}
}

getPokemonList();
