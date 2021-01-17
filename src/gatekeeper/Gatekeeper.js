

export default class Gatekeeper{

    constructor(discordBot){
        this._discordBot = discordBot;
    }

    giveAccess(user, accessRole){
        user.addRole(accessRole);
    }
}