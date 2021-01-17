

export default class Gatekeeper{

    constructor(){

    }

    giveAccess(user, accessRole){
        user.addRole(accessRole);
    }
}