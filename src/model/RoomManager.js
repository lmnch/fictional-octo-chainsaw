class RoomManager {
  constructor() {
    this.rooms = {};
  }

  addRoom(room) {
    this.rooms[room.roomName] = room;
  }

  getRoomNames() {
    return Object.values(this.rooms).map((room) => room.roomName);
  }

  getRoom(roomName) {
    return this.rooms[roomName];
  }

  getAllRoles() {
    return [
      ...new Set(Object.values(this.rooms).map((r) => r.accessCondition)),
    ].filter((r) => r != null);
  }

  getStartRole() {
    let startRole = null;
    Object.values(this.rooms).forEach(room=>{
      if(room.isStartRoom){
        startRole =  room.accessCondition;
      }
    })

    return startRole;
  }
}

const roomManager = new RoomManager();

export default roomManager;
