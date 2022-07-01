import { Component } from "./components/component";
import { getPokemonComponents, getPokemonNames } from "./pokemonApi";

function renderComponentList(components: Component[], listParent: HTMLElement) {
	listParent.innerHTML = "";
	for (const component of components) {
		listParent.appendChild(component.createHtml());
	}
}

getPokemonComponents(0, 15).then((pokemonList) =>
	renderComponentList(
		pokemonList,
		document.getElementsByClassName("pokemon-list")[0] as HTMLElement
	)
);

(document.querySelector(".search-button") as HTMLElement).addEventListener(
	"click",
	(e) => {
		const searchQuery = (
			(e.target as HTMLElement).previousSibling as HTMLInputElement
		).value;
		getPokemonNames((pokemons) => {
			getPokemonComponents(
				0,
				0,
				pokemons.filter((item: any) => item.name.includes(searchQuery))
			).then((pokemonList) =>
				renderComponentList(
					pokemonList,
					document.getElementsByClassName("pokemon-list")[0] as HTMLElement
				)
			);
		});
	}
);

getPokemonNames((pokemonNames) => {
	const dataListElement = document.querySelector(
		"#pokemon-names"
	) as HTMLElement;
	for (const pokemon of pokemonNames) {
		const optionElement = document.createElement("option");
		optionElement.value = pokemon.name;
		dataListElement.appendChild(optionElement);
	}
});
