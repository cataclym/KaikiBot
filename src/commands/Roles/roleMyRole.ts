import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Guild } from "discord.js";
import { Message } from "discord.js";
import { codeblock, errorColor, getMemberColorAsync } from "../../util/Util";
import DB from "quick.db";
const userRoles = new DB.table("userRoles");
export default class MyRoleCommand extends Command {
	constructor() {
		super("myrole", {
			aliases: ["myrole"],
			clientPermissions: ["MANAGE_ROLES"],
			channel: "guild",
			description: {
				description: "Checks your assigned user role. Add a hexcode to change the colour.",
				usage: "name/color FF0000",
			},
			args: [
				{
					id: "name",
					flag: ["name"],
					match: "option",
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

		console.log(name, color);
		message.channel.send(await codeblock("css", JSON.stringify({ name, color }, undefined, " ")));

		const guild = (message.guild as Guild);

		function embedFail(text: string) {
			return new MessageEmbed()
				.setColor(errorColor)
				.setDescription(text);
		}

		const embedSuccess = async (text: string) => {
			return new MessageEmbed()
				.setColor(await getMemberColorAsync(message))
				.setDescription(text);
		};

		const res = userRoles.get(`${message.guild?.id}.${message.author.id}`);

		if (!res) return message.channel.send(embedFail("You do not have a role!"));

		console.log(res);

		message.reply(await codeblock("css", JSON.stringify(res, undefined, " ")));

		const myRole = guild.roles.cache.get(res[0]);

		if (!name?.length || !color?.length) {

			if (!myRole) {
				userRoles.delete(`${guild.id}.${res[0]}`);
				return message.channel.send(embedFail("You do not have a role!"));
			}

			const embed = new MessageEmbed()
				.setAuthor(`Current role assigned to ${message.author.username}`,
					guild.iconURL({ size: 2048, dynamic: true, format: "png" || "gif" })
                    || message.author.displayAvatarURL({ size: 2048, dynamic: true, format: "png" || "gif" }))
				.setColor(myRole.hexColor)
				.addField("Name", `${myRole.name}`, true)
				.addField("Colour", `${myRole.hexColor}`, true);

			message.channel.send(embed);
		}
		else {

			if (!myRole) {
				userRoles.delete(`${guild.id}.${res[0]}`);
				return message.channel.send(embedFail("You do not have a role!"));
			}

			if (name) {
				await myRole.setName(name);
				await message.channel.send(await embedSuccess(`You have changed ${myRole.name}'s name to ${name}!`));
			}

			if (color) {
				const hexCode = color,
					oldHex = myRole.hexColor;
				await myRole.setColor(hexCode);
				await message.channel.send(await embedSuccess(`You have changed ${myRole.name}'s color from ${oldHex} to #${hexCode}!`));
			}
		}
	}
}