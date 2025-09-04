const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("solicitud-renovacion")
    .setDescription("Solicitar la renovación de la licencia"),

  async execute(interaction) {
    await interaction.reply("📩 Tu solicitud de renovación de licencia ha sido enviada a tránsito. ✅");
  },
};