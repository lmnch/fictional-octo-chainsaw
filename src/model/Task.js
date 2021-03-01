import { Message } from "discord.js";
import memberTaskStateManager from "../riddler/MemberTaskStateManager.js";
import roomManager from "./RoomManager.js";

export const taskType = {
  ESCAPE_ROOM: "ESCAPE_ROOM",
  QUESTION: "QUESTION",
  CONVERSATION: "CONVERSATION",
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

  type() {
    throw new Error("Cannot determine type of abstract task");
  }

  getNextRoomForSolution(member, answer) {
    throw new Error("Cannot check answer for abstract task");
  }

  placeTask(msg) {
    throw new Error("Cannot place abstract task");
  }

  async relatesToMsg(msg) {
    throw new Error("Abstract task cannot relate to a msg");
  }

  skipCheckAccessCheck() {
    return false;
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

  type() {
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

  relatesToMsg(msg) {
    return new Promise((res, rej) => {
      if (
        this._questionChannel === msg.channel.name ||
        this._solutionChannel === msg.channel.name
      ) {
        res(true);
      } else {
        res(false);
      }
    });
  }
}

export class Conversation extends Task {
  constructor(
    name,
    introChannel,
    introductionTextData,
    conversationPartner,
    stages,
    startStage
  ) {
    super(name);
    this._introChannel = introChannel;
    this._introductionTextData = introductionTextData;
    this._conversationPartner = conversationPartner;
    this._stages = stages;
    this._startStage = startStage;
  }

  getChannels() {
    return [this._introChannel];
  }

  type() {
    return taskType.CONVERSATION;
  }

  async getNextRoomForSolution(member, answer) {
    const stored = await memberTaskStateManager
      .getMemberTaskState(this._name, member)
      .catch((err) => {});

    let stagename = null;
    if (stored) {
      stagename = stored.stagename;
    }

    // first interaction in intro channel
    if (!stagename) {
      if (answer === "talk") {
        await memberTaskStateManager.setMemberTaskState(this._name, member, {
          stagename: this._startStage,
        });

        await member.send(this._conversationPartner.name);
        await member.send({
          files: [
            {
              attachment: `data/imgs/${roomManager.loadedMystery}/${this._conversationPartner.image}`,
              name: this._conversationPartner.image,
            },
          ],
        });

        this.sendStage(member, this._stages[this._startStage]);

        return null;
      } else {
        return null;
      }
    }

    const stage = this._stages[stagename];
    // Last interaction to leave room
    if (answer === "done") {
      if (stage.end) {
        await memberTaskStateManager.removeMemberTaskStateEntry(
          this._name,
          member
        );

        return stage.roomToSwitch;
      }
      return null;
    }

    const answerObject = stage.possibleAnswers[answer];

    // check if valid answer was given
    if (answerObject) {
      // check if nextStage is found
      if (answerObject.nextStage) {
        const newStage = this._stages[answerObject.nextStage];

        await memberTaskStateManager.setMemberTaskState(this._name, member, {
          stagename: answerObject.nextStage,
        });

        if (newStage.end) {
          await member.send(
            `Conversation is over. Switch back to the channel and type 'done'.`
          );
        } else {
          await this.sendStage(member, newStage);
        }

        return null;
      }
    }
  }

  async sendStage(member, stage) {
    await member.send(
      `${this._conversationPartner.name}:\n\"${stage.botText}\"`
    );
    await member.send(
      Object.entries(stage.possibleAnswers)
        .map(([key, answser]) => `${key}) ${answser.text}`)
        .join("\n")
    );
  }

  async placeTask(msg) {
    let textChannel = msg.guild.channels.cache.find(
      (x) => x.name === this._introChannel
    );

    // clear channel
    for (const str of this._introductionTextData) {
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

  async relatesToMsg(msg) {
    // 'talk' message in intro channel
    if (msg.channel.name === this._introChannel) {
      return true;
    }

    if (!msg.author) return false; // might be from the bot itself
    const state = await memberTaskStateManager
      .getMemberTaskState(this.name, msg.author)
      .catch((err) => {});
    if (state) {
      return true;
    }
    return false;
  }

  skipCheckAccessCheck() {
    return true;
  }
}

export class EscapeRoom extends Task {
  constructor(name, textChannel, introText, items, nextRoom) {
    super(name);
    this._textChannel = textChannel;
    this._introText = introText;
    this._items = items;
    this._itemsNeededToEscape = Object.entries(items)
      .filter(([key, item]) => item.neededForSolution)
      .map(([key, item]) => key);

    this._nextRoom = nextRoom;
  }

  type() {
    return taskType.ESCAPE_ROOM;
  }

  getChannels() {
    return [this._textChannel];
  }

  async placeTask(msg) {
    let textChannel = msg.guild.channels.cache.find(
      (x) => x.name === this._textChannel
    );

    for (const str of this._introText) {
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

    // write available items
    for (const itemName of Object.keys(this._items)) {
      await textChannel.send(itemName);
    }
  }

  async getNextRoomForSolution(member, answer) {
    // check if its item
    const item = this._items[answer];

    if (item) {
      await member.send(`**${answer}**:\n${item.description}`);

      return;
    }

    // else check if its solution
    const usedItems = answer.split(",").map(used=>used.trim());

    for (const neededItem of this._itemsNeededToEscape) {
      if(!usedItems.includes(neededItem)) {
        return null;
      }
    }

    return this._nextRoom;
  }

  async relatesToMsg(msg) {
    return msg.channel && msg.channel.name === this._textChannel;
  }
}
