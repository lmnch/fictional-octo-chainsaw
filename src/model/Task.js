
export const taskType = {
    ESCAPE_ROOM: 0,
    QUESTION: 1
} 


export default class Task {
    
    constructor(name, type, textData, solution, followUpRooms) {
        this._name = name;
        this._type = type;
        this._textData = textData;
        this._solution = solution;
        this._followUpRooms = followUpRooms;
    }

    get name(){
        return this._name;
    }
}