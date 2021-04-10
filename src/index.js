require('dotenv').config();
const fs = require('fs');
const botAPI = require('./botAPI');
const botTriggers = new botAPI.triggers()
const msgParser = require('./msgParser');

const { Client } = require('discord.js');
const { cmds, serverDataDir, getServerFile, getPrefix, appendObj, baseCmd } = require('./global');
const bot = new Client();


bot.on('message', (msg) => {
    if (!msg.guild) return;
    if (getServerFile(msg.guild.id) == null) {
        let template = fs.readFileSync(serverDataDir + '.template');
        fs.writeFileSync(serverDataDir + msg.guild.id + '.json', template);
    }

    const prefix = getPrefix(msg.guild);
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.substring(prefix.length).trim().split(' ');
    const msgCmd = args.shift().toLowerCase();
    const argsStr = msg.content.substring(prefix.length + msgCmd.length).trim();
    const permissions = msg.guild.member(msg.author).permissionsIn(msg.channel).toArray();

    let invalid = true;
    cmds().forEach(cmd => {
        if (cmd.aliases.indexOf(msgCmd) >= 0) {
            let hasPermission = true;
            if (cmd.permissions.length >= 0) for (let i in cmd.permissions) {
                let permission = cmd.permissions[i];
                if (!permissions.includes(permission)) hasPermission = false;
            }
            if (hasPermission) {
                cmd.on_run(msg, args, argsStr);
            } else msg.channel.send('Missing Required Permissions').then(sentMsg => { sentMsg.delete({ timeout: 2000 }) });
            invalid = false;
        }
    });

    if (!invalid)
        return;

    const customCmds = getServerFile(msg.guild.id).bot_api.cmds;
    for (let cmdName in customCmds) {
        let cmd = customCmds[cmdName];
        appendObj(cmd, baseCmd);
        if (cmd.aliases.indexOf(msgCmd) >= 0 || cmdName == msgCmd) {
            let hasPermission = true;
            if (cmd.permissions.length >= 0) for (let i in cmd.permissions) {
                let permission = cmd.permissions[i];
                if (!permissions.includes(permission)) hasPermission = false;
            }
            if (hasPermission) {
                botTriggers.cmd(msg, args, argsStr, cmd);
            } else {
                msg.channel.send('Missing Required Permissions').then(sentMsg => { sentMsg.delete({ timeout: 2000 }) });
            }
            invalid = false;
        }
    }

    if (invalid)
        msg.channel.send('Invalid Command').then(sentMsg => { sentMsg.delete({ timeout: 2000 }) });
});

bot.on('guildCreate', (guild) => {
    if (getServerFile(guild.id) != null) return;

    let template = fs.readFileSync(serverDataDir + '.template');
    fs.writeFileSync(serverDataDir + guild.id + '.json', template);
});

bot.on('ready', () => {
    console.log(`-------------\n[Logged in]\nUsername: ${bot.user.username}\nID: ${bot.user.id}\n-------------`);
});

bot.login(process.env.TOKEN);




const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('ok');
});
server.listen(3000);