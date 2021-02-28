import gatekeeper from "../gatekeeper/Gatekeeper.js";
import roomManager from "../model/RoomManager.js";
import { taskType } from "../model/Task.js";

class Riddler {
  async placeTask(task, msg) {
    await task.placeTask(msg);
  }

  async checkAnswer(msg) {
    const room = await roomManager.getRelatedRoomByMsg(msg);

    if (!room || !(await gatekeeper.memberHasRole(msg.member || msg.author, room))) {
      return;
    }

    // delete msg
    const nextRoomName = await room.task.getNextRoomForSolution(
      msg.member || msg.author,
      msg.content
    );

    if (!msg.author.bot && msg.channel.type !== 'dm') await msg.delete();
    if (nextRoomName && nextRoomName !== room.roomName) {
      const followUp = roomManager.getRoom(nextRoomName);

      await gatekeeper.removeAccess(msg, room.accessCondition);
      await gatekeeper.giveAccess(msg, followUp.accessCondition);
    }
  }
}

const riddler = new Riddler();
export default riddler;
