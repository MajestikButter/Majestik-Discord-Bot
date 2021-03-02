require('discord.js');
const fs = require('fs');
const msgParser = require('./msgParser');

function getServerFile(id){
    return JSON.parse(fs.readFileSync(__dirname+'/data/servers/'+id+'.json'));
};

function errorInvType(msg,location,subject,allowed){
    msg.channel.send(`Error: ${location} | Invalid type '${typeof(subject)}', Allowed Types: ${allowed}`);
};

class triggers{
    cmd(msg,args,argsStr,cmdJson){
        if (cmdJson.delete_sender_msg){
            msg.delete();
        };
        if (cmdJson.response){
            const responses = getServerFile(msg.guild.id).bot_api.responses;
            for (let responseName in responses){
                let response = responses[responseName];
                if (responseName == cmdJson.response){
                    responseEntries(msg,args,argsStr,response);
                };
            };
        } else {
            msg.channel.send('Error: /response/ | No Response found')
        }
    };
};

function requiresSentMsg(msg,args,argsStr,responseJson,botMsg){
    if (responseJson.react_with.length > 0) {
        for (let reactionName in responseJson.react_with){
            let reaction = responseJson.react_with[reactionName];
            switch (reaction.react_to) {
                case "bot":
                    botMsg.react(reaction.id);
                    break;
                case "sender":
                    msg.react(reaction.id);
                    break;
                default:
                    msg.channel.send(`Error: response/react_with/react_to | Unknown 'react_to' entry '${reaction.react_to}'`);
            }
        };
    };
};

function responseEntries(msg,args,argsStr,responseJson){
    if (responseJson.send_text.msg){
        if (typeof(responseJson.send_text) != String) {
            errorInvType(msg,'response/send_text/msg',responseJson.send_text.msg,'String');
            return;
        };
        let sendMsg = msgParser.parse(responseJson.send_text.msg,msg);
        let deleteAfter = 0;
        if (responseJson.send_text.deleteAfter){
            deleteAfter = responseJson.send_text.deleteAfter;
            if (typeof(deleteAfter) != Number && typeof(deleteAfter) != Boolean) {
                errorInvType(msg,'response/send_text/delete_after',responseJson.send_text,'Boolean, Number');
                return;
            };
        }
        const to = responseJson.send_text.to;
        switch (to) {
            case "sender":
                msg.author.send(sendMsg).then(sentMsg => {
                    requiresSentMsg(msg,args,argsStr,responseJson,sentMsg);
                    if (deleteAfter > 0)
                        sentMsg.delete({timeout:deleteAfter});
                });
                break;
            case "channel":
                msg.channel.send(sendMsg).then(sentMsg => {
                    requiresSentMsg(msg,args,argsStr,responseJson,sentMsg);
                    if (deleteAfter > 0)
                        sentMsg.delete({timeout:deleteAfter});
                });
                break;
            default:
                msg.channel.send(`Error: response/send_text/to | Unknown 'to' entry '${to}'`);
        }
        console.log('Attempting to send a message');
    };
    if (responseJson.add_roles.length > 0) {
        console.log('Attempting to add roles');
    };
    if (responseJson.remove_roles.length > 0) {
        console.log('Attempting to remove roles');
    };
};


module.exports = {triggers};