const db = require('quick.db');
const { UserNickTable } = require('../functions/functions.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "names",
    aliases: ['checknames','getnames'],
    description: "Returns all your daddy nicknames",
    //args: true,
    usage: '@someone',
    execute(message, args) {

        let color = message.member.displayColor
        function getUserFromMention(mention) {
            if (!mention) return;
        
            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);
        
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
                return message.guild.members.cache.get(mention);
            }
        }
        const user = getUserFromMention(args[0]);

        if (args[0] && !user) {
            return message.reply('Please use a proper mention.');
        }        
             
        const argsDBName = UserNickTable.fetch(`usernicknames.${args[0]}`);
        const AuthorDBName = UserNickTable.fetch(`usernicknames.${message.member}`);
        
        const embed = new MessageEmbed()
            .setTitle('Daddy will never forget')
            .setDescription(`${args[0]}'s past names\n${argsDBName}`)
            .setColor(color)

        if (!args[0]){
            embed.setDescription(`${message.member}'s past names\n${AuthorDBName}`);
        }    
        /*if (argsDBName !== undefined || AuthorDBName !== undefined) {
            embed.setDescription(`There is nothing here\nOutput: ${args[0]}, ${message.member}`)
        }*/
            
        return message.channel.send(embed);
        },
}