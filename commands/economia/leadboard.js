const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Usuario = require("../../schemas/usuarioSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leadboard")
    .setDescription("Muestra el top de usuarios con más dinero"),

  async execute(interaction) {
    // Obtener los 10 usuarios con más dinero (efectivo + banco)
    const top = await Usuario.find()
      .sort({ saldo: -1, banco: -1 })
      .limit(10);

    // Emojis para los primeros 3 puestos
    const medallas = ["🥇", "🥈", "🥉"];

    // Construir la descripción del embed
    const desc = top.map((u, i) => {
      const emoji = medallas[i] || `**${i + 1}.**`;
      const total = (u.saldo || 0) + (u.banco || 0);
      return `${emoji} <@${u.usuarioId}> - 💵 $${total.toLocaleString()}`;
    }).join("\n");

    // Crear el embed
    const embed = new EmbedBuilder()
      .setTitle("🏆 Top 10 Usuarios más ricos")
      .setDescription(desc)
      .setColor(0xf1c40f)
      .setTimestamp();

    // Enviar la respuesta
    await interaction.reply({ embeds: [embed] });
  }
};