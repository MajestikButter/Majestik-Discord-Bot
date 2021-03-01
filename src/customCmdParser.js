require('discord.js');
const msgParser = require('./msgParser');

function on_run(msg,args,argsStr,cmdJson){
    if (cmdJson.add_roles.length > 0) {
        console.log('Attempting to add roles');
    };
    if (cmdJson.remove_roles.length > 0) {
        console.log('Attempting to remove roles');
    };
    if (cmdJson.react_with.length > 0) {
        console.log('Attempting to react');
    };
    if (cmdJson.send_text){
        let sendMsg = msgParser.parse(cmdJson.send_text.msg,msg);
        let deleteAfter = 0;
        if (cmdJson.send_text.deleteAfter){
            deleteAfter = cmdJson.send_text.deleteAfter;
        }
        const to = cmdJson.send_text.to;
        switch (to) {
            case "sender":
                msg.author.send(sendMsg).then(sentMsg => {
                    if (deleteAfter > 0)
                        sentMsg.delete({timeout:deleteAfter});
                });
                break;
            case "channel":
                msg.channel.send(sendMsg).then(sentMsg => {
                    if (deleteAfter > 0)
                        sentMsg.delete({timeout:deleteAfter});
                });
                break;
            default:
                msg.channel.send(`Error: Unknown 'to' entry '${to}'`);
        }
        console.log('Attempting to send a message');
    };
    if (cmdJson.delete_sender_msg){
        console.log('Attempting to delete incoming message');
    };
};

module.exports = {on_run};