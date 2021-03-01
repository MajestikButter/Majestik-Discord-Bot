require('discord.js');

function on_run(msg,args,argsStr){
    helpMsg = `a
b
c
d
e`
    msg.channel.send(helpMsg)
};

const aliases = ['help','?','h'];
module.exports = {aliases, on_run};