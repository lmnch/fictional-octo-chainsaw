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
    Object.values(this.rooms).forEach((room) => {
      if (room.isStartRoom) {
        startRole = room.accessCondition;
      }
    });

    return startRole;
  }

  async getRelatedRoomByMsg(msg) {
    for (const room of Object.values(this.rooms)) {

      if (await room.relatesToMessage(msg)) {
        return room;
      }
    }
    return null;
  }

  getAllTextAndVoiceChannels(){
    const names = [];
    Object.values(this.rooms).forEach(room => {
      room.textChannels.forEach(name=>names.push(name));
      names.push(room.roomName); // voice channel
    });
    return names;
  }

  setLoadedMystery(key){
    this._loadedMystery = key;
  }

  get loadedMystery(){
    return this._loadedMystery;
  }
}

const roomManager = new RoomManager();

export default roomManager;
