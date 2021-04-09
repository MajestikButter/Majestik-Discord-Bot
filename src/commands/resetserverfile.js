const aliases = ['resetserverfile','rsf'];
const description = "Resets this server's data file";
const usage = 'rsf';
const permissions = ['MANAGE_GUILD'];


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

module.exports = { aliases, description, usage, permissions, on_run };