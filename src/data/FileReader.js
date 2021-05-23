import Task, { Conversation, Decision, EscapeRoom } from "../model/Task.js";
import Room from "../model/Room.js";
import roomManager from "../model/RoomManager.js";
import { taskType } from "../model/Task.js";

import fs from "fs";

/**
 * Reads the room structure and related tasks from the json file.
 */
export default class FileReader {
  /**
   * Converts all js objects in "rooms" property to rooms and all tasks in them
   * to matching tasks objects.
   *
   * @param {Object} mysteryKey
   */
  readFile(mysteryKey) {
    const textData = fs.readFileSync(
      `./data/mysteries/mystery-${mysteryKey}.json`
    );
    const mystery = JSON.parse(textData);
    Object.entries(mystery.rooms).forEach(([roomName, roomData]) => {
      let task = null;
      if (roomData.task) {
        task = this.readTask(roomData.task);
      }

      const room = new Room(
        roomName,
        roomData.accessCondition,
        task,
        roomData.isStartRoom
      );

      roomManager.addRoom(room);
    });

    roomManager.setLoadedMystery(mysteryKey);
  }

  /**
   * Converts a js object (e.g. read from json) to the related task object.
   * Which derivative class is taken is determined by the type.
   *
   * @param {Object} jsonTaskData
   */
  readTask(jsonTaskData) {
    // determine type
    if (jsonTaskData.type == taskType.DECISION) {
      return new Decision(
        jsonTaskData.name,
        jsonTaskData.questionChannel,
        jsonTaskData.solutionChannel,
        jsonTaskData.textData,
        jsonTaskData.solutions
      );
    } else if (jsonTaskData.type == taskType.CONVERSATION) {
      return new Conversation(
        jsonTaskData.name,
        jsonTaskData.introChannel,
        jsonTaskData.introductionTextData,
        jsonTaskData.conversationPartner,
        jsonTaskData.stages,
        jsonTaskData.startStage
      );
    } else if (jsonTaskData.type === taskType.ESCAPE_ROOM) {
      return new EscapeRoom(
        jsonTaskData.name,
        jsonTaskData.textChannel,
        jsonTaskData.introductionText,
        jsonTaskData.items,
        jsonTaskData.nextRoom
      );
    }

    return null;
  }
}
