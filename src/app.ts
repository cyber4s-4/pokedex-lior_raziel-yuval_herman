import { Component } from "./components/component";
import { Pokemon } from "./components/pokemon";

const pokemon = new Pokemon(
	"pikachu",
	"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg",
	"hashmali"
);
const baseUrl = "https://pokeapi.co/api/v2/";

const pokemonList = [];

fetch(baseUrl + "pokemon")
	.then((response) => response.json())
	.then((data) => {
		pokemonList.push(...data.results);
	});

function renderComponentList(components: Component[], listParent: HTMLElement) {
	for (const component of components) {
		listParent.appendChild(component.createHtml());
	}
}

renderComponentList(
	[pokemon, pokemon, pokemon, pokemon, pokemon],
	document.getElementsByClassName("pokemon-list")[0] as HTMLElement
);
