const { Command } = require("discord-akairo");
const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const leaveRoleTable = new db.table("leaveRoleTable");

module.exports = class RestoreUserRoles extends Command {
	constructor() {
		super("restore", {
			id: "restore",
			aliases: ["restore"],
			userPermissions: "ADMINISTRATOR" | "MANAGE_ROLES",
			description: { description: "Restores roles for a user who has previously left the server.", usage: "@dreb" },
			args: [
				{
					id: "member",
					type: "member",
					prompt: {
						start: "Specify a member?",
						retry: "I-I-Invalid member! Try again.",
					},
				},
			],
		});
	}
	async exec(message, args) {
		if (leaveRoleTable.get(`${args.member.guild.id}.${args.member.id}`)) {
			const savedRoles = leaveRoleTable.get(`${args.member.guild.id}.${args.member.id}`);
			args.member.roles.add(savedRoles);
			return message.util.send(new MessageEmbed().setColor("#14eb00").setDescription(`Restored roles of ${args.member.user.tag}`));
		}
		else {
			return message.util.send(new MessageEmbed().setColor("#e60000").setDescription("This user's roles have not been saved, or user has never left the guild."));
		}
	}
};