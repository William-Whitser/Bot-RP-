const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Usuario = require("../../schemas/usuarioSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventario")
    .setDescription("Consulta tu inventario de ítems"),

  async execute(interaction) {
    const usuarioId = interaction.user.id;
    let user = await Usuario.findOne({ usuarioId });

    if (!user) {
      user = new Usuario({ usuarioId, saldo: 0, banco: 0, items: [] });
      await user.save();
    }

    const items = user.items;

    const embed = new EmbedBuilder()
      .setTitle("🎒 Tu Inventario")
      .setColor("Gold")
      .setDescription(
        items && items.length > 0
          ? items.map((item, i) => `**${i + 1}.** ${item.nombre} x${item.cantidad}`).join("\n")
          : "📦 No tienes ítems en tu inventario."
      )
      .setFooter({ text: `Usuario: ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};