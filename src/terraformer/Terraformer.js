export default class Terraformer {
  constructor() {}

  checkIfChannelExists(msg, channelName) {
    if (msg.guild.channels.exists(channelName)) {
      msg.reply("Channel exists already");
    }
  }

  /**
   * params msg -> is msg object
   * params channelType -> text/voice
   */
  createNewChannel(
    msg,
    channelName,
    channelType,
    parentChannel,
    nescessaryRole
  ) {
    return msg.guild.channels
      .create(channelName, {
        type: channelType,
      })
      .then((channel) => {
        if (parentChannel) {
          channel.setParent(parentChannel);
        }
        return channel;
      })
      .then(async (channel) => {
        if (nescessaryRole) {
          const role = msg.guild.roles.find("name", nescessaryRole);
          channel.overwritePermissions(role.id, ["VIEW_CHANNEL"]);
        }
        return channel;
      });
  }

  createAllRoles(msg, roleNames) {
    for (let a = 0; a < roleNames.length; a++) {
      this.createRole(roleNames[a], msg);
    }
  }

  async createRole(roleName, msg) {
    let role = msg.guild.roles.cache.find((x) => x.name === roleName);
    if (role === undefined) {
      // Role doesn't exist, safe to create
      msg.guild.roles.create({
        data: {
          name: roleName,
          permissions: [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
            "SPEAK",
            "CONNECT",
            "STREAM",
            "ATTACH_FILES",
          ],
        },
      });
    } else {
      // Role exists
    }
  }
}
