const aliases = ['help', '?', 'h'];
const description = 'Displays the information for available commands';
const usage = 'help';
const permissions = [];


require('discord.js');
const { cmds, getServerFile, appendObj, baseCmd } = require('../global');

function on_run(msg, args, argsStr) {
    let helpMsg = '';
    const permissions = msg.guild.member(msg.author).permissionsIn(msg.channel).toArray();
    for (let i = 0; i < cmds().length; ++i) {
        let cmd = cmds()[i];
        let hasPermission = true;
        if (cmd.permissions.length >= 0) for (let i in cmd.permissions){
            let permission = cmd.permissions[i];
            if (!permissions.includes(permission)) hasPermission = false;
        }
        if (hasPermission) {
            helpMsg = helpMsg + `\`${cmd.aliases[0]} (${cmd.aliases.slice(1)}) - ${cmd.description}\`\n\`\`\`md\n${cmd.usage}\`\`\`\n\n`;
        }
    }
    msg.channel.send('',{
        split: true,
        embed: {
            title: 'Commands',
            description: helpMsg,
            color:  "faff54"
        }
    });

    let custHelpMsg = '';
    for (let key in getServerFile(msg.guild.id).bot_api.cmds) {
        let cmd = getServerFile(msg.guild.id).bot_api.cmds[key];
        appendObj(cmd, baseCmd);
        let hasPermission = true;
        if (cmd.permissions.length >= 0) for (let i in cmd.permissions){
            let permission = cmd.permissions[i];
            if (!permissions.includes(permission)) hasPermission = false;
        }
        if (hasPermission) {
            custHelpMsg = custHelpMsg + `\`${key} (${cmd.aliases}) - ${cmd.description}\`\n\`\`\`md\n${cmd.usage}\`\`\`\n\n`;
        }
    }
    msg.channel.send('',{
        split: true,
        embed: {
            title: 'Custom Commands',
            description: custHelpMsg,
            color:  "faff54"
        }
    });
}

module.exports = { aliases, description, usage, permissions, on_run }