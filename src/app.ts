const baseUrl = "https://pokeapi.co/api/v2/";

const pokemonList = [];

fetch(baseUrl + "pokemon")
	.then((response) => response.json())
	.then((data) => {
		const body = document.body;
		for (const pokemon of data.results) {
			const pElement = document.createElement("p");
			pElement.innerText = JSON.stringify(pokemon);
			body.appendChild(pElement);
		}
	});
