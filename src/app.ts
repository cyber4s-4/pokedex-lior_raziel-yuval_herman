import { Pokemon } from "./components/pokemon";
import { getPokemonComponents, PokemonNamesPromise } from "./pokemonApi";

/**
 * Renders Pokemon components as they arrive from the server.
 * The filterFromQuery variable is to avoid race condition when showing pokemon's from search.
 * @param promises Pokemon promise array
 * @param listParent HTMLElement to append pokemon's to
 * @param filterFromQuery A boolean determining wether to filter pokemon's after they are fetched
 * @param removeOld A boolean determining wether to remove previously shown pokemon's
 */
function renderPromiseComponentList(
	promises: Promise<Pokemon>[],
	listParent: HTMLElement,
	filterFromQuery: boolean = false,
	removeOld: boolean = true
) {
	if (removeOld) {
		listParent.innerHTML = "";
		currentShownPokemonNames.length = 0;
	}
	for (const promise of promises) {
		promise.then((pokemon) => {
			if (
				currentShownPokemonNames.includes(pokemon.name) ||
				(filterFromQuery &&
					!pokemon.name.includes(searchInputElement.value))
			)
				return;
			listParent.appendChild(pokemon.createHtml());
			currentShownPokemonNames.push(pokemon.name);
		});
	}
}

let showingSearch = false;
const renderAmount = 15;
const previousBatch = [0, renderAmount];
const currentShownPokemonNames: string[] = [];
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
