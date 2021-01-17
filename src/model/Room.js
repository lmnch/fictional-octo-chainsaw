export default class Room {
  constructor(
    roomSpeechChannel,
    textChannels,
    speechChannels,
    accessCondition
  ) {
    this._roomSpeechChannel = roomSpeechChannel;
    this._textChannels = textChannels;
    this._speechChannels = speechChannels;
    this._accessCondition = accessCondition;
    this._tasks = [];
  }

  get roomName() {
    return this._roomSpeechChannel;
  }

  get textChannels() {
    return this._textChannels;
  }

  get speechChannels() {
    return this._speechChannels;
  }

  get accessCondition() {
    return this._accessCondition;
  }

  get tasks() {
    return this._tasks;
  }

  addTask(task) {
    this._tasks.push(task);
  }
}
