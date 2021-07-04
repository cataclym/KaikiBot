// import { AkairoClient } from "discord-akairo";
// import { ColorResolvable, GuildMember, Message, MessageEmbed } from "discord.js";
// import { customClient } from "../struct/client";

// export interface CommandOptions {
// 	name: string;
// 	response: string;
// 	color: ColorResolvable | null | ((m: Message) => Promise<ColorResolvable>);
// 	images?: string[] | null;
// 	mention?: boolean;
// }

// export default class customCommand {
// 	client: AkairoClient;
// 	name: string;
// 	images?: string[] | null;
// 	response: string | null;
// 	color: ColorResolvable | null;
// 	mention?: boolean;
// 	constructor(client: AkairoClient, options: CommandOptions) {

// 		const {
// 			color = null,
// 			images = null,
// 			response = null,
// 			mention = false,
// 			name,
// 		} = options;

// 		this.client = client;
// 		this.color = typeof color === "function" ? color.bind(this) : color;

// 		const img = Array.isArray(images) ? images : typeof images !== "string" ? null : images;

// 		this.images = img;
// 		this.mention = Boolean(mention);

// 		if (!name) client.emit("");

// 		this.name = name;
// 		this.response = response;
// 	}

// 	private formatResponse(message: Message): string | null {
// 		if (this.response) {
// 			const str = this.response.replace(/%user%/g, message.author.username);
// 			if (this.mention) {
// 				return str.replace(/%mention%/g, this.member?.user.username ?? "");
// 			}
// 			return str;
// 		}
// 		return null;
// 	}

// 	public async execute(message: Message): Promise<Message> {

// 		const embed = new MessageEmbed({
// 			description: this.formatResponse(message) ?? "\u200B",
// 			color: await this.color ?? await message.getMemberColorAsync(),
// 		});

// 		if (this.images?.length) embed.setImage(this.images[Math.floor(Math.random() * this.images.length)]);

// 		return message.channel.send(embed);
// 	}
// }
