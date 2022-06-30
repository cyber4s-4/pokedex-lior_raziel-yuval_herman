import { Pokemon } from "./components/pokemon";

const pokemon = new Pokemon("pikachu",
 "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg","hashmali")
const baseUrl = "https://pokeapi.co/api/v2/";

const pokemonList = [];

fetch(baseUrl + "pokemon")
	.then((response) => response.json())
	.then((data) => {
		const body = document.body;
		pokemonList.push(...data.results);
	});
document.body.appendChild(pokemon.createHtml());

