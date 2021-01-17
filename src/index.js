import Discord from 'discord.js';
const client = new Discord.Client();

import fs from 'fs';
import Terraformer from "./terraformer/Terraformer.js";
const terra = new Terraformer();
import FileReader from "./data/FileReader.js";
const fileReader = new FileReader();
import roomManager from './model/RoomManager.js';


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
   const channelName = msg.channel.name;

    if (msg.content === 'ping') {
        msg.channel.send('pong');
    }
    if (msg.content === "terra"){
        fileReader.readFile("survival-of-the-fittest"); 
        msg.channel.send(roomManager.getRoomNames());
        //terra.createNewChannel(msg, "du 2", "voice");
    }
});

// read token from discord_token file
const data = fs.readFileSync('./discord_token', 'utf8')
client.login(data);