import { trim } from "../../lib/Util";
import { Guild, Message, MessageEmbed } from "discord.js";
import { embedFail } from "../../lib/Embeds";
import { getGuildDocument } from "../../struct/documentMethods";
import { Snowflake } from "discord-api-types";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class MyRoleSubCommandName extends KaikiCommand {
	constructor() {
		super("myrolename", {
			clientPermissions: ["MANAGE_ROLES"],
			channel: "guild",
			args: [{
				id: "name",
				otherwise: (m: Message) => new MessageEmbed()
					.setTitle("Please provide a name")
					.withErrorColor(m),
			}],
		});
	}

	async exec(message: Message, { name }: { name: string }): Promise<Message> {

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

		const oldName = myRole.name;
		await myRole.setName(trim(name, 32));
		return message.channel.send({ embeds: [new MessageEmbed()
			.setDescription(`You have changed \`${oldName}\`'s name to \`${name}\`!`)
			.setColor(myRole.color)],
		});
	}
}
