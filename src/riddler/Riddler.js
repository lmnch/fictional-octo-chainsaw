import gatekeeper from "../gatekeeper/Gatekeeper.js";
import roomManager from "../model/RoomManager.js";
import { taskType } from "../model/Task.js";

class Riddler {
  async placeTask(task, msg) {
    await task.placeTask(msg);
  }

  async checkAnswer(msg) {
    const channelName = msg.channel.name;

    const room = roomManager.getRelatedRoomByChannel(channelName);

    if (!room && gatekeeper.memberHasRole(msg.member, room.accessCondition)) {
      return;
    }

    // delete msg
    const nextRoomName = room.task.getNextRoomForSolution(msg.member, msg.content);

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
