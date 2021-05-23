import gatekeeper from "../gatekeeper/Gatekeeper.js";
import roomManager from "../model/RoomManager.js";
import { taskType } from "../model/Task.js";

/**
 * Manages answers from the user and places tasks in channels.
 */
class Riddler {

  /**
   * Calls task's place task method 
   * (TODO: think about refactoring this. Task types should not have knowledge about discord specific types)
   * 
   * @param {Task} task 
   * @param {*} msg 
   */
  async placeTask(task, msg) {
    await task.placeTask(msg);
  }

  /**
   * Checks the answer given in the message and "moves" player to next room
   * 
   * @param {*} msg 
   * @returns 
   */
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
