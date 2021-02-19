import { Command } from "@cataclym/discord-akairo";
import { MessageAttachment } from "discord.js";
import { Message, MessageEmbed, Role } from "discord.js";
import { imgFromColor, resolveColor } from "../../nsb/Color";

export default class RoleColorCommand extends Command {
	constructor() {
		super("rolecolor", {
			aliases: ["rolecolor", "roleclr", "rclr"],
			description: { description: "Displays the color of a given role, or your highest role.", usage: "@Gamer weeb" },
			clientPermissions: "MANAGE_ROLES",
			channel: "guild",
			args: [
				{
					id: "role",
					type: "role",
					default: (m: Message) => m.member?.roles.highest,
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
	public async exec(message: Message, { role, clr }: { role: Role | null, clr: string | null }): Promise<Message | boolean> {

		if (role) {
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

			if (member?.permissions.has("MANAGE_ROLES") && member.roles.highest.position > role.position) {
				const { hexColor } = role,
					newColor = await resolveColor(clr);

				return role.edit({ color: newColor }).then(r => {
					return message.channel.send(new MessageEmbed({
						title: `You have changed ${r.name}'s color from ${hexColor} to ${r.hexColor}!`,
						color: newColor,
					}));
				});
			}

			else {
				return this.handler.emit("missingPermissions", message, this, "user", ["MANAGE_ROLES"]);
			}
		}

		else {
			return message.channel.send(new MessageEmbed({
				title: "Error",
				description: "Role is undefined. Please contact bot owner.",
			})
				.withErrorColor(message));
		}
	}
}