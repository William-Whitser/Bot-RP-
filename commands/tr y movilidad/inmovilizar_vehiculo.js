const { SlashCommandBuilder } = require("discord.js");
const Vehiculo = require("../../schemas/vehiculoSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inmovilizar-vehiculo")
    .setDescription("Inmoviliza un vehículo por infracción")
    .addStringOption(option =>
      option.setName("placa")
        .setDescription("Placa del vehículo a inmovilizar")
        .setRequired(true)
    ),

  async execute(interaction) {
    const placa = interaction.options.getString("placa").toUpperCase();
    const vehiculo = await Vehiculo.findOne({ placa });

    if (!vehiculo) {
      return interaction.reply({
        content: `❌ No se encontró ningún vehículo con la placa **${placa}**.`,
        ephemeral: true
      });
    }

    if (vehiculo.inmovilizado) {
      return interaction.reply({
        content: `⚠️ El vehículo con placa **${placa}** ya está inmovilizado.`,
        ephemeral: true
      });
    }

    vehiculo.inmovilizado = true;
    await vehiculo.save();

    await interaction.reply(`🚓 Vehículo con placa **${placa}** ha sido inmovilizado.`);
  }
};