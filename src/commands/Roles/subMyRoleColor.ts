import { hexColorTable } from "../../lib/Color";
import { ColorResolvable, Guild, Message, MessageEmbed } from "discord.js";
import { Argument } from "discord-akairo";
import { embedFail } from "../../lib/Embeds";
import { getGuildDocument } from "../../struct/documentMethods";
import { Snowflake } from "discord-api-types";
import { KaikiCommand } from "kaiki";


export default class MyRoleSubCommandColor extends KaikiCommand {
	constructor() {
		super("myrolecolor", {
			clientPermissions: ["MANAGE_ROLES"],
			channel: "guild",
			args: [{
				id: "color",
				type: Argument.union((_, phrase) => hexColorTable[phrase.toLowerCase()], "color"),
				otherwise: (m: Message) => ({ embeds: [new MessageEmbed()
					.setTitle("Please provide a valid hex-color or color name")
					.withErrorColor(m)] }),
			}],
		});
	}

	async exec(message: Message, { color }: { color: string | number }): Promise<Message> {

		if (typeof color === "number") color = color.toString(16);

		const guild = (message.guild as Guild);

		const db = await getGuildDocument(guild.id),
			roleID = db.userRoles[message.author.id];

		if (!roleID) return message.channel.send({ embeds: [await embedFail(message)] });

		const myRole = guild.roles.cache.get(roleID as Snowflake);

		if (!myRole) {
			delete db.userRoles[message.author.id];
			db.markModified("userRoles");
			await db.save();
			return message.channel.send({ embeds: [await embedFail(message)] });
		}

		const botRole = message.guild?.me?.roles.highest,
			isPosition = botRole?.comparePositionTo(myRole);

		if (isPosition && isPosition <= 0) {
			return message.channel.send({ embeds: [await embedFail(message, "This role is higher than me, I cannot edit this role!")] });
		}

		const oldHex = myRole.hexColor;
		await myRole.setColor(color as ColorResolvable);
		return message.channel.send({
			embeds: [new MessageEmbed()
				.setDescription(`You have changed \`${myRole.name}\`'s color from \`${oldHex}\` to \`${color}\`!`)
				.setColor(color as ColorResolvable)],
		});
	}
}
