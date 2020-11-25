import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class MyRoleCommand extends Command {
	constructor() {
		super("myrole", {
			aliases: ["myrole"],
			description: {
				description: "Checks your assigned user role. Add a hexcode to change the colour.",
				usage: "name/color FF0000",
			},
		});
	}
	public async exec(message: Message, args): Promise<Message> {
    
        const query = bot.db;    
    
        function embedFail(text) {
            let embed = new Discord.RichEmbed()
        .setColor("#ff0000")
        .setDescription(text);
    
        return embed
        }
    
        function embedSuccess(text) {
            let embed = new Discord.RichEmbed()
        .setColor("#7CFC00")
        .setDescription(text);
    
        return embed
        }
    
    
        let res = await query(`SELECT * FROM user_roles WHERE guild_id = '${message.guild.id}' AND user_id = '${message.author.id}'`)
    
            if(!args[0]) {
    
            if(!res[0]) return message.channel.send(embedFail("You do not have a role!"));
    
            let myRole = message.guild.roles.get(res[0].role_id);
    
            let assignNames = "";
            let embed = new Discord.RichEmbed()
            .setAuthor(`Current role assigned to ${message.author.username}`, message.guild.iconURL)
            .setColor(myRole.hexColor)
            .addField(`Name`, `${myRole.name}`, true)
            .addField(`Colour`,`${myRole.hexColor}`, true);
    
            message.channel.send(embed);
            }
        else {

            if(!res[0]) return message.channel.send(embedFail("You do not have a role!"));

            let myRole = message.guild.roles.get(res[0].role_id);
            if(!myRole) {
                await query(`DELETE FROM user_roles where guild_id = '${message.guild.id}' AND role_id = '${res[i].role_id}' and user_id = '${res[i].user_id}'`);
                return message.channel.send(embedFail("You do not have a role!"));
            }

		switch (args[0]) {
			case "name":
				const name = args.slice(1).join(" "),
					oldName = myRole.name;
				await myRole.setName(name);
				await message.channel.send(embedSuccess(`You have changed ${oldName}'s name to ${name}!`));
				break;

			case "color":
			case "color":
				const hexCode = args[1],
					oldHex = myRole.hexColor;
				await myRole.setColor(hexCode);
				await message.channel.send(embedSuccess(`You have changed ${myRole.name}'s color from ${oldHex} to #${hexCode}!`));
				break;
		}

	}
}