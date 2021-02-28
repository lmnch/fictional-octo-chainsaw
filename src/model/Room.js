export default class Room {
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

  async relatesToMessage(msg) {   
    if (this.roomName === msg.channel.name) {
      return true;
    }
    if (!this._task) {
      return false;
    }
    return await this._task.relatesToMsg(msg);
  }

  skipCheckAccessCheck(){
    if(!this._task)
    return false;

    return this._task.skipCheckAccessCheck();
  }
}
