import roomManager from "./RoomManager.js";

export const taskType = {
  ESCAPE_ROOM: 0,
  QUESTION: 1,
};

export default class Task {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  getChannels() {
    throw new Error("Cannot return channels of abstract Task");
  }

  get type() {
    throw new Error("Cannot determine type of abstract task");
  }

  getNextRoomForSolution(member, answer) {
    throw new Error("Cannot check answer for abstract task");
  }

  placeTask(msg) {
    throw new Error("Cannot place abstract task");
  }
}


const imgRegex = /\!\[(.+)\]\((.+)\)/gm;
export class Question extends Task {
  constructor(name, questionChannel, solutionChannel, textData, solutions) {
    super(name);
    this._questionChannel = questionChannel;
    this._solutionChannel = solutionChannel;
    this._textData = textData;
    this._solutions = solutions;
  }

  get questionChannel() {
    return this._questionChannel;
  }

  get solutionChannel() {
    return this._solutionChannel;
  }

  get textData() {
    return this._textData;
  }

  get solutions() {
    return this._solution;
  }

  getChannels() {
    if (this.questionChannel == this.solutionChannel)
      return [this.questionChannel];
    return [this.questionChannel, this.solutionChannel];
  }

  get type() {
    return taskType.QUESTION;
  }

  getNextRoomForSolution(member, answer) {
    return this._solutions[answer];
  }

  async placeTask(msg) {
    let textChannel = msg.guild.channels.cache.find(
      (x) => x.name === this.questionChannel
    );

    // clear channel
    for (const str of this.textData) {
      // check for images
      let match;
      if ((match = imgRegex.exec(str))) {
        await textChannel.send({
          files: [
            {
              attachment: `data/imgs/${roomManager.loadedMystery}/${match[2]}`,
              name: match[2],
            },
          ],
        });
      } else {
        await textChannel.send(str);
      }
    }
  }
}
