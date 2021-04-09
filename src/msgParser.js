require('discord.js');

function parse(sending, msg) {
    parsed = sending.
    replace('${author}', `${msg.author}`).
    replace('${author.username}', `${msg.author.username}`).
    replace('${author.avatar}', `${msg.author.avatarURL({dynamic: true})}`).
    replace('${author.id}', `${msg.author.id}`).
    replace('${channel}', `${msg.channel}`).
    replace('${channel.id}', `${msg.channel.id}`).
    replace('${message}', `${msg}`).
    replace('${message.id}', `${msg.id}`).
    replace('${guild}', `${msg.guild}`).
    replace('${guild.id}', `${msg.guild.id}`).
    replace('$\{', '${');
    return parsed;
};
module.exports = { parse };