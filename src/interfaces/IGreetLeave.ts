import {
	ColorResolvable,
	EmbedFieldData,
	MessageEmbed, MessageEmbedAuthor,
	MessageEmbedFooter,
	MessageEmbedImage, MessageEmbedOptions,
	MessageEmbedThumbnail,
	MessageOptions,
	MessagePayload,
} from "discord.js";

export interface EmbedJSON {
	title?: string;
	url?: string;
	description?: string;
	author?: MessageEmbedAuthor;
	color?: number;
	footer?: MessageEmbedFooter;
	thumbnail?: (Partial<MessageEmbedThumbnail> & { proxy_url?: string | undefined; });
	image?: (Partial<MessageEmbedImage> & { proxy_url?: string | undefined; });
	fields?: EmbedFieldData[];
}

export interface IGreet {
	enabled: boolean,
	channel: string,
	embed: MessageEmbedOptions,
}

interface MessageEmbedOptionsJSON extends MessageEmbedOptions {
	plainText?: string | undefined;
}

export class EmbedFromJson {
	public plainText: string | undefined;
	public title: string | undefined;
	public url: string | undefined;
	public description: string | undefined;
	public author: MessageEmbedAuthor | undefined;
	public color: ColorResolvable | undefined;
	public footer: MessageEmbedFooter | undefined;
	public thumbnail: (Partial<MessageEmbedThumbnail> & { proxy_url?: string | undefined; }) | undefined;
	public image: (Partial<MessageEmbedImage> & { proxy_url?: string | undefined; }) | undefined;
	public fields: EmbedFieldData[] | undefined;
	public createEmbed: () => Promise<string | MessagePayload | MessageOptions>;
	constructor(options: MessageEmbedOptionsJSON) {
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
		this.createEmbed = async () => {
			return { content: this.plainText ?? null, embeds: [new MessageEmbed(this)] };
		};
	}
}
