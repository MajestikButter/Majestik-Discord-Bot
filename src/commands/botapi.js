require('discord.js');
const fs = require('fs');
const rootDir = __dirname.replace('\\src\\commands', '').replace('/src/commands', '');
const serverDataDir = rootDir + '/data/servers/';

function getServerFile(id){
    return JSON.parse(fs.readFileSync(serverDataDir+id+'.json'));
};

function on_run(msg,args,argsStr){
    switch (args[0]) {
        case "view":
            let serverBotAPI = getServerFile(msg.guild.id).bot_api
            switch (args[1]) {
                case "cmds":
                    msg.channel.send('```\n-----=[ Commands ]=-----```\n```json\n'+JSON.stringify(serverBotAPI.cmds, null, '  ')+'```');
                    break;
                case "responses":
                    msg.channel.send('```\n-----=[ Responses ]=-----```\n```json\n'+JSON.stringify(serverBotAPI.responses, null, '  ')+'```');
                    break;
                case undefined:
                    msg.channel.send('```\n-----=[ All ]=-----```\n```json\n'+JSON.stringify(serverBotAPI, null, '  ')+'```');
                    break;
                default:
                    msg.channel.send(`Unknown botapi argument '${args[1]}'`).then(sentMsg => {
                        sentMsg.delete({timeout:7500});
                    });
            };
            break;
        default:
            msg.channel.send(`Unknown botapi argument '${args[0]}'`).then(sentMsg => {
                sentMsg.delete({timeout:7500});
            });
    };
    msg.delete({timeout:500});
};

const aliases = ['bapi'];
module.exports = {aliases, on_run};