import { hexColorTable, resolveColor } from "../../lib/Color";
import { Guild, Message, MessageEmbed } from "discord.js";
import { Argument, Command } from "@cataclym/discord-akairo";
import { embedFail } from "../../lib/Embeds";
import { getGuildDocument } from "../../struct/documentMethods";
import { Snowflake } from "discord-api-types";

export default class MyRoleSubCommandColor extends Command {
	constructor() {
		super("myrolecolor", {
			clientPermissions: ["MANAGE_ROLES"],
			channel: "guild",
			args: [{
				id: "color",
				type: Argument.union((_, phrase) => hexColorTable[phrase.toLowerCase()], "color"),
				otherwise: (m: Message) => new MessageEmbed()
					.setTitle("Please provide a valid hexcolor or color name")
					.withErrorColor(m),
			}],
		});
	}

	async exec(message: Message, { color }: { color: string | number }): Promise<Message> {

		if (typeof color === "number") color = color.toString(16);

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

		const botRole = message.guild?.me?.roles.highest,
			isPosition = botRole?.comparePositionTo(myRole);

		if (isPosition && isPosition <= 0) {
			return message.channel.send(await embedFail(message, "This role is higher than me, I cannot edit this role!"));
		}

		const oldHex = myRole.hexColor;
		await myRole.setColor(color);
		return message.channel.send(new MessageEmbed()
			.setDescription(`You have changed \`${myRole.name}\`'s color from \`${oldHex}\` to \`${color}\`!`)
			.setColor(color),
		);
	}
}
