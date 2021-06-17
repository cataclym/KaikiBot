import { Argument, Command, Flag, PrefixSupplier } from "@cataclym/discord-akairo";
import { Snowflake } from "discord-api-types";
import { Guild, Message, MessageEmbed } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { embedFail } from "../../lib/Embeds";

export default class MyRoleCommand extends Command {
	constructor() {
		super("myrole", {
			aliases: ["myrole", "mr"],
			clientPermissions: ["MANAGE_ROLES"],
			channel: "guild",
			prefix: (msg: Message) => {
				const p = (this.handler.prefix as PrefixSupplier)(msg);
				return [p as string, ";"];
			},
			description: {
				description: "Checks your assigned user role. Add a hexcode to change the colour.",
				usage: ["color FF0000", "name Dreb"],
			},
		});
	}

	*args(): unknown {
		const method = yield {
			type: [
				["myrolename", "name"],
				["myrolecolor", "color", "colour", "clr"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method);
		}
	}

	public async exec(message: Message): Promise<Message> {

		const guild = (message.guild as Guild);

		const db = await getGuildDocument(guild.id),
			roleID = db.userRoles[message.author.id];

		if (!roleID) return message.channel.send(await embedFail(message));

		const myRole = guild.roles.cache.get(roleID as Snowflake);

		if (!myRole) {
			delete db.userRoles[message.author.id];
			db.markModified("userRoles");
			await db.save();
			return message.channel.send(await embedFail(message));
		}

		return message.channel.send(new MessageEmbed()
			.setAuthor(`Current role assigned to ${message.author.username}`,
				guild.iconURL({ size: 2048, dynamic: true })
						|| message.author.displayAvatarURL({ size: 2048, dynamic: true }))
			.setColor(myRole.hexColor)
			.addField("Name", myRole.name, true)
			.addField("Colour", myRole.hexColor, true));
	}
}