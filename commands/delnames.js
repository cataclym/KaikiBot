const { UserNickTable } = require('../functions/functions.js');

module.exports = {
  name: 'delnames',
  aliases: ['deletenames', 'namedel', 'namedelete'],
  description: 'Deletes ALL your nicknames.',
  args: false,
  // usage: '',
  execute(message) {
    if (UserNickTable.delete(`usernicknames.${message.member.id}`)) {
      message.channel.send(`Deleted all of ${message.member}'s nicknames.\nWell done, you made daddy forget.`);
      UserNickTable.push(`usernicknames.${message.member.id}`, message.author.username);
    } else {
      message.channel.send('That didn`t work');
    }
  },
};
