class Gatekeeper {
  constructor() {}

  giveAccess(msg, accessRole) {
    const role = msg.guild.roles.cache.find((x) => x.name === accessRole);
    msg.member.roles.add(role);
  }

  removeAccess(msg, accessRole) {
    const role = msg.guild.roles.cache.find((x) => x.name === accessRole);
    msg.member.roles.remove(role);
  }
}

const gatekeeper = new Gatekeeper();
export default gatekeeper;
