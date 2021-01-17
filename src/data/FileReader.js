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
      const room = new Room(
        roomName,
        roomData.textChannels,
        roomData.speechChannels,
        roomData.accessCondition
      );

      roomManager.addRoom(room);

      roomData.tasks.forEach((taskName) => {
        const taskData = JSON.parse(
          fs.readFileSync(
            `./data/mysteries/${mysteryKey}/tasks/${taskName}.json`
          )
        );

        let task = new Task(
          taskName,
          taskType[taskData.type],
          taskData.solution,
          mystery.tasks[taskName].followUpRooms
        );

        roomManager.addTask(task, roomName);
      });
    });
  }
}
