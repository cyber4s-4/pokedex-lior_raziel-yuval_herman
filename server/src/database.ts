import { Client } from "pg";

export class Database {
	client: Client;
	connect;
	constructor(url: string) {
		this.client = new Client({
			connectionString: url,
			ssl: {
				rejectUnauthorized: false,
			},
		});
		this.connect = () => this.client.connect();
	}

	async getPokemonNames(): Promise<string[]> {
		return (await this.client.query("SELECT name FROM pokemon")).rows;
	}

	async find50(name: string) {
		return (
			await this.client.query(
				"SELECT * FROM pokemon WHERE name LIKE $1 LIMIT 50;",
				[`${name}%`]
			)
		).rows;
	}

	async getPokemons(limit = 15, offset = 0) {
		return (
			await this.client.query("SELECT * FROM pokemon LIMIT $1 OFFSET $2;", [
				limit,
				offset,
			])
		).rows;
	}
}
