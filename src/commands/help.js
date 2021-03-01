require('discord.js');
require('fs');

function on_run(msg,args,argsStr){
    helpMsg = `a
b
c
d
e`
    msg.channel.send(helpMsg)
};

const aliases = ['help','?'];
module.exports = {aliases,on_run};