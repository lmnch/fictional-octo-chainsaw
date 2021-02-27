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
  async createNewChannel(
    msg,
    channelName,
    channelType,
    parentChannel,
    nescessaryRole
  ) {
    return await msg.guild.channels
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
          const role = msg.guild.roles.cache.find((x) => x.name === nescessaryRole);
          channel.overwritePermissions([{id:role.id,allow:["VIEW_CHANNEL"],type:"role"},{id:msg.guild.roles.everyone,deny:["VIEW_CHANNEL"],type:"role"}]);
        }
        return channel;
      });
  }

  async createTextChannel(msg, channelName, role, parentChannel)
  {
    return await this.createNewChannel(msg, channelName, "text", parentChannel, role);
  }
  async createVoiceChannel(msg, channelName, role, parentChannel)
  {
    return await this.createNewChannel(msg, channelName, "voice", parentChannel, role);
  }
  async createCategory(msg, channelName)
  {
    return await this.createNewChannel(msg, channelName, "category", null, null);
  }

  async createAllRoles(msg, roleNames) {
    for (let a = 0; a < roleNames.length; a++) {
      await this.createRole(roleNames[a], msg); // todo: create roles parallel
    }
  }

  async createRole(roleName, msg) {
    let role = msg.guild.roles.cache.find((x) => x.name === roleName);
    if (role === undefined) {
      // Role doesn't exist, safe to create
      await msg.guild.roles.create({
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

  async destroyChannel(msg, channelName)
  {
    let fetchedChannel = msg.guild.channels.cache.find((x) => x.name === channelName);

    await fetchedChannel.delete()
    .catch(err => {
        console.error(err);
    });
  }
}
