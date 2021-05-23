/**
 * Creates channels and roles for a mystery on a server which are necessary for a server 
 */
export default class Terraformer {
  constructor() {}

  /**
   * Checks if a channel is already present on the server
   * 
   * @param {*} msg 
   * @param {string} channelName 
   */
  checkIfChannelExists(msg, channelName) {
    if (msg.guild.channels.exists(channelName)) {
      msg.reply("Channel exists already");
    }
  }

  /**
   * Creates a new channel on the server 
   * 
   * @param {*} msg message object
   * @param {string} channelName Name of the channel 
   * @param {*} channelType Type of the channel (category, text, voice)
   * @param {*} parentChannel parent Channel (related category)
   * @param {string} nescessaryRole Role which is needed to see the channel 
   * @returns 
   */
  async createNewChannel(
    msg,
    channelName,
    channelType,
    parentChannel,
    nescessaryRole
  ) {
    if(!channelName)
    console.trace(channelName);
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
          const role = msg.guild.roles.cache.find(
            (x) => x.name === nescessaryRole
          );
          channel.overwritePermissions([
            { id: role.id, allow: ["VIEW_CHANNEL"], type: "role" },
            {
              id: msg.guild.roles.everyone,
              deny: ["VIEW_CHANNEL"],
              type: "role",
            },
          ]);
        }
        return channel;
      });
  }

  /**
   * Creates a channel of type "text"
   * 
   * @param {*} msg 
   * @param {*} channelName 
   * @param {*} role 
   * @param {*} parentChannel 
   * @returns 
   */
  async createTextChannel(msg, channelName, role, parentChannel) {
    return await this.createNewChannel(
      msg,
      channelName,
      "text",
      parentChannel,
      role
    );
  }

  /**
   * Creates a channel of type "voice"
   * 
   * @param {*} msg 
   * @param {*} channelName 
   * @param {*} role 
   * @param {*} parentChannel 
   * @returns 
   */
  async createVoiceChannel(msg, channelName, role, parentChannel) {
    return await this.createNewChannel(
      msg,
      channelName,
      "voice",
      parentChannel,
      role
    );
  }

  /**
   * Creates a chennel of type "category"
   * 
   * @param {*} msg 
   * @param {*} channelName 
   * @returns 
   */
  async createCategory(msg, channelName) {
    return await this.createNewChannel(
      msg,
      channelName,
      "category",
      null,
      null
    );
  }

  /**
   * Creates roles by all the role names which are passed
   * 
   * @param {*} msg 
   * @param {*} roleNames 
   */
  async createAllRoles(msg, roleNames) {
    await Promise.all(roleNames.map(roleName => await this.createRole(roleName, msg)));
  }

  /**
   * Creates a role with passed name
   * 
   * @param {string} roleName 
   * @param {*} msg 
   */
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

  /**
   * Removes a channel
   * 
   * @param {*} msg 
   * @param {string} channelName 
   * @returns 
   */
  async destroyChannel(msg, channelName) {
    let fetchedChannel = msg.guild.channels.cache.find(
      (x) => x.name === channelName
    );

    if (!fetchedChannel) return;

    await fetchedChannel.delete().catch((err) => {
      console.error(err);
    });
  }
}
