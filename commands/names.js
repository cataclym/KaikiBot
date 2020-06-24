const { MessageEmbed } = require('discord.js');
const { UserNickTable } = require('../functions/functions.js');
const { prefix } = require('../config.json');

module.exports = {
  name: 'names',
  aliases: ['checknames', 'getnames', 'name'],
  description: 'Returns all your daddy nicknames',
  // args: true,
  usage: '@someone',
  execute(message, args) {
    // eslint-disable-next-line no-unused-vars
    function getUserFromMentionRegEx(mention) {
      if (!mention) return;
      const matches = mention.match(/^<@!?(\d+)>$/);
      // The id is the first and only match found by the RegEx.
      // However the first element in the matches array will be the entire mention, not just the ID,
      // so use index 1.
      const id = matches[1];
      return message.guild.members.cache.get(id);
    }
    const user = getUserFromMentionRegEx(args[0]);

    if (!UserNickTable.has(`usernicknames.${message.author.id}`)) {
      UserNickTable.push(`usernicknames.${message.member.id}`, message.author.username);
    }
    if (args) {
      const av = message.mentions.users.first();
      if (typeof av !== 'undefined') {
        if (!UserNickTable.has(`usernicknames.${av.id}`)) {
          UserNickTable.push(`usernicknames.${av.id}`, av.username);
        }
      }
    }
    const AuthorDBName = UserNickTable.fetch(`usernicknames.${message.author.id}`);
    // Makes it look cleaner
    let StringsAuthorDBName = AuthorDBName.toString().substring(0, 2045);
    StringsAuthorDBName = StringsAuthorDBName.replace(/,/g, ', ');
    StringsAuthorDBName += '...';

    const color = message.member.displayColor;

    if (args[0] && !user) {
      return message.reply('Please use a proper mention.');
    }
    const embed = new MessageEmbed()
      .setTitle(`${message.author.username}'s past names`)
      .setAuthor('Daddy will never forget', 'https://cdn.discordapp.com/avatars/714695773534814238/c6b61ba085b7c1ff59716d1238860e0f.png')
      .setColor(color)
      .setDescription('name here')
      .setFooter(`Delete these with ${prefix}delnames`)
      .setTimestamp();
    if (!args[0]) {
      embed.setThumbnail(message.author.displayAvatarURL());
      embed.setDescription(StringsAuthorDBName);
    }
    if (args[0]) {
      const av = message.mentions.users.first();
      const argsDBName = UserNickTable.fetch(`usernicknames.${av.id}`);
      // Makes it look cleaner
      let StringsargsDBName = argsDBName.toString().substring(0, 2045);
      StringsargsDBName = StringsargsDBName.replace(/,/g, ', ');
      StringsargsDBName += '...';
      embed.setDescription(StringsargsDBName);
      embed.setTitle(`${av.username}'s past names`);
      embed.setThumbnail(av.displayAvatarURL());
    }
    const AuthorOrMention = args[0] || message.author;
    if (embed.description.includes(undefined)) {
      embed.setTitle('There is nothing here');
      embed.setDescription(`${AuthorOrMention} may never have had their name changed by me`);
      embed.setFooter('\u200B');
      embed.setAuthor('Oops', 'https://cdn.discordapp.com/avatars/714695773534814238/c6b61ba085b7c1ff59716d1238860e0f.png');
    }

    return message.channel.send(embed);
  },
};
