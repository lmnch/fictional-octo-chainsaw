class RoomManager {
  constructor() {
    this.rooms = {};
    this.tasks = {};
  }

  addRoom(room) {
    this.rooms[room.roomName] = room;
  }

  addTask(task, roomName) {
    this.tasks[task.name] = task;
    this.rooms[roomName].addTask(task);
  }
}

const roomManager = new RoomManager();

export default roomManager;
