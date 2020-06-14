module.exports = {
    name: "die",
    description: "Turn bot off, then turn it back on.",
    execute(message) {
    if (message.member.hasPermission('ADMINISTRATOR')) {
    // send channel a message that you're resetting bot.
    message.channel.send('Shutting down :(')
      .then(() => console.log('Shutting down'))
      .then(() => process.exit(1));
    }
    },
}