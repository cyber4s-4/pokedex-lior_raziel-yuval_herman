import { Component } from "./components/component";
import { getPokemonList } from "./pokemonApi";

function renderComponentList(components: Component[], listParent: HTMLElement) {
	for (const component of components) {
		listParent.appendChild(component.createHtml());
	}
}

getPokemonList(0, 9).then((pokemonList) =>
	renderComponentList(
		pokemonList,
		document.getElementsByClassName("pokemon-list")[0] as HTMLElement
	)
);
