import { Component } from "./components/component";
import { getPokemonComponents, getPokemonNames } from "./pokemonApi";

function renderPromiseComponentList(
	promises: Promise<Component>[],
	listParent: HTMLElement
) {
	listParent.innerHTML = "";
	for (const promise of promises) {
		promise.then((component) =>
			listParent.appendChild(component.createHtml())
		);
	}
}

getPokemonComponents(0, 15).then((pokemonList) =>
	renderPromiseComponentList(
		pokemonList,
		document.getElementsByClassName("pokemon-list")[0] as HTMLElement
	)
);

const searchButtonElement = document.querySelector(
	".search-button"
) as HTMLButtonElement;
searchButtonElement.addEventListener("click", (e) => {
	const searchQuery = (
		(e.target as HTMLElement).previousSibling as HTMLInputElement
	).value;
	getPokemonNames((pokemons) => {
		getPokemonComponents(
			0,
			0,
			pokemons.filter((item: any) => item.name.includes(searchQuery))
		).then((pokemonList) =>
			renderPromiseComponentList(
				pokemonList,
				document.getElementsByClassName("pokemon-list")[0] as HTMLElement
			)
		);
	});
});

const searchInputElement = document.querySelector(
	".search-input"
) as HTMLInputElement;
searchInputElement.addEventListener("input", (e) => {
	const searchQuery = (e.target as HTMLInputElement).value;
	getPokemonNames((pokemons) => {
		getPokemonComponents(
			0,
			0,
			pokemons.filter((item: any) => item.name.includes(searchQuery))
		).then((pokemonList) =>
			renderPromiseComponentList(
				pokemonList,
				document.getElementsByClassName("pokemon-list")[0] as HTMLElement
			)
		);
	});
});
searchInputElement.addEventListener("keydown", (e) => {
	if (e.key === "Enter") searchButtonElement.click();
});

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
