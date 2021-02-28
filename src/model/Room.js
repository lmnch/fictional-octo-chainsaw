export default class Room {
  constructor(
    roomSpeechChannel,
    accessCondition,
    task,
    isStartRoom
  ) {
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
}
