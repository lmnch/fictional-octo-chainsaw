import Discord from 'discord.js';
const client = new Discord.Client();

import fs from 'fs';
import Terraformer from "./terraformer/Terraformer.js";
const terra = new Terraformer();
import FileReader from "./data/FileReader.js";
const fileReader = new FileReader();
import roomManager from './model/RoomManager.js';

import Gatekeeper from './gatekeeper/Gatekeeper.js';
const gatekeeper = new Gatekeeper();


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildCreate', guild => {
    guild.systemChannel.send("LUKAS ist dumm")
});

client.on('message', msg => {
   const channelName = msg.channel.name;

    if (msg.content === 'ping') {
        msg.channel.send('pong');
        msg.channel.overwritePermissions([
            {
                id: msg.guild.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: msg.author.id,
                allow: ['VIEW_CHANNEL'],
            },
        ]);
    }
    if (msg.content === "setup") {
        terra.createAllRoles(msg);
    }
    if (msg.content === "terra"){
        fileReader.readFile("survival-of-the-fittest"); 
        roomManager.getRoomNames().forEach(roomName => {
            const room = roomManager.getRoom(roomName);
            terra.createNewChannel(msg, room.roomName, "voice");
            room.textChannels.forEach(channelName => terra.createNewChannel(msg, channelName, "text"));
        });
    }
});

// read token from discord_token file
const data = fs.readFileSync('./discord_token', 'utf8')
client.login(data);