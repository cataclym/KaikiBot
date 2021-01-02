import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, Guild } from "discord.js";
import { errorColor, trim } from "../../nsb/Util";
import DB from "quick.db";
import { resolveColor } from "../../nsb/Color";
const userRoles = new DB.table("userRoles");

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
	public async exec(message: Message, { name, color }: { name?: string, color?: string }): Promise<Message | void> {

		const guild = (message.guild as Guild);

		const embedFail = async (text?: string) => {
			return new MessageEmbed()
				.setColor(errorColor)
				.setDescription(text ?? "You do not have a role!");
		};

		const embedSuccess = async (text: string) => {
			return new MessageEmbed()
				.setColor(await message.getMemberColorAsync())
				.setDescription(text);
		};

		const res = userRoles.get(`${message.guild?.id}.${message.author.id}`);

		if (!res) return message.channel.send(await embedFail());

		const myRole = guild.roles.cache.get(res[0]);
		name = name?.slice(5);

		if (name || color) {

			if (!myRole) {
				userRoles.delete(`${guild.id}.${res[0]}`);
				return message.channel.send(await embedFail());
			}

			const botRole = message.guild?.me?.roles.highest;
			const isPosition = botRole?.comparePositionTo(myRole);

			if (isPosition && isPosition <= 0) return message.channel.send(await embedFail("This role is higher than me, I cannot edit this role!"));

			if (name) {
				const oldName = myRole.name;
				await myRole.setName(trim(name, 32));
				await message.channel.send(await embedSuccess(`You have changed ${oldName}'s name to ${name}!`));
			}

			if (color) {
				const hexCode = await resolveColor(color),
					oldHex = myRole.hexColor;
				await myRole.setColor(hexCode);
				await message.channel.send(await embedSuccess(`You have changed ${myRole.name}'s color from ${oldHex} to ${hexCode}!`));
			}
		}

		else {
			if (!myRole) {
				userRoles.delete(`${guild.id}.${res[0]}`);
				return message.channel.send(await embedFail());
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