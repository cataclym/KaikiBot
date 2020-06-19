module.exports = {
    name: 'exclude',
    description: 'Adds or removes excluded role from user.',
    execute(message) {   
        const specialString = require("../storage/names.json");
            if (!message.member.roles.cache.find(r => r.name === specialString.name)) {
            const excludedRole = specialString.name
            message.member.roles.add(message.guild.roles.cache.find(r => r.name === specialString.name))
            message.channel.send(`Added role\`${excludedRole}\`.\nType the command again to remove.`);
        }
            else if (message.member.roles.cache.find(r => r.name === specialString.name)) {
            const excludedRole = specialString.name
            message.member.roles.remove(message.guild.roles.cache.find(r => r.name === specialString.name))
            message.channel.send(`Removed role \`${excludedRole}\`.\nType the command again to add it back.`);
            }
    },
};
