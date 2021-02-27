import { UserManager } from "discord.js";


export default class Gatekeeper{

    constructor(){

    }

    giveAccess(user, accessRole){
        user.roles.add(accessRole);
    }

    removeAccess(user, accessRole) {
        user.roles.remove(accessRole);
    }
}