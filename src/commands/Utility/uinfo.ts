import Discord from "discord.js";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { GuildMember } from "discord.js";
import { Role } from "discord.js";
const flags: any = {
	DISCORD_EMPLOYEE: "Discord Employee 👨‍💼",
	DISCORD_PARTNER: "Discord Partner ❤️",
	BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1) 🐛",
	BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2) 🐛",
	HYPESQUAD_EVENTS: "HypeSquad Events 🎊",
	HOUSE_BRAVERY: "House of Bravery 🏠",
	HOUSE_BRILLIANCE: "House of Brilliance 🏠",
	HOUSE_BALANCE: "House of Balance 🏠",
	EARLY_SUPPORTER: "Early Supporter 👍",
	TEAM_USER: "Team User 🏁",
	SYSTEM: "System ⚙️",
	VERIFIED_BOT: "Verified Bot ☑️",
	VERIFIED_DEVELOPER: "Verified Bot Developer ✅",
};

module.exports = class UserInfoCommand extends Command {
	constructor() {
		super("uinfo", {
			cooldown: 5000,
			aliases: ["user", "uinfo"],
			description: { description: "Shows relevant user info", usage: "<user>" },
			args: [{
				id: "member",
				type: "member",
				default: (message: Message) => message.member,
			}],

		});
	}
	public async exec(message: Message, { member }: { member: GuildMember}): Promise<Message> {
		const userFlags = member.user.flags ? member.user.flags.toArray() : [], color = member.displayColor,
			embed = new Discord.MessageEmbed()
				.setColor(color)
				.setDescription(member.displayName)
				.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
				.setTitle(member.user.tag)
				.addFields([
					{ name: "ID", value: member.user.id, inline: true },
					{
						name: "Account date/Join date",
						value: member.user.createdAt.toDateString() + "\n" + member.joinedAt?.toDateString(),
						inline: true,
					},
					{
						name: "Presence",
						value: (member.user?.presence?.activities?.length ? member.user?.presence?.activities.join(", ") : "N/A") + "\n" + (member.user.presence.status !== "offline" ? Object.entries(member.user.presence.clientStatus as any).join(", ") : "Offline"),
						inline: true,
					},
					{
						name: "Flags",
						value: userFlags.length ? userFlags.map((flag: string) => flags[flag]).join("\n") : "None",
						inline: true,
					},
					{
						name: "Roles (" + member.roles.cache.size + ")",
						value: member.roles.cache.array().sort((a: Role, b: Role) => b.position - a.position || (b.id as unknown as number) - (a.id as unknown as number)).slice(0, 10).join("\n"),
						inline: true,
					}],
				);
		member.lastMessage ? embed.addField("Last (seen) message", member.lastMessage?.createdAt.toLocaleString(), true) : null;
		member?.premiumSince ? embed.addField("Boosting", "Since " + member.premiumSince.toDateString() + " ✅", true) : null;
		member.user.bot ? embed.addField("Bot", "✅", true) : null;
		return message.channel.send(embed);
	}
};