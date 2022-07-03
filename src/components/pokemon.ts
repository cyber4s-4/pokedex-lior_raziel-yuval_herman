export class Pokemon {
	name: string;
	img: string;
	description: string;
	stats: object[];
	constructor(
		name: string,
		img: string | undefined,
		description: string,
		stats: Object[]
	) {
		this.name = name;
		this.img = img ?? "";
		this.description = description;
		this.stats = stats;
	}

	/**
	 * Creates front HTML for the pokemon card.
	 * @returns HTMLElement
	 */
	#makeFrontHTML(): HTMLElement {
		// Replace a strange char we get from the api sometimes
		const description = this.description.replace("", " ");
		// Show alt text or image not found
		const imgAltText = this.img ? `A ${this.name} image` : "No image found";
		// Add a P element for every stat
		const stats = this.stats.map((element: any) => {
			return `<p><strong>${element.stat.name}</strong> is ${element.base_stat} at ${element.effort} effort</p>`;
		});

		const containerDiv = document.createElement("div");
		containerDiv.classList.add("pokemon-component-front");
		containerDiv.innerHTML = ` <div class="flex-right">
            <img class="pokemon-image" src="${this.img}" alt="${imgAltText}">
            <div class="flex-down">
            <h1 class="pokemon-name"> ${this.name}</h1>
            <div class="stats-div flex-down">${stats.join("")}</div>
            </div>
            </div>
            <p class="pokemon-description">${description}</p>`;
		return containerDiv;
	}

	/**
	 * Creates back HTML for the pokemon card.
	 * @returns HTMLElement
	 */
	#makeBackHTML(): HTMLElement {
		// Replace a strange char we get from the api sometimes
		const description = "This is the back!!!!"; //this.description.replace("", " ");
		// Show alt text or image not found
		const imgAltText = this.img ? `A ${this.name} image` : "No image found";
		// Add a P element for every stat
		const stats = this.stats.map((element: any) => {
			return `<p><strong>${element.stat.name}</strong> is ${element.base_stat} at ${element.effort} effort</p>`;
		});

		const containerDiv = document.createElement("div");
		containerDiv.classList.add("pokemon-component-back");
		containerDiv.innerHTML = ` <div class="flex-right">
            <img class="pokemon-image" src="${this.img}" alt="${imgAltText}">
            <div class="flex-down">
            <h1 class="pokemon-name"> ${this.name}</h1>
            <div class="stats-div flex-down">${stats.join("")}</div>
            </div>
            </div>
            <p class="pokemon-description">${description}</p>`;
		return containerDiv;
	}

	/**
	 * Creates HTML for the pokemon.
	 * @returns HTMLElement
	 */
	createHTML(): HTMLElement {
		const pokemonContainer = document.createElement("div");
		pokemonContainer.classList.add("pokemon-container");
		pokemonContainer.appendChild(this.#makeFrontHTML());
		pokemonContainer.appendChild(this.#makeBackHTML());
		pokemonContainer.addEventListener("click", () => {
			pokemonContainer.classList.toggle("popup-card");
		});
		return pokemonContainer;
	}
}
