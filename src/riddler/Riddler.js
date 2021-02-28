import gatekeeper from "../gatekeeper/Gatekeeper.js";
import roomManager from "../model/RoomManager.js";
import { taskType } from "../model/Task.js";

const imgRegex = /\!\[(.+)\]\((.+)\)/gm;
class Riddler {
  async askQuestion(task, msg) {
    let textChannel = msg.guild.channels.cache.find(
      (x) => x.name === task.questionChannel
    );

    // Check type
    if (taskType.QUESTION !== task.type) {
      console.error("task is not a question!");
      textChannel.send("A exception occured: Task is not of type question!");
      return;
    }

    // clear channel
    for (const str of task.textData) {
      // check for images
      let match;
      if ((match = imgRegex.exec(str))) {
        await textChannel.send({
          files: [
            {
              attachment: `data/imgs/${roomManager.loadedMystery}/${match[2]}`,
              name: match[2],
            },
          ],
        });
      } else {
        await textChannel.send(str);
      }
    }
  }

  async checkAnswer(msg) {
    const channelName = msg.channel.name;

    const room = roomManager.getRelatedRoomByChannel(channelName);

    if (!room && gatekeeper.memberHasRole(msg.member, room.accessCondition)) {
      return;
    }

    // delete msg
    const nextRoomName = room.task.getNextRoomForSolution(msg.content);

    if (!msg.author.bot) await msg.delete();
    if (nextRoomName) {
      const followUp = roomManager.getRoom(nextRoomName);

      await gatekeeper.removeAccess(msg, room.accessCondition);
      await gatekeeper.giveAccess(msg, followUp.accessCondition);
    }
  }
}

const riddler = new Riddler();
export default riddler;
