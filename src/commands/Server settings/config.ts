import { sendPaginatedMessage } from "@cataclym/discord.js-pagination-ts-nsb";
import { Argument, Flag, PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { EmbedFromJson } from "../../interfaces/IGreetLeave";
import { createAndParseWelcomeLeaveMessage } from "../../lib/GreetHandler";
import { KaikiCommand } from "kaiki";

import { getGuildDocument } from "../../struct/documentMethods";

export default class ConfigCommand extends KaikiCommand {
	constructor() {
		super("config", {
			aliases: ["config", "configure", "conf"],
			channel: "guild",
			description: "Configure or display guild specific settings. Will always respond to default prefix.",
			usage: ["", "dadbot enable", "anniversary enable", "prefix !", "okcolor <hex>", "errorcolor <hex>"],
			prefix: (msg: Message) => {
				return [(this.handler.prefix as PrefixSupplier)(msg) as string, "-"];
			},
		});
	}
	*args(): unknown {
		const method = yield {
			type: [
				["config-dadbot", "dadbot", "dad"],
				["config-anniversary", "anniversary", "roles", "anniversaryroles"],
				["config-prefix", "prefix"],
				["config-okcolor", "okcolor"],
				["config-errorcolor", "errorcolor"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method as string);
		}
	}

	public async exec(message: Message): Promise<Message> {

		const db = await getGuildDocument((message.guild as Guild).id),
			{ anniversary, dadBot, prefix, errorColor, okColor, welcome, goodbye } = db.settings,
			welcomeEmbed = await new EmbedFromJson(await createAndParseWelcomeLeaveMessage(welcome, message.member!)).createEmbed(),
			goodbyeEmbed = await new EmbedFromJson(await createAndParseWelcomeLeaveMessage(goodbye, message.member!)).createEmbed();

		const pages = [
			new MessageEmbed()
				.withOkColor(message)
				.addField("DadBot",
					dadBot.enabled
						? "Enabled"
						: "Disabled", true)
				.addField("Anniversary-Roles",
					anniversary
						? "Enabled"
						: "Disabled", true)
				.addField("Guild prefix",
					prefix === process.env.PREFIX
						? `\`${process.env.PREFIX}\` (Default)`
						: `\`${prefix}\``, true)
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
			(pages[0] as MessageEmbed)
				.addField("Disabled categories", categories.map(c => c[0]).join("\n"), false);
		}

		return sendPaginatedMessage(message, pages, {});
	}
}
