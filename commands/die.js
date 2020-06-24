const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'die',
  description: 'Turn bot off, then turn it back on.',
  execute(message) {
    const color = message.member.displayColor;
    const embed = new MessageEmbed({
      title: 'Shutting down now! 😦',
      color,
    });
    if (message.member.hasPermission('ADMINISTRATOR')) {
      // send channel a message that you're resetting bot.
      message.channel.send(embed)
        .then(() => console.log('Shutting down'))
        .then(() => process.exit(1));
    }
  },
};
