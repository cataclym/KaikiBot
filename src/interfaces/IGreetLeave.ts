import {
	ColorResolvable,
	EmbedFieldData,
	MessageEmbed,
	MessageEmbedAuthor,
	MessageEmbedFooter,
	MessageEmbedImage,
	MessageEmbedOptions,
	MessageEmbedThumbnail,
	MessageOptions,
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

export interface MessageEmbedOptionsJSON extends MessageEmbedOptions {
	plainText?: string | undefined;
}

export interface IGreet {
	enabled: boolean,
	channel: string,
	embed: MessageEmbedOptionsJSON,
	timeout: number | null,
}

export class EmbedFromJson implements MessageEmbedOptionsJSON {
	public plainText: string | undefined;
	public title: string | undefined;
	public url: string | undefined;
	public description: string | undefined;
	public author: (Partial<MessageEmbedAuthor> & { icon_url?: string; proxy_icon_url?: string }) | undefined;
	public color: ColorResolvable | undefined;
	public footer: (Partial<MessageEmbedFooter> & { icon_url?: string; proxy_icon_url?: string }) | undefined;
	public thumbnail: (Partial<MessageEmbedThumbnail> & { proxy_url?: string | undefined; }) | undefined;
	public image: (Partial<MessageEmbedImage> & { proxy_url?: string | undefined; }) | undefined;
	public fields: EmbedFieldData[] | undefined;
	public createEmbed: () => Promise<MessageOptions>;
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

			const embed: MessageEmbed[] = [];

			if (this.title
                || this.author
                || this.description
                || this.fields
                || this.footer
                || this.image
                || this.thumbnail) {
				embed.push(new MessageEmbed(this));
			}
			// Please help me

			return { content: this.plainText ?? null, embeds: embed };
		};
	}
}
