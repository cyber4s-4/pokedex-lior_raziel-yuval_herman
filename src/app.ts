import { Pokemon } from "./components/pokemon";
import { getPokemonComponents, PokemonNamesPromise } from "./pokemonApi";

function renderPromiseComponentList(
	promises: Promise<Pokemon>[],
	listParent: HTMLElement,
	filterFromQuery: boolean = false,
	removeOld: boolean = true
) {
	if (removeOld) listParent.innerHTML = "";
	for (const promise of promises) {
		promise.then((pokemon) => {
			if (
				filterFromQuery &&
				!pokemon.name.includes(searchInputElement.value)
			)
				return;
			listParent.appendChild(pokemon.createHtml());
		});
	}
}

let showingSearch = false;
const renderAmount = 15;
const previousBatch = [0, renderAmount];
const searchButtonElement = document.querySelector(
	".search-button"
) as HTMLButtonElement;
const searchInputElement = document.querySelector(
	".search-input"
) as HTMLInputElement;

getPokemonComponents(...previousBatch).then((pokemonList) =>
	renderPromiseComponentList(
		pokemonList,
		document.getElementsByClassName("pokemon-list")[0] as HTMLElement
	)
);

searchButtonElement.addEventListener("click", () => {
	const searchQuery = searchInputElement.value;
	if (!searchQuery.length) {
		showingSearch = false;
		return;
	}
	showingSearch = true;
	renderPokemonByQuery(searchQuery);
});

searchInputElement.addEventListener("input", () => {
	const searchQuery = searchInputElement.value;
	if (!searchQuery.length) {
		showingSearch = false;
		return;
	}
	showingSearch = true;
	renderPokemonByQuery(searchQuery);
});

searchInputElement.addEventListener("keydown", (e) => {
	if (e.key === "Enter") searchButtonElement.click();
});

PokemonNamesPromise((pokemonNames) => {
	const dataListElement = document.querySelector(
		"#pokemon-names"
	) as HTMLElement;
	for (const pokemon of pokemonNames) {
		const optionElement = document.createElement("option");
		optionElement.value = pokemon.name;
		dataListElement.appendChild(optionElement);
	}
});

window.onscroll = () => {
	if (showingSearch) return;
	if (
		window.innerHeight + window.scrollY >=
		document.body.scrollHeight - 2000
	) {
		previousBatch[0] += renderAmount;
		previousBatch[1] += renderAmount;
		getPokemonComponents(...previousBatch).then((pokemonList) =>
			renderPromiseComponentList(
				pokemonList,
				document.getElementsByClassName("pokemon-list")[0] as HTMLElement,
				undefined,
				false
			)
		);
	}
};
function renderPokemonByQuery(searchQuery: string) {
	PokemonNamesPromise((pokemons) =>
		getPokemonComponents(
			0,
			99999,
			pokemons.filter((item) => item.name.includes(searchQuery))
		).then((pokemonList) => {
			renderPromiseComponentList(
				pokemonList,
				document.getElementsByClassName("pokemon-list")[0] as HTMLElement,
				true
			);
		})
	);
}
