export interface List {
		definition: string;
		permalink: string;
		thumbs_up: number;
		sound_urls: any[];
		author: string;
		word: string;
		defid: number;
		current_vote: string;
		written_on: Date;
		example: string;
		thumbs_down: number;
}

export interface RootObject {
		list: List[];
}

