
export default class Terraformer {
    constructor() {

    }

    checkIfChannelExists(msg, channelName) {
        if (msg.guild.channels.exists(channelName)) {
            msg.reply("Channel exists already");
        }
    }

    /**
     * params msg -> is msg object
     * params channelType -> text/voice
    */
    createNewChannel(msg, channelName, channelType) {
        msg.guild.channels.create(channelName, {
            type: channelType
        }); 
    }
}