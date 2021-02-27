import Discord from "discord.js";
const client = new Discord.Client();

import fs from "fs";
import Terraformer from "./terraformer/Terraformer.js";
const terra = new Terraformer();
import FileReader from "./data/FileReader.js";
const fileReader = new FileReader();
import roomManager from "./model/RoomManager.js";

import gatekeeper from "./gatekeeper/Gatekeeper.js";
import riddler from "./riddler/Riddler.js";
import { taskType } from "./model/Task.js";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildCreate", (guild) => {
  guild.systemChannel.send("LUKAS ist dumm");
});

client.on("message", async (msg) => {
  const channelName = msg.channel.name;

  if (msg.content === "ping") {
    msg.channel.send("pong");
  } else if (msg.content === "de") {
    gatekeeper.removeAccess(
      msg.member,
      msg.guild.roles.cache.find((x) => x.name === roomManager.getStartRole())
    );
  } else if (msg.content === "start adventure") {
    gatekeeper.giveAccess(msg, roomManager.getStartRole());
  } else if (msg.content.startsWith("terra")) {
    const mysteryKey = msg.content.split(" ")[1];

    fileReader.readFile(mysteryKey);
    // Create category channel for mystery
    const parentChannel = await terra.createCategory(msg, mysteryKey);
    await terra.createAllRoles(msg, roomManager.getAllRoles());
    roomManager.getRoomNames().forEach(async (roomName) => {
      const room = roomManager.getRoom(roomName);
      terra.createVoiceChannel(
        msg,
        room.roomName,
        room.accessCondition,
        parentChannel
      );

      await Promise.all(
        room.textChannels.map(
          async (channelName) =>
            await terra.createTextChannel(
              msg,
              channelName,
              room.accessCondition,
              parentChannel
            )
        )
      );

      // write questions
      if (room.task) {
        if (room.task.type == taskType.QUESTION) {
          riddler.askQuestion(room.task, msg);
        }
      }
    });
  } else {
    riddler.checkAnswer(msg);
  }
});

// read token from discord_token file
const data = fs.readFileSync("./discord_token", "utf8");
client.login(data);
