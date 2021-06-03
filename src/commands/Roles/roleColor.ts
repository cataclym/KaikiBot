import { Command } from "@cataclym/discord-akairo";
import { Message, MessageAttachment, MessageEmbed, Role } from "discord.js";
import { imgFromColor, resolveColor } from "../../lib/Color";
import { errorMessage } from "../../lib/Embeds";

export default class RoleColorCommand extends Command {
	constructor() {
		super("rolecolor", {
			aliases: ["rolecolor", "roleclr", "rclr"],
			description: { description: "Displays the color of a given role, or your highest role.", usage: "@Gamer ff00ff" },
			channel: "guild",
			args: [
				{
					id: "role",
					type: "role",
					default: (m: Message) => m.member!.roles.highest,
				},
				{
					id: "clr",
					type: "string",
					match: "rest",
					default: null,
				},
			],
		});
	}
	public async exec(message: Message, { role, clr }: { role: Role, clr: string | null }): Promise<Message> {

		const { member } = message;

		if (typeof clr !== "string") {
			const attachment = new MessageAttachment(await imgFromColor(role.hexColor), "color.png");
			return message.channel.send({ files: [attachment],
				embed: new MessageEmbed({
					title: `Role color of ${role.name}.`,
					description: `${role.hexColor}`,
					image: { url: "attachment://color.png" },
					color: role.hexColor,
				}),
			});
		}

		const { hexColor } = role,
			newColor = await resolveColor(clr),
			attachment = new MessageAttachment(await imgFromColor(newColor), "color.png");


		if (!member?.permissions.has("MANAGE_ROLES") ||
                !(member.roles.highest.position > role.position)) {
			return message.channel.send(await errorMessage(message, "You do not have `MANAGE_ROLES` permission and/or trying to edit a role above you in the role hierarchy."));
		}

		else if (!message.guild?.me?.permissions.has("MANAGE_ROLES") ||
                !(message.guild?.me?.roles.highest.position > role.position)) {
			return message.channel.send(await errorMessage(message, "I do not have `MANAGE_ROLES` permission and/or trying to edit a role above me in the role hierarchy."));
		}

		else if (member?.guild.ownerID === message.member?.id) {
			return role.edit({ color: newColor }).then(r => {
				return message.channel.send({ files: [attachment],
					embed: new MessageEmbed({
						title: `You have changed ${r.name}'s color from ${hexColor} to ${r.hexColor}!`,
						thumbnail: { url: "attachment://color.png" },
					})
						.withOkColor(message),
				});
			});
		}

		return role.edit({ color: newColor }).then(r => {
			return message.channel.send({ files: [attachment],
				embed: new MessageEmbed({
					title: `You have changed ${r.name}'s color from ${hexColor} to ${r.hexColor}!`,
					thumbnail: { url: "attachment://color.png" },
				})
					.withOkColor(message),
			});
		});
	}
}