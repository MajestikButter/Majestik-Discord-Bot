require('dotenv').config();

const { Client } = require('discord.js');
const bot = new Client();

bot.login(process.env.TOKEN);
bot.on('ready', () => {
    console.log(`-------------\n[Logged in]\nUsername: ${bot.user.username}\nID: ${bot.user.id}\n-------------`)
});