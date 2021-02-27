import gatekeeper from "../gatekeeper/Gatekeeper.js";
import roomManager from "../model/RoomManager.js";
import { taskType } from "../model/Task.js";



class Riddler {

    async askQuestion(task, msg){
        let textChannel = msg.guild.channels.cache.find((x) => x.name === task.questionChannel);

        // Check type
        if(taskType.QUESTION !== task.type){
            console.error("task is not a question!");
            textChannel.send("A exception occured: Task is not of type question!")
        }
        
        // clear channel
        textChannel.send(task.name).then(res=>textChannel.send(task.textData));
    }


    checkAnswer(msg){
        const channelName = msg.channel.name;

        const room = roomManager.getRelatedRoomByChannel(channelName);

        if(!room){
            return;
        }

        if(room.task.solution==msg.content && room.followUpRoom){
            
            const followUp = roomManager.getRoom(room.followUpRoom);

            gatekeeper.removeAccess(msg, room.accessCondition);
            gatekeeper.giveAccess(msg, followUp.accessCondition);
        }

    }
    
}

const riddler = new Riddler();
export default riddler;