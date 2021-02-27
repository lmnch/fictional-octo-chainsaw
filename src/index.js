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

client.on('message', async msg => {
   const channelName = msg.channel.name;

    if (msg.content === 'ping') {
        msg.channel.send('pong');
    }
    if (msg.content.startsWith("terra")){
        const mysteryKey = msg.content.split(" ")[1];

        fileReader.readFile(mysteryKey); 
        // Create category channel for mystery
        const parentChannel = await terra.createNewChannel(msg, mysteryKey, "category");
        terra.createAllRoles(msg, roomManager.getAllRoles());
        roomManager.getRoomNames().forEach(roomName => {
            const room = roomManager.getRoom(roomName);
            terra.createNewChannel(msg, room.roomName, "voice", parentChannel, room.accessCondition);
            room.textChannels.forEach(channelName => terra.createNewChannel(msg, channelName, "text", parentChannel, room.accessCondition));
        });
    }
});

// read token from discord_token file
const data = fs.readFileSync('./discord_token', 'utf8')
client.login(data);