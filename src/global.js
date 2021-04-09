const fs = require('fs');


const rootDir = __dirname.replace('\\src', '').replace('/src', '');
const serverDataDir = __dirname.replace('\\src', '').replace('/src', '') + '/data/servers/';


const baseCmd = {
  aliases: [],
  permissions: [],
  description: 'no description',
  usage: 'no usage example',
  responses: {}
}

const baseResponse = {
  add_roles: [],
  delete_origin_msg: false,
  remove_roles: [],
  react_with: [],
  send_msg: {
    text: '',
    embed: {},
    delete_after: false,
    to: 'channel:{$channel.id}'
  }
}

function appendObj(appendTo, appendFrom) {
  for (var key in appendFrom) {
    if (!appendTo.hasOwnProperty(key)) {
      appendTo[key] = appendFrom[key];
    }
  }
}

function getServerFile(id) {
  let path = serverDataDir + id + '.json'
  try {
    fs.accessSync(path, fs.constants.F_OK);

    let serverObject = JSON.parse(fs.readFileSync(path));
    return serverObject;
  } catch (err) {
    return null;
  }
}

function getPrefix(guild) {
  let serverObject = getServerFile(guild.id);
  return serverObject.prefix;
}

function cmds() {
  let temp = [];
  const cmdFileNames = fs.readdirSync(__dirname + '/commands/');
  cmdFileNames.forEach(fileName => {
    currCmd = require('./commands/' + fileName);
    temp.push(currCmd);
  });
  return temp;
}


module.exports = { baseCmd, baseResponse, cmds, rootDir, serverDataDir, getServerFile, getPrefix, appendObj };