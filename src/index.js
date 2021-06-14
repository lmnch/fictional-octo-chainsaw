import Discord, { RoleManager } from "discord.js";
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
import memberTaskStateManager from "./riddler/MemberTaskStateManager.js";


const availableMysteriesText = fs.readFileSync("./data/available_mysteries.json", "utf8");
const availableMysteries = JSON.parse(availableMysteriesText);

const PREFIX = "foc!";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // start db
  memberTaskStateManager.initSQLite();
  memberTaskStateManager.createTableIfNotExists();
});

client.on("disconnect", () => {
  memberTaskStateManager.close();
});

client.on("message", async (msg) => {
  if (!msg.content.startsWith(PREFIX)) {
    return;
  }

  const cmd = msg.content.replace(PREFIX, "");

  if (cmd === "start") {
    roomManager
      .getAllRoles()
      .filter((role) => roomManager.getStartRole() === role)
      .forEach((role) => gatekeeper.removeAccess(msg, role));
    gatekeeper.giveAccess(msg, roomManager.getStartRole());
  } else if (cmd === "list") {
    msg.channel.send(availableMysteries.join("\n"))
  } else if (cmd.startsWith("terra")) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      message.lineReply("Only administrators can terraform the server!");
      return;
    }

    const mysteryKey = msg.content.split(" ")[1];

    fileReader.readFile(mysteryKey);

    // clear old data
    await Promise.all(
      roomManager
        .getAllTextAndVoiceChannels()
        .map(async (channelName) => terra.destroyChannel(msg, channelName))
    );
    await terra.destroyChannel(msg, mysteryKey);

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
        riddler.placeTask(room.task, msg);
      }
    });
  } else {
    riddler.checkAnswer(msg);
  }
});

// read token from discord_token file
try {
  const data = fs.readFileSync("./discord_token", "utf8");
  try {
    client.login(data);
  } catch (e) {
    console.error("login failed:", e);
  }
} catch (e) {
  console.error(
    "Could not read './discord_token'. Did you place it in the working directory?\n",
    e
  );
}
