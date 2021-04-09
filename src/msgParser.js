require('discord.js');

function parse(sending, msg) {
    parsed = sending.
    replace('${sender}', `${msg.author}`).
    replace('${channel}', `${msg.channel}`).
    replace('${guild}', `${msg.guild}`).
    replace('$\{', '${');
    return parsed;
};
module.exports = { parse };