
export default class Terraformer {
    constructor() {

    }

    checkIfChannelExists(msg, channelName) {
        if (msg.guild.channels.exists(channelName)) {
            msg.reply("Channel exists already");
        }
    }

    createNewChannel(msg, channelName, channelType) {
        msg.guild.channels.create(channelName, {
            type: channelType
        }); 
    }
}