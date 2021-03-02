require('discord.js');
const fs = require('fs');

function getServerFile(id){
    let srcDir = __dirname.split('\\')
    srcDir.pop()
    srcDir = srcDir.join('\\')
    return JSON.parse(fs.readFileSync(srcDir+'/data/servers/'+id+'.json'));
};

function on_run(msg,args,argsStr){
    switch (args[0]) {
        case "view":
            msg.channel.send('```json\n'+JSON.stringify(getServerFile(msg.guild.id).bot_api, null, '  ')+'```');
            break;
        default:
            msg.channel.send(`Unknown botapi argument, ${args[0]}`).then(sentMsg => {
                sentMsg.delete({timeout:7500});
            });
    };
};

const aliases = ['bapi'];
module.exports = {aliases, on_run};