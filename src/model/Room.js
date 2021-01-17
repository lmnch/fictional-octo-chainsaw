

export default class Room {

    constructor(roomSpeechChannel, textChannels, speechChannels, accessCondition){ 
        this._roomSpeechChannel = roomSpeechChannel;
        this._textChannels = textChannels;
        this._speechChannels = speechChannels;
        this._accessCondition = accessCondition;
        this.tasks = [];
    }

    get roomName(){
        return this._roomSpeechChannel;
    }

    addTask(task){
        this.tasks.push(task);
    }

}