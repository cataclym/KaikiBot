const { prefix } = require('../config.json');
module.exports = {
    name: "test",
    description: "",
    //args: false,
    usage: `${prefix}test`,
    execute(message, args) {
message.channel.send(`${args[0]} and ${message.member}`);
        }
    ,
}

