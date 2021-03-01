require('dotenv').config();
const fs = require('fs');
const custom_cmd_parser = require('./customCmdParser');
const msgParser = require('./msgParser');

const { Client } = require('discord.js');
const bot = new Client();

function getPrefix(guild){
    const filePath = __dirname +'/data/servers/'+guild.id+'.json';
    const content = fs.readFileSync(filePath, 'utf8');
    serverObject = JSON.parse(content);
    return serverObject.prefix;
};

function getServerFile(id){
    return JSON.parse(fs.readFileSync(__dirname+'/data/servers/'+id+'.json'));
}

let cmds = []

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

    const args = msg.content.substring(prefix.length).trim().split(' ');
    const msgCmd = args.shift().toLowerCase();
    const argsStr = msg.content.substring(prefix.length+msgCmd.length).trim();

    cmds.forEach(cmd => {
        if (cmd.aliases.indexOf(msgCmd) >= 0) {
            cmd.on_run(msg,args,argsStr)
            return;
        };
    });
    
    const custom_cmds = getServerFile(msg.guild.id).custom_cmds;
    for (let cmdName in custom_cmds){
        let cmd = custom_cmds[cmdName];
        if (cmd.aliases.indexOf(msgCmd) >= 0 || cmdName == msgCmd){
            custom_cmd_parser.on_run(msg,args,argsStr,cmd);
            return;
        };
    };
    
    msg.channel.send('Invalid Command').then(sentMsg => {sentMsg.delete({timeout:2000})});
});

bot.on('ready', () => {
    console.log(`-------------\n[Logged in]\nUsername: ${bot.user.username}\nID: ${bot.user.id}\n-------------`);
});

bot.login(process.env.TOKEN);