const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Multa = require("../../schemas/multaSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reporte-semanal")
    .setDescription("Generar un reporte semanal de multas"),

  async execute(interaction) {
    const inicioSemana = new Date();
    inicioSemana.setDate(inicioSemana.getDate() - 7);

    const multas = await Multa.find({ fecha: { $gte: inicioSemana } });

    if (multas.length === 0) return interaction.reply("✅ No se registraron multas esta semana.");

    const total = multas.reduce((acc, m) => acc + m.valor, 0);

    const embed = new EmbedBuilder()
      .setTitle("📊 Reporte Semanal de Multas")
      .setDescription(`Multas registradas en los últimos 7 días`)
      .addFields(
        { name: "Cantidad de Multas", value: `${multas.length}`, inline: true },
        { name: "Total Recaudado", value: `$${total}`, inline: true }
      )
      .setColor("Yellow");

    await interaction.reply({ embeds: [embed] });
  },
};