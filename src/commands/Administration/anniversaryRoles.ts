import { Guild, Message, MessageEmbed } from "discord.js";
import { Command } from "@cataclym/discord-akairo";
import { checkBirthdayOnAdd } from "../../nsb/AnniversaryRoles.js";
import { noArgGeneric } from "../../nsb/Embeds";
import { getGuildDB } from "../../struct/db.js";
import { IGuild } from "../../interfaces/db.js";

type values = "enable" | "true" | "disable" | "false";
const values: values[] = ["enable", "true", "disable", "false"];

export default class AnniversaryRolesConfigCommand extends Command {
	constructor() {
		super("config-anniversary", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "value",
					type: values,
					otherwise: (message: Message) => noArgGeneric(message),
				},
			],
		});
	}
	public async exec(message: Message, { value }: { value: values }): Promise<IGuild> {
		const guildID = (message.guild as Guild).id,
			db = await getGuildDB(guildID),
			boolean = db.settings.anniversary,
			embed = new MessageEmbed()
				.withOkColor(message);

		switch (value) {
			case ("enable"):
			case ("true"): {
				if (!boolean) {
					db.settings.anniversary = true;
					checkBirthdayOnAdd(message.guild as Guild);
					message.channel.send(embed.setDescription(`Anniversary-roles functionality has been enabled in ${message.guild?.name}!`));
				}
				else {
					message.channel.send(embed.setDescription("You have already enabled Anniversary-roles."));
				}
				break;
			}
			case ("disable"):
			case ("false"): {
				if (boolean) {
					db.settings.anniversary = false;
					message.channel.send(embed.setDescription(`Anniversary-roles functionality has been disabled in ${message.guild?.name}!`));
				}
				else {
					message.channel.send(embed.setDescription("You have already disabled Anniversary-roles."));
				}
			}
		}
		db.markModified("settings.anniversary");
		return db.save();
	}
}