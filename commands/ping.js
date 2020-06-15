module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message) {
            message.channel.send(`Ping took ${Math.round(message.client.ws.ping)} ms`);
	},
};