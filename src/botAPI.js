require('discord.js');
const fs = require('fs');
const { stringify } = require('querystring');
const { getServerFile, appendObj, baseResponse } = require('./global');
const msgParser = require('./msgParser');

function errorInvType(msg, location, subject, allowed) {
  msg.channel.send(`Error: ${location} | Invalid type '${typeof (subject)}', Allowed Types: ${allowed}`);
}

function parseTree(obj, msg) {
  for (let i in obj) {
    if (typeof (obj[i]) == 'string') obj[i] = msgParser.parse(obj[i], msg);
    if (typeof (obj[i]) == 'object' && ((Array.isArray(obj[i]) && obj[i].length > -1) || (!Array.isArray(obj[i]) && JSON.stringify(obj[i])!= '{}'))) parseTree(obj[i], msg);
  }
}

function parseCondition(condition, args) {
  if (typeof (condition) == 'boolean')
    return condition;
  let has_true = false;
  let has_false = false;
  let splitStr = condition.trim().split(' ');
  for (let i in splitStr) {
    entry = splitStr[i];
    if (entry.includes('arg.')) {
      index = parseInt(entry.replace('arg.', ''));
      entry = `'${args[index]}'`
    }
    splitStr[i] = entry;
  }
  for (let ind = 0; ind < splitStr.length; ind++) {
    let entry = splitStr[ind];

    switch (entry) {
      case "==":
        if (splitStr[ind - 1] == splitStr[ind + 1]) {
          has_true = true;
        } else has_false = true;
        break;
      case "!=":
        if (splitStr[ind - 1] != splitStr[ind + 1]) {
          has_true = true;
        } else has_false = true;
        break;
    }
  }
  switch (splitStr[0]) {
    case "if_all":
      if (!has_false)
        return true;
      break;
    case "if_none":
      if (!has_true)
        return true;
      break;
    case "if_true_false":
      if (has_true && has_false)
        return true;
      break;
    case "if_not_true_false":
      if (!has_true && !has_false)
        return true;
      break;
    default: // defaults to if_any
      if (has_true)
        return true;
  }
}

class triggers {
  cmd(msg, args, argsStr, cmdJson) {
    parseTree(cmdJson.responses, msg);
    for (let cmdResponse in cmdJson.responses) {
      let condition = cmdJson.responses[cmdResponse];
      let run = parseCondition(condition, args);
      if (run) {
        const responses = getServerFile(msg.guild.id).bot_api.responses;
        for (let responseName in responses) {
          let response = responses[responseName];
          if (responseName == cmdResponse) {
            responseEntries(msg, args, argsStr, response);
          }
        }
      }
    }
  }
}

function requiresSentMsg(msg, args, argsStr, responseJson, botMsg) {
  if (typeof (responseJson.react_with) != 'object' || !Array.isArray(responseJson.react_with)) {
    errorInvType(msg, 'response/react_with', responseJson.react_with, 'Array');
    return;
  }
  if (responseJson.react_with.length > 0) {
    for (let reactionName in responseJson.react_with) {
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
    }
  }
}

function responseEntries(msg, args, argsStr, responseJson) {
  appendObj(responseJson, baseResponse);
  parseTree(responseJson, msg);

  if (typeof (responseJson.send_msg) != 'object' || Array.isArray(responseJson.send_msg)) {
    errorInvType(msg, 'response/send_msg', responseJson.send_msg, 'Object');
    return;
  }

  if (responseJson.send_msg.text || JSON.stringify(responseJson.send_msg.embed) != '{}') {
    if (typeof (responseJson.send_msg.text) != 'string') {
      errorInvType(msg, 'response/send_msg/text', responseJson.send_msg.text, 'String');
      return;
    }
    if (typeof (responseJson.send_msg.embed) != 'object' || Array.isArray(responseJson.send_msg.embed)) {
      errorInvType(msg, 'response/send_msg/embed', responseJson.send_msg.embed, 'Object');
      return;
    }

    let deleteAfter = 0;
    if (responseJson.send_msg.delete_after) {
      deleteAfter = responseJson.send_msg.delete_after;
      if (typeof (deleteAfter) != 'number' && typeof (deleteAfter) != 'boolean') {
        errorInvType(msg, 'response/send_msg/delete_after', responseJson.send_msg, 'Boolean, Number');
        return;
      }
    }
    const to = responseJson.send_msg.to;
    let sendOpt = {}
    if (JSON.stringify(responseJson.send_msg.embed) != '{}') sendOpt.embed = responseJson.send_msg.embed;

    switch (to.split(':')[0]) {
      case "user":
        msg.guild.members.cache.array().forEach(member=>{
          if (member.user.id == to.split(':')[1]) member.user.send(responseJson.send_msg.text, sendOpt).then(sentMsg => {
            requiresSentMsg(msg, args, argsStr, responseJson, sentMsg);
            if (deleteAfter > 0) sentMsg.delete({ timeout: deleteAfter });
          });
        });
        break;
      case "channel":
        msg.guild.channels.cache.array().forEach(channel=>{
          if (channel.id == to.split(':')[1]) channel.send(responseJson.send_msg.text, sendOpt).then(sentMsg => {
            requiresSentMsg(msg, args, argsStr, responseJson, sentMsg);
            if (deleteAfter > 0) sentMsg.delete({ timeout: deleteAfter });
          });
        });
        break;
      default:
        msg.channel.send(`Error: response/send_msg/to | Unknown 'to' entry '${to}'`);
    }
  }

  if (typeof (responseJson.add_roles) != 'object' || !Array.isArray(responseJson.add_roles)) {
    errorInvType(msg, 'response/add_roles', responseJson.add_roles, 'Array');
    return;
  }
  if (responseJson.add_roles.length > 0) {
    console.log('Attempting to add roles');
  }

  if (typeof (responseJson.delete_origin_msg) != 'boolean') {
    errorInvType(msg, 'response/delete_origin_msg', responseJson.delete_origin_msg, 'Boolean');
    return;
  }
  if (responseJson.delete_origin_msg) {
    msg.delete();
  }

  if (typeof (responseJson.remove_roles) != 'object' || !Array.isArray(responseJson.remove_roles)) {
    errorInvType(msg, 'response/remove_roles', responseJson.remove_roles, 'Array');
    return;
  }
  if (responseJson.remove_roles.length > 0) {
    console.log('Attempting to remove roles');
  }
}


module.exports = { triggers }