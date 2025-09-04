const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`❌ Comando no encontrado: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Error ejecutando ${interaction.commandName}`, error);
      await interaction.reply({
        content: "⚠️ Hubo un error ejecutando este comando.",
        ephemeral: true,
      });
    }
  },
};