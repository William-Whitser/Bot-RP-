const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role-dashboard")
    .setDescription("Muestra los roles disponibles en el servidor con su ID"),
  
  async execute(interaction) {
    const roles = interaction.guild.roles.cache
      .filter(role => role.id !== interaction.guild.id)
      .map(role => `• ${role.name} → \`${role.id}\``)
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("📋 Dashboard de Roles")
      .setDescription(roles || "No hay roles en este servidor.")
      .setColor("Blue");

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
