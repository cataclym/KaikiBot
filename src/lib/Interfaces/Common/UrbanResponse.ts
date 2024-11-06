export interface UrbanResponse {
	definition: string;
	permalink: string;
	thumbs_up: number;
	sound_urls: string[];
	author: string;
	word: string;
	defid: number;
	current_vote: string;
	written_on: Date;
	example: string;
	thumbs_down: number;
}

export interface RootObject {
	list: UrbanResponse[];
}
