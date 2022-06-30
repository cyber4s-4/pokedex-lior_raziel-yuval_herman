import { Component } from "./component";

export class Pokemon implements Component {
	name: string;
	img: string;
	description: string;
	stats: object[];
	constructor(
		name: string,
		img: string,
		description: string,
		stats: Object[]
	) {
		this.name = name;
		this.img = img;
		this.description = description;
		this.stats = stats;
		// console.log(this.stats);
	}

	createHtml(): HTMLElement {
		const stats = this.stats.map((element: any) => {
			return `${element.stat.name} is ${element.base_stat} at ${element.effort} effort`;
		});

		const containerDiv = document.createElement("div");
		containerDiv.classList.add("pokemon-component");
		containerDiv.innerHTML = ` <div class="flex-right">
	<img class="pokemon-image" src="${this.img}" alt="A ${this.name} image">
	<div class="flex-down">
	<h1 class="pokemon-name"> ${this.name}</h1>
	<div class="stats-div" class="flex-down"></div>
	</div>
	</div>
	<p class="pokemon-description">${this.description}</p>`;

		for (let i = 0; i < stats.length; i++) {
			const statsParagraph = document.createElement("p");
			statsParagraph.innerHTML = stats[i];
			containerDiv.querySelector(".stats-div")?.appendChild(statsParagraph);
		}
		return containerDiv;
	}
}
// for (let j = 0; j < stats.length; j++) {
// 	const baseStat = stats[j].base_stat;
// 	const effort = stats[j].effort;
// 	const statName = stats[j].stat.name;

// 	this.stats += `${statName} is ${baseStat} at ${effort} effort`
// }
