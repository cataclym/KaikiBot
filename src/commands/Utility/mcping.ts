import { Message, MessageAttachment, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { ServerOffline, ServerOnline } from "../../interfaces/IMinecraftServerPing";
import { noArgGeneric } from "../../lib/Embeds";
import { trim } from "../../lib/Util";
import { KaikiCommand } from "../../lib/KaikiClass";


export default class mcpingCommand extends KaikiCommand {
	constructor() {
		super("mcping", {
			aliases: ["mcping"],
			description: "",
			usage: "",
			args: [{
				id: "term",
				match: "rest",
				otherwise: (msg: Message) => noArgGeneric(msg),
			}],
			typing: true,
		});
	}

	public async exec(message: Message, { term }: { term: string }): Promise<Message> {

		const result: ServerOffline | ServerOnline = await fetch(`https://api.mcsrvstat.us/2/${term}`)
			.then(response => response.json());

		if (result.online) {

			const attachment = result?.icon?.length ? new MessageAttachment(Buffer.from(result.icon.slice(result.icon.indexOf(",")), "base64"), "icon.png") : undefined;

			const embed = new MessageEmbed()
				.setTitle("Ping! Server is online")
				.setDescription(`${result.ip}:${result.port} ${result?.hostname?.length ? "/ " + result?.hostname : "" }`)
				.addFields(
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					{ name: "Version", value: result.version, inline: true },
					{ name: "MOTD", value: result.motd.clean, inline: true },
					{ name: "Players", value: `${result.players.online}/${result.players.max}`, inline: true },
					{ name: "Plugins", value: result.plugins?.names.length ? trim(result.plugins?.names.join(", "), 1024) : "None", inline: true },
					{ name: "Software", value: result?.software ?? "Unknown", inline: true },
					{ name: "Mods", value: result.mods?.names.length ? trim(result.mods?.names.join(", "), 1024) : "None", inline: true },
				)
				.withOkColor(message);

			if (attachment) {
				embed.setImage("attachment://icon.png");
				return message.channel.send({
					files: [attachment],
					embeds: [embed],
				});
			}

			else {
				return message.channel.send({ embeds: [embed] });
			}
		}

		else {
			return message.channel.send({ embeds: [new MessageEmbed()
				.setTitle("No ping :< Server is offline")
				.withErrorColor(message)] });
		}
	}
}
