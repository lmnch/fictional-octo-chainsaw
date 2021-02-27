import gatekeeper from "../gatekeeper/Gatekeeper.js";
import roomManager from "../model/RoomManager.js";
import { taskType } from "../model/Task.js";

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
    textChannel.send(task.name).then((res) => textChannel.send(task.textData));
  }

  async checkAnswer(msg) {
    const channelName = msg.channel.name;

    const room = roomManager.getRelatedRoomByChannel(channelName);

    if (!room && gatekeeper.memberHasRole(msg.member, room.accessCondition)) {
      return;
    }

    // delete msg
const nextRoomName = room.task.getNextRoomForSolution(msg.content)

    if(nextRoomName){
        const followUp = roomManager.getRoom(nextRoomName);

      await gatekeeper.removeAccess(msg, room.accessCondition);
      await gatekeeper.giveAccess(msg, followUp.accessCondition);
    }

    if (!msg.author.bot) msg.delete();
  }
}

const riddler = new Riddler();
export default riddler;
