export interface EmbedJSON {
	plainText?: string;
	title?: string;
	url?: string;
	description?: string;
	author?: Author;
	color?: number;
	footer?: Footer;
	thumbnail?: string;
	image?: string;
	fields?: Field[];
}

export interface Author {
	name: string;
	icon_url: string;
}

export interface Field {
	name: string;
	value: string;
	inline: boolean;
}

export interface Footer {
	text: string;
	icon_url: string;
}

export interface IGreet {
	enabled: boolean,
	channel: string,
	embed: EmbedJSON,
}

export class EmbedJSONClass {
	public plainText: string | undefined;
	public title: string | undefined;
	public url: string | undefined;
	public description: string | undefined;
	public author: Author | undefined;
	public color: number | undefined;
	public footer: Footer | undefined;
	public thumbnail: string | undefined;
	public image: string | undefined;
	public fields: Field[] | undefined;
	constructor(options: EmbedJSON) {
		this.plainText = options.plainText;
		this.title = options.title;
		this.url = options.url;
		this.description = options.description;
		this.author = options.author;
		this.color = options.color;
		this.footer = options.footer;
		this.thumbnail = options.thumbnail;
		this.image = options.image;
		this.fields = options.fields;
	}
}
