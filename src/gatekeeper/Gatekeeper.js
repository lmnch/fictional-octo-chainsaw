class Gatekeeper {
  constructor() {}

  async giveAccess(msg, accessRole) {
    const role = msg.guild.roles.cache.find((x) => x.name === accessRole);
    await msg.member.roles.add(role);
  }

  async removeAccess(msg, accessRole) {
    const role = msg.guild.roles.cache.find((x) => x.name === accessRole);
    await  msg.member.roles.remove(role);
  }

  async memberHasRole(member, accessRole){
    const role = member.roles.cache.find(x => x.name===accessRole);

    if(role){
        return true;
    }
    return false;
  } 
}

const gatekeeper = new Gatekeeper();
export default gatekeeper;
