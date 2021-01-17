
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

    createAllRoles(msg) {
        let roleNames = ["nature", "bomber"];
        for(let a = 0; a < roleNames.length; a++) 
        {
            this.createRole(roleNames[a], msg);
        }
    }

    createRole(roleName, msg) {
        let role = msg.guild.roles.cache.find(x => x.name === roleName);
        if (role === undefined) { // Role doesn't exist, safe to create
            msg.guild.roles.create({ 
                data: { 
                    name: roleName, 
                    permissions: [
                        'VIEW_CHANNEL', 
                        'SEND_MESSAGES',
                        'SPEAK',
                        'CONNECT',
                        'STREAM',
                        'ATTACH_FILES'
                    ]
                } 
            });
        } else {
            // Role exists
        }
    }
}