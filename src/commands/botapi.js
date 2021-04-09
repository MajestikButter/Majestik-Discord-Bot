const aliases = ['botapi', 'bapi'];
const description = 'Used to access the bot API JSON entry for your server';
const usage = `bapi view [section]
bapi edit <section> <entryName> <newJSON>
bapi new <section> <entryName> <JSON>
bapi delete <section> <entryName>`;
const permissions = ['MANAGE_GUILD'];


require('discord.js');
const fs = require('fs');
const { getServerFile, serverDataDir } = require('../global');

function isJson(string) {
  try {
    if (JSON.parse(string)) return true;
  } catch {
    return false;
  }
}

function unknown(msg, arg) {
  msg.channel.send(`Unknown botapi argument \`${arg}\``);
}

function updateBotAPI(botAPIObj, msg) {
  let newServerFile = getServerFile(msg.guild.id);
  newServerFile.bot_api = botAPIObj;
  fs.writeFileSync(serverDataDir + msg.guild.id + '.json', JSON.stringify(newServerFile, null, '  '));
}


function on_run(msg, args, argsStr) {
  let serverBotAPI = getServerFile(msg.guild.id).bot_api
  switch (args[0]) {
    case "view":
      switch (args[1]) {
        case "cmds":
          msg.channel.send('', {
            split: true,
            embed: {
              title: 'Commands',
              description: `\`\`\`json\n${JSON.stringify(serverBotAPI.cmds, null, '  ')}\`\`\``
            }
          });
          break;
        case "responses":
          msg.channel.send('', {
            split: true,
            embed: {
              title: 'Responses',
              description: `\`\`\`json\n${JSON.stringify(serverBotAPI.responses, null, '  ')}\`\`\``
            }
          });
          break;
        case undefined:
          msg.channel.send('', {
            split: true,
            embed: {
              title: 'All',
              description: `\`\`\`json\n${JSON.stringify(serverBotAPI, null, '  ')}\`\`\``
            }
          });
          break;
        default:
          unknown(msg, args[1]);
      }
      break;
    case "edit":
      switch (args[1]) {
        case "cmds":
          if (serverBotAPI.cmds[args[2]]) {
            let newJson = argsStr.slice(args[0].length + args[1].length + args[2].length + 3); //                          m;bapi edit cmds test {}
            if (isJson(newJson)) {
              newJson = JSON.parse(newJson);
              serverBotAPI.cmds[args[2]] = newJson;
              updateBotAPI(serverBotAPI, msg);
              msg.channel.send('', {
                embed: {
                  title: `Updated ${args[1]}/${args[2]}`,
                  description: '```json\n' + JSON.stringify(newJson, null, '  ') + '```'
                }
              });
            } else unknown(msg, `\`\`json\n${newJson}\`\``);
          } else unknown(msg, args[2]);
          break;
        case "responses":
          if (serverBotAPI.responses[args[2]]) {
            let newJson = argsStr.slice(args[0].length + args[1].length + args[2].length + 3); //                          m;bapi edit responses test {}
            if (isJson(newJson)) {
              newJson = JSON.parse(newJson);
              serverBotAPI.responses[args[2]] = newJson;
              updateBotAPI(serverBotAPI, msg);
              msg.channel.send('', {
                embed: {
                  title: `Updated ${args[1]}/${args[2]}`,
                  description: '```json\n' + JSON.stringify(newJson, null, '  ') + '```'
                }
              });
            } else unknown(msg, `\`\`json\n${newJson}\`\``);
          } else unknown(msg, args[2]);
          break;
        default:
          unknown(msg, args[1]);
      }
      break;
    case "delete":
      switch (args[1]) {
        case "cmds":
          if (serverBotAPI.cmds[args[2]]) {
            delete serverBotAPI.cmds[args[2]];
            updateBotAPI(serverBotAPI, msg);
            msg.channel.send(`Deleted ${args[1]}/${args[2]}`).then(sentMsg => {
              sentMsg.delete({ timeout: 7500 });
            });
          } else unknown(msg, args[2]);
          break;
        case "responses":
          if (serverBotAPI.responses[args[2]]) {
            delete serverBotAPI.responses[args[2]];
            updateBotAPI(serverBotAPI, msg);
            msg.channel.send(`Deleted ${args[1]}/${args[2]}`).then(sentMsg => {
              sentMsg.delete({ timeout: 7500 });
            });
          } else unknown(msg, args[2]);
          break;
        default:
          unknown(msg, args[1]);
      }
      break;
    default:
      unknown(msg, args[0]);
  }
  msg.delete({ timeout: 500 });
}

module.exports = { aliases, description, usage, permissions, on_run }