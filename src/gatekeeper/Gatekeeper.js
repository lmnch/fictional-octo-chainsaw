/**
 * Manages the access of players to rooms by adding and removing roles.
 */
class Gatekeeper {
  constructor() {}

  /**
   * Gives the sender of the message the passed role
   * 
   * @param {*} msg Message object which can be used to access the role management of the server and the member
   * @param {*} accessRole Name of the role which should be given to the user 
   */
  async giveAccess(msg, accessRole) {
    const role = msg.guild.roles.cache.find((x) => x.name === accessRole);
    await msg.member.roles.add(role);
  }

  /**
   * Removes the sender of the message the passed role
   * 
   * @param {*} msg Message object which can be used to access the role management of the server and the member
   * @param {*} accessRole Name of the role which should be given to the user 
   */
  async removeAccess(msg, accessRole) {
    const role = msg.guild.roles.cache.find((x) => x.name === accessRole);
    await msg.member.roles.remove(role);
  }

  /**
   * Checks if a discord user has the passed role.
   * 
   * Returns false of bots
   * 
   * @param {*} member 
   * @param {*} room 
   * @returns 
   */
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
