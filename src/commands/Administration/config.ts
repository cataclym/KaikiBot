import { Argument, Flag, PrefixSupplier } from "discord-akairo";
import { editMessageWithPaginatedEmbeds } from "@cataclym/discord.js-pagination-ts-nsb";
import { ColorResolvable, Guild, Message, MessageEmbed } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "Kaiki";
import { Color } from "sharp";

export default class ConfigCommand extends KaikiCommand {
	constructor() {
		super("config", {
			aliases: ["config", "configure"],
			channel: "guild",
			description: "Configure or display guild specific settings. Will always respond to default prefix.",
			usage: ["", "dadbot enable", "anniversary enable", "prefix !", "okcolor <hex>", "errorcolor <hex>", "welcome/goodbye [channel] [-e] [-c yellow] [-i http://link.png] [message]"],
			prefix: (msg: Message) => {
				const p = (this.handler.prefix as PrefixSupplier)(msg);
				return [p as string, "-"];
			},
		});
	}
	*args(): Generator<{
		type: string[][];
	}, (Flag & {
		command: string;
		ignore: boolean;
		rest: string;
	}) | undefined, unknown> {
		const method = yield {
			type: [
				["config-dadbot", "dadbot", "dad"],
				["config-anniversary", "anniversary", "roles", "anniversaryroles"],
				["config-prefix", "prefix"],
				["config-okcolor", "okcolor"],
				["config-errorcolor", "errorcolor"],
				["config-welcome", "welcome", "greet"],
				["config-goodbye", "goodbye", "bye"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method as string);
		}
	}

	public async exec(message: Message): Promise<Message> {

		const db = await getGuildDocument((message.guild as Guild).id),
			{ anniversary, dadBot, prefix, errorColor, okColor, welcome, goodbye } = db.settings,
			welcomeEmbed = new MessageEmbed()
				.setColor(welcome.color as ColorResolvable)
				.setAuthor("Welcome embed preview")
				.setDescription(welcome.message),
			goodbyeEmbed = new MessageEmbed()
				.setColor(goodbye.color as ColorResolvable)
				.setAuthor("Goodbye embed preview")
				.setDescription(goodbye.message);

		if (welcome.image) {
			welcomeEmbed.setImage(welcome.image);
		}

		if (goodbye.image) {
			goodbyeEmbed.setImage(goodbye.image);
		}

		const pages = [
			new MessageEmbed()
				.withOkColor(message)
				.addField("DadBot",
					dadBot
						? "Enabled"
						: "Disabled", true)
				.addField("Anniversary-Roles",
					anniversary
						? "Enabled"
						: "Disabled", true)
				.addField("Guild prefix",
					prefix === process.env.PREFIX
						? `\`${process.env.PREFIX}\` (Default)`
						: prefix, true)
				.addField("Embed error color",
					errorColor.toString().startsWith("#")
						? errorColor.toString()
						: "#" + errorColor.toString(16), true)
				.addField("Embed ok color",
					okColor.toString().startsWith("#")
						? okColor.toString()
						: "#" + okColor.toString(16), true)
				.addField("\u200B", "\u200B", true)
				.addField("Welcome message",
					welcome.enabled
						? "Enabled"
						: "Disabled", true)
				.addField("Goodbye message",
					goodbye.enabled
						? "Enabled"
						: "Disabled", true)
				.addField("\u200B", "\u200B", true),
			welcomeEmbed,
			goodbyeEmbed,
		];

		const categories = Object.entries(db.blockedCategories).filter(e => e[1]);

		if (categories.length) {
			pages[0]
				.addField("Disabled categories", categories.map(c => c[0]).join("\n"), false);
		}

		return editMessageWithPaginatedEmbeds(message, pages, {});
	}
}
