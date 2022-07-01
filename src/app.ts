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

(
	document.querySelector(".search-button") as HTMLButtonElement
).addEventListener("click", (e) => {
	const searchQuery = (
		(e.target as HTMLElement).previousSibling as HTMLInputElement
	).value;
	getPokemonNames((pokemons) => {
		getPokemonComponents(
			0,
			0,
			pokemons
				.filter((item: any) => item.name.includes(searchQuery))
				.slice(0, 9)
		).then((pokemonList) =>
			renderComponentList(
				pokemonList,
				document.getElementsByClassName("pokemon-list")[0] as HTMLElement
			)
		);
	});
});

(document.querySelector(".search-input") as HTMLInputElement).addEventListener(
	"input",
	(e) => {
		const searchQuery = (e.target as HTMLInputElement).value;
		console.log(searchQuery);
		getPokemonNames((pokemons) => {
			getPokemonComponents(
				0,
				0,
				pokemons
					.filter((item: any) => item.name.includes(searchQuery))
					.slice(0, 3) // TODO add dynamic loading, keep loading in the background
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
