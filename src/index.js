require('dotenv').config();
const fs = require('fs');
const importModules = require('import-modules');

const { Client } = require('discord.js');
const bot = new Client();

let cmds = []

function getPrefix(guild){
    const filePath = __dirname +'/data/servers/'+guild.id+'.json';
    const content = fs.readFileSync(filePath, 'utf8');
    serverObject = JSON.parse(content);
    return serverObject.prefix;
};

function loadCmds(){
    const cmdFileNames = fs.readdirSync(__dirname+'/commands/');
    cmdFileNames.forEach(fileName => {
        currCmd = require('./commands/'+fileName);
        cmds.push(currCmd);
    });
};

loadCmds();

bot.on('message', (msg) => {
    const prefix = getPrefix(msg.guild);
    if (!msg.content.startsWith(prefix))
        return;

    const args = msg.content.substring(prefix.length).trim().split(' ')
    const msgCmd = args.shift().toLowerCase()
    const argsStr = msg.content.substring(prefix.length+msgCmd.length).trim()

    cmds.forEach(cmd => {
        if (cmd.aliases.indexOf(msgCmd) >= 0) {
            cmd.on_run(msg,args,argsStr)
        } else {
            msg.channel.send('Invalid Command').then(sentMsg => {sentMsg.delete({timeout:2000})});
            return;
        };
    });
});

bot.on('ready', () => {
    console.log(`-------------\n[Logged in]\nUsername: ${bot.user.username}\nID: ${bot.user.id}\n-------------`)
});

bot.login(process.env.TOKEN);