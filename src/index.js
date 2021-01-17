const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs')


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
   const channelName = msg.channel.name;

    if (msg.content === 'ping') {
        msg.channel.send('pong');
    }
});

// read token from discord_token file
const data = fs.readFileSync('./discord_token', 'utf8')
client.login(data);