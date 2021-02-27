export default class Room {
  constructor(
    roomSpeechChannel,
    speechChannels,
    accessCondition,
    task,
    followUpRoom,
    isStartRoom
  ) {
    this._roomSpeechChannel = roomSpeechChannel;
    this._speechChannels = speechChannels;
    this._accessCondition = accessCondition;
    this._task = task;
    this._followUpRoom = followUpRoom;
    this._isStartRoom = isStartRoom || false;
  }

  get roomName() {
    return this._roomSpeechChannel;
  }

  get textChannels() {
    if (!this.task) {
      return [];
    }
    if (this.task.questionChannel == this.task.solutionChannel)
      return [this.task.questionChannel];
    return [this.task.questionChannel, this.task.solutionChannel];
  }

  get speechChannels() {
    return this._speechChannels;
  }

  get accessCondition() {
    return this._accessCondition;
  }

  get task() {
    return this._task;
  }

  get followUpRoom() {
    return this._followUpRoom;
  }

  get isStartRoom() {
    return this._isStartRoom;
  }
}
