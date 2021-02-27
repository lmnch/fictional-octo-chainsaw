import Task from "../model/Task.js";
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
        task = new Task(
          roomData.task.name,
          taskType[roomData.task.type],
          roomData.task.textData,
          roomData.task.solution
        );
      }

      const room = new Room(
        roomName,
        roomData.textChannels,
        roomData.speechChannels,
        roomData.accessCondition,
        task,
        roomData.followUpRoom,
        roomData.isStartRoom
      );

      roomManager.addRoom(room);
    });
  }
}
