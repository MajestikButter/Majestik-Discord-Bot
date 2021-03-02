require('discord.js');
const fs = require('fs');

function getServerFile(id){
    let srcDir = __dirname.replace('\\commands','').replace('/commands','')
    return JSON.parse(fs.readFileSync(srcDir+'/data/servers/'+id+'.json'));
};

function on_run(msg,args,argsStr){
    switch (args[0]) {
        case "view":
            let serverBotAPI = getServerFile(msg.guild.id).bot_api
            switch (args[1]) {
                case "cmds":
                    msg.channel.send('```json\n'+JSON.stringify(serverBotAPI.cmds, null, '  ')+'```');
                    break;
                case "responses":
                    msg.channel.send('```json\n'+JSON.stringify(serverBotAPI.responses, null, '  ')+'```');
                    break;
                case undefined:
                    msg.channel.send('```json\n'+JSON.stringify(serverBotAPI, null, '  ')+'```');
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
};

const aliases = ['bapi'];
module.exports = {aliases, on_run};