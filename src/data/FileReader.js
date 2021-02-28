import Task, { Conversation, Question } from "../model/Task.js";
import Room from "../model/Room.js";
import roomManager from "../model/RoomManager.js";
import { taskType } from "../model/Task.js";

import fs from "fs";

export default class FileReader {
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

  readTask(jsonTaskData) {
    // determine type
    if (jsonTaskData.type == "QUESTION") {
      return new Question(
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
    }

    return null;
  }
}
