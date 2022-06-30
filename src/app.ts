const baseUrl = "https://pokeapi.co/api/v2/";

const pokemonList = [];

fetch(baseUrl + "pokemon")
	.then((response) => response.json())
	.then((data) => {
		const body = document.body;
		pokemonList.push(...data.results);
	});
