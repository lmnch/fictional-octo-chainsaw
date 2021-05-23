
/**
 * Holds some data about the selected mystery
 */
class RoomManager {
  constructor() {
    this.rooms = {};
  }

  /**
   * Adds a room to the whole room list
   * 
   * @param {Room} room 
   */
  addRoom(room) {
    this.rooms[room.roomName] = room;
  }

  /**
   * @returns All room names
   */
  getRoomNames() {
    return Object.values(this.rooms).map((room) => room.roomName);
  }

  /**
   * Returns room with this room name
   * 
   * @param {string} roomName 
   * @returns Room
   */
  getRoom(roomName) {
    return this.rooms[roomName];
  }

  /**
   * Summarizes all roles which are access roles of existing rooms
   * 
   * @returns 
   */
  getAllRoles() {
    return [
      ...new Set(Object.values(this.rooms).map((r) => r.accessCondition)),
    ].filter((r) => r != null);
  }

  /**
   * Returns the access role which is needed to access the room with the flag isStartRoom
   * 
   * @returns 
   */
  getStartRole() {
    let startRole = null;
    Object.values(this.rooms).forEach((room) => {
      if (room.isStartRoom) {
        startRole = room.accessCondition;
      }
    });

    return startRole;
  }

  /**
   * Finds the room which is related to the msg
   * 
   * @param {*} msg 
   * @returns 
   */
  async getRelatedRoomByMsg(msg) {
    for (const room of Object.values(this.rooms)) {

      if (await room.relatesToMessage(msg)) {
        return room;
      }
    }
    return null;
  }

  /**
   * 
   * @returns string[] names of all text and speech channels in the mystery
   */
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
