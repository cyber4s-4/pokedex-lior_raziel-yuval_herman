import { Pokemon } from "./components/pokemon";
import { getPokemonComponents } from "./pokemonApi";

/**
 * Renders Pokemon components as they arrive from the server.
 * The filterFromQuery variable is to avoid race condition when showing pokemon's from search.
 * @param promises Pokemon promise array
 * @param listParent HTMLElement to append pokemon's to
 * @param filterFromQuery A boolean determining wether to filter pokemon's after they are fetched
 * @param removeOld A boolean determining wether to remove previously shown pokemon's
 */
function renderPromiseComponentList(
	pokemons: Pokemon[],
	listParent: HTMLElement,
	filterFromQuery: boolean = false,
	removeOld: boolean = true
) {
	if (removeOld) {
		listParent.innerHTML = "";
		currentShownPokemonNames.length = 0;
	}
	for (const pokemon of pokemons) {
		if (
			currentShownPokemonNames.includes(pokemon.name) ||
			(filterFromQuery && !pokemon.name.includes(searchInputElement.value))
		)
			return;
		listParent.appendChild(pokemon.createHTML());
		currentShownPokemonNames.push(pokemon.name);
	}
}

function renderPokemonByQuery(searchQuery: string) {
	getPokemonComponents().then((pokemonList) => {
		renderPromiseComponentList(
			pokemonList.filter((pokemon) => pokemon.name.includes(searchQuery)),
			document.getElementsByClassName("pokemon-list")[0] as HTMLElement,
			true
		);
	});
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

getPokemonComponents(previousBatch[0], previousBatch[1]).then((pokemonList) =>
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
