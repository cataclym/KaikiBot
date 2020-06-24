const Discord = require('discord.js');
const { prefix } = require('../config.json');
const { version } = require('../package.json');

module.exports = {
  name: 'help',
  description: 'Shows command info',
  aliases: ['commands', 'commandlist', 'commandslist', 'cmds'],
  execute(message) {
    const color = message.member.displayColor;
    const embed = new Discord.MessageEmbed({
      title: 'List of commands for Nadeko Sengoku',
      description: `Prefix is currently set to \`${prefix}\``,
      author: {
        name: `Nadeko Sengoku Bot v${version}`,
        url: 'https://github.com/cataclym/nadekosengokubot',
        icon_url: message.author.displayAvatarURL(),
      },
      color,
      fields: [
        {
          name: `${prefix}Help`,
          value: `List of commands for ${message.client.username}.`,
          inline: true,
        },
        {
          name: `${prefix}Die`,
          value: 'Shuts down the bot.\nRestarts if it is running under PM2.',
          inline: true,
        },
        {
          name: `${prefix}Ping`,
          value: 'Ping the bot to see if there are latency issues.',
          inline: true,
        },
        {
          name: `${prefix}Dadjoke`,
          value: 'Returns a dadjoke.',
          inline: true,
        },
        {
          name: `${prefix}Exclude`,
          value: 'Adds or removes excluded role from user.',
          inline: true,
        },
        {
          name: `${prefix}Yeet`,
          value: 'Returns yeet...',
          inline: true,
        },
        {
          name: `${prefix}Yeetkids`,
          value: 'Returns some more yeet...',
          inline: true,
        },
        {
          name: `${prefix}Send`,
          value: 'Returns your message.',
          inline: true,
        },
        {
          name: `${prefix}cmds`,
          value: 'List of all commands and aliases.',
          inline: true,
        },
      ],
      footer: {
        text: 'Made by Cata <3',
      },
    });
    message.channel.send(embed);
  },
};
