
export const taskType = {
    ESCAPE_ROOM: 0,
    QUESTION: 1
} 


export default class Task {
    
    constructor(name, questionChannel, solutionChannel, type, textData, solution) {
        this._name = name;
        this._questionChannel = questionChannel;
        this._solutionChannel = solutionChannel;
        this._type = type;
        this._textData = textData;
        this._solution = solution;
    }

    get name(){
        return this._name;
    }

    get questionChannel(){
        return this._questionChannel;
    }

    get solutionChannel(){
        return this._solutionChannel;
    }

    get type(){
        return this._type;
    }

    get textData(){
        return this._textData;
    }

    get solution(){
        return this._solution;
    }
}