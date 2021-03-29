require('discord.js');
const fs = require('fs');
const rootDir = __dirname.replace('\\src\\commands', '').replace('/src/commands', '');
const serverDataDir = rootDir + '/data/servers/';

function on_run(msg, args, argsStr) {
    let id = msg.guild.id;
    let template = fs.readFileSync(serverDataDir + '.template');
    fs.writeFileSync(serverDataDir + id + '.json', template);

    msg.channel.send(`Reset this server's data file`);
}

const aliases = ['rsf'];
module.exports = { aliases, on_run };