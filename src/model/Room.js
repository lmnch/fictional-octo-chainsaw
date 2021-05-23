
/**
 * Represents a room of the riddle
 */
export default class Room {

  /**
   * 
   * @param {*} roomSpeechChannel Name of the speech channel
   * @param {*} accessCondition Name of the role which is needed to access the room
   * @param {*} task Task which should be solved in a room
   * @param {*} isStartRoom Marks the start room
   */
  constructor(roomSpeechChannel, accessCondition, task, isStartRoom) {
    this._roomSpeechChannel = roomSpeechChannel;
    this._accessCondition = accessCondition;
    this._task = task;

    this._isStartRoom = isStartRoom || false;
  }

  get roomName() {
    return this._roomSpeechChannel;
  }

  get textChannels() {
    if (!this.task) {
      return [];
    }

    return this.task.getChannels();
  }

  get accessCondition() {
    return this._accessCondition;
  }

  get task() {
    return this._task;
  }

  get isStartRoom() {
    return this._isStartRoom;
  }

  /**
   * Checks if a message relates to the room (or the corresponding task)
   * 
   * @param {*} msg sent message
   * @returns 
   */
  async relatesToMessage(msg) {
    if (this.roomName === msg.channel.name) {
      return true;
    }
    if (!this._task) {
      return false;
    }
    return await this._task.relatesToMsg(msg);
  }

  /**
   * Returns if the access check should be skipped for this room (depending on the task)
   * @returns if access check should be skipped
   */
  skipCheckAccessCheck() {
    if (!this._task)
      return false;

    return this._task.skipCheckAccessCheck();
  }
}
