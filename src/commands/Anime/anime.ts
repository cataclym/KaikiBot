import { Message } from "discord.js";
import { KaikiCommand } from "kaiki";

// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
const query = `
query ($id: Int) { # Define which variables will be used in the query (id)
  Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
    id
    title {
      romaji
      english
      native
    }
  }
}
`;

// Define our query variables and values that will be used in the query request
const variables = {
	id: 15125,
};

// Define the config we'll need for our Api request
const url = "https://graphql.anilist.co",
	options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
		},
		body: JSON.stringify({
			query: query,
			variables: variables,
		}),
	};

function handleResponse(response: { json: () => Promise<any>; ok: any; }) {
	return response.json().then(function(json) {
		return response.ok ? json : Promise.reject(json);
	});
}

function handleData(data: any) {
	console.log(data);
}

function handleError(error: any) {
	alert("Error, check console");
	console.error(error);
}

export default class AnimeCommand extends KaikiCommand {
	constructor() {
		super("anime", {
			aliases: ["anime"],
			description: "",
			usage: "",
		});
	}

	public async exec(message: Message): Promise<void> {
		return;
		// Make the HTTP Api request
		fetch(url, options).then(handleResponse)
			.then(handleData)
			.catch(handleError);
	}
}

