require('dotenv').config();
const fs = require('fs');
const botAPI = require('./botAPI');
const botTriggers = new botAPI.triggers()
const msgParser = require('./msgParser');

const { Client } = require('discord.js');
const bot = new Client();
const rootDir = __dirname.replace('\\src', '').replace('/src', '');
const serverDataDir = rootDir + '/data/servers/';


function getServerFile(id) {
    let path = serverDataDir + id + '.json'
    try {
        fs.accessSync(path, fs.constants.F_OK);

        let serverObject = JSON.parse(fs.readFileSync(path));
        return serverObject;
    } catch (err) {
        return null;
    }
}

function getPrefix(guild) {
    let serverObject = getServerFile(guild.id);
    return serverObject.prefix;
}

let cmds = []

function loadCmds() {
    const cmdFileNames = fs.readdirSync(__dirname + '/commands/');
    cmdFileNames.forEach(fileName => {
        currCmd = require('./commands/' + fileName);
        cmds.push(currCmd);
    });
}

loadCmds();

bot.on('message', (msg) => {
    if (getServerFile(msg.guild.id) == null){
        let template = fs.readFileSync(serverDataDir + '.template');
        fs.writeFileSync(serverDataDir + msg.guild.id + '.json', template);
    };

    const prefix = getPrefix(msg.guild);
    if (!msg.content.startsWith(prefix)) return;

    const args = msg.content.substring(prefix.length).trim().split(' ');
    const msgCmd = args.shift().toLowerCase();
    const argsStr = msg.content.substring(prefix.length + msgCmd.length).trim();

    let invalid = true;
    cmds.forEach(cmd => {
        if (cmd.aliases.indexOf(msgCmd) >= 0) {
            cmd.on_run(msg, args, argsStr);
            invalid = false;
        }
    });

    if (invalid == false)
        return;

    const customCmds = getServerFile(msg.guild.id).bot_api.cmds;
    for (let cmdName in customCmds) {
        let cmd = customCmds[cmdName];
        if (cmd.aliases.indexOf(msgCmd) >= 0 || cmdName == msgCmd) {
            botTriggers.cmd(msg, args, argsStr, cmd);
            invalid = false;
        }
    }

    if (invalid == true)
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