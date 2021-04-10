require('discord.js');

function parse(sending = '', msg, args = [], argsStr = '') {
  parsed = sending.
    replace('${author}', `${msg.author}`).
    replace('${author.username}', `${msg.author.username}`).
    replace('${author.avatar}', `${msg.author.avatarURL({ dynamic: true })}`).
    replace('${author.id}', `${msg.author.id}`).
    replace('${channel}', `${msg.channel}`).
    replace('${channel.id}', `${msg.channel.id}`).
    replace('${message}', `${msg}`).
    replace('${message.id}', `${msg.id}`).
    replace('${guild}', `${msg.guild}`).
    replace('${guild.id}', `${msg.guild.id}`);

  if (args) {
    parsed.replace('${argsStr}', argsStr);
  }

  let splitStr = sending.trim().split(' ');
  for (let i in splitStr) {
    entry = splitStr[i];
    if (!entry.includes('${')) continue;

    if (args) {
      if (entry.includes('arg.')) {
        index = parseInt(entry.replace(/\D/g, ''));
        entry = `${args[index]}`

        parsed = parsed.replace(`\${arg.${index}}`, entry);
      }
    }
  }

  return parsed.replace('$\{', '${');
};
module.exports = { parse };