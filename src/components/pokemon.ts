import { Component } from "./component";

export class Pokemon implements Component {
	name: string;
	img: string;
	description: string;
	constructor(name: string, img: string, description: string) {
		this.name = name;
		this.img = img;
		this.description = description;
	}

	createHtml(): HTMLElement {
		const containerDiv = document.createElement("div");
		containerDiv.classList.add("pokemon-component");
		containerDiv.innerHTML = ` <div class="flex-right">
        <img class="pokemon-image" src="${this.img}" alt="A ${this.name} image">
        <div class="flex-down">
        <h1 class="pokemon-name"> ${this.name}</h1>
        <div class="flex-down">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates perspiciatis</div>
        </div>
        </div>
        <p class="pokemon-description">${this.description}</p>`;
		return containerDiv;
	}
}
