class Gatekeeper {
  constructor() {}

  async giveAccess(msg, accessRole) {
    const role = msg.guild.roles.cache.find((x) => x.name === accessRole);
    await msg.member.roles.add(role);
  }

  async removeAccess(msg, accessRole) {
    const role = msg.guild.roles.cache.find((x) => x.name === accessRole);
    await msg.member.roles.remove(role);
  }

  async memberHasRole(member, room) {
      if(member.bot) return false;
      
      if(room.skipCheckAccessCheck()){
        return true;
      }
      // Default check
      const role = member.roles.cache.find(
        (x) => x.name === room.accessCondition
      );
      
      if (role) {
        return true;
      }
      return false;
  }
}

const gatekeeper = new Gatekeeper();
export default gatekeeper;
