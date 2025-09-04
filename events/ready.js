const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ Bot iniciado como ${client.user.tag}`);
    client.user.setActivity("Bot RP | /help", { type: 0 });
  },
};