export interface IAniListResponse {
	data: Data;
}

export interface Data {
	Page: Page;
}

export interface Page {
	media: Media[];
}

export interface Media {
	idMal: number;
	title: Title;
	coverImage: CoverImage;
	description: string;
	bannerImage: string;
	format: string;
	status: string;
	type: string;
	meanScore: number;
	startDate: EndDateClass;
	endDate: EndDateClass;
	duration: number;
	source: string;
	episodes: number;
	chapters: null;
	volumes: null;
	studios: Studios;
	synonyms: string[];
	genres: string[];
	trailer: Trailer;
	externalLinks: ExternalLink[];
	siteUrl: string;
	isAdult: boolean;
	nextAiringEpisode: null;
}

export interface CoverImage {
	large: string;
	color: string;
}

export interface EndDateClass {
	year: number;
	month: number;
	day: number;
}

export interface ExternalLink {
	site: string;
	url: string;
}

export interface Studios {
	nodes: Node[];
}

export interface Node {
	name: string;
}

export interface Title {
	romaji: string;
	english: string;
}

export interface Trailer {
	id: string;
	site: string;
}
