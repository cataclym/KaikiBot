import { Command } from "discord-akairo";
import { MessageEmbed } from "discord.js";
import { Guild } from "discord.js";
import { Message } from "discord.js";
import { errorColor, getMemberColorAsync } from "../../util/Util";
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
					default: undefined,
				},
				{
					id: "color",
					flag: ["color"],
					match: "option",
					default: undefined,
				},
			],
		});
	}
	public async exec(message: Message, args: { name?: string, color?: string }): Promise<Message | void> {

		console.log(args);
		message.channel.send(JSON.stringify(args, undefined, " "));

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

		message.channel.send(JSON.stringify(res, undefined, " "));


		// if (!args.color && !args.color) {


		// 	const myRole = guild.roles.cache.get(res)!;

		// 	const embed = new MessageEmbed()
		// 		.setAuthor(`Current role assigned to ${message.author.username}`, guild.iconURL({ size: 2048, dynamic: true, format: "png" || "gif" })
		//             || message.author.displayAvatarURL({ size: 2048, dynamic: true, format: "png" || "gif" }))
		// 		.setColor(myRole.hexColor)
		// 		.addField("Name", `${myRole.name}`, true)
		// 		.addField("Colour", `${myRole.hexColor}`, true);

		// 	message.channel.send(embed);
		// }
		// else {

		// 	const myRole = guild.roles.cache.get(res);

		// 	if (!myRole) {
		// 		userRoles.delete(`${guild.id}.${res[0]}`);
		// 		return message.channel.send(embedFail("You do not have a role!"));
		// 	}

		// 	if (args.name) {
		// 		await myRole.setName(args.name);
		// 		await message.channel.send(await embedSuccess(`You have changed ${myRole.name}'s name to ${args.name}!`));
		// 	}

		// 	if (args.color) {
		// 		const hexCode = args.color,
		// 			oldHex = myRole.hexColor;
		// 		await myRole.setColor(hexCode);
		// 		await message.channel.send(await embedSuccess(`You have changed ${myRole.name}'s color from ${oldHex} to #${hexCode}!`));
		// 	}

		// }
	}
}