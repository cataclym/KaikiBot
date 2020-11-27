import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Guild } from "discord.js";
import { Message } from "discord.js";
import { errorColor, getMemberColorAsync, trim } from "../../util/Util";
import DB from "quick.db";
const userRoles = new DB.table("userRoles");
export default class MyRoleCommand extends Command {
	constructor() {
		super("myrole", {
			aliases: ["myrole", "mr"],
			clientPermissions: ["MANAGE_ROLES"],
			channel: "guild",
			prefix: ";",
			description: {
				description: "Checks your assigned user role. Add a hexcode to change the colour.",
				usage: "name/color FF0000",
			},
			args: [
				{
					id: "name",
					flag: ["name"],
					match: "rest",
				},
				{
					id: "color",
					flag: ["color"],
					match: "option",
				},
			],
		});
	}
	public async exec(message: Message, { name, color }: { name?: string | null, color?: string | null }): Promise<Message | void> {

		const guild = (message.guild as Guild);

		const embedFail = async (text: string) => {
			return new MessageEmbed()
				.setColor(errorColor)
				.setDescription(text);
		};

		const embedSuccess = async (text: string) => {
			return new MessageEmbed()
				.setColor(await getMemberColorAsync(message))
				.setDescription(text);
		};

		const res = userRoles.get(`${message.guild?.id}.${message.author.id}`);

		if (!res) return message.channel.send(await embedFail("You do not have a role!"));

		const myRole = guild.roles.cache.get(res[0]);
		name = name?.slice(5);

		if (name || color) {

			if (!myRole) {
				userRoles.delete(`${guild.id}.${res[0]}`);
				return message.channel.send(await embedFail("You do not have a role!"));
			}

			if (name) {
				const oldName = myRole.name;
				await myRole.setName(trim(name, 32));
				await message.channel.send(await embedSuccess(`You have changed ${oldName}'s name to ${name}!`));
			}

			if (color) {
				const hexCode = color,
					oldHex = myRole.hexColor;
				await myRole.setColor(hexCode);
				await message.channel.send(await embedSuccess(`You have changed ${myRole.name}'s color from ${oldHex} to #${hexCode}!`));
			}
		}
		else {
			if (!myRole) {
				userRoles.delete(`${guild.id}.${res[0]}`);
				return message.channel.send(await embedFail("You do not have a role!"));
			}

			message.channel.send(new MessageEmbed()
				.setAuthor(`Current role assigned to ${message.author.username}`,
					guild.iconURL({ size: 2048, dynamic: true, format: "png" || "gif" })
				|| message.author.displayAvatarURL({ size: 2048, dynamic: true, format: "png" || "gif" }))
				.setColor(myRole.hexColor)
				.addField("Name", `${myRole.name}`, true)
				.addField("Colour", `${myRole.hexColor}`, true));
		}
	}
}