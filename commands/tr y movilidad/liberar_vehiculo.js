const { SlashCommandBuilder } = require("discord.js");
const Vehiculo = require("../../schemas/vehiculoSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("liberar-vehiculo")
    .setDescription("Liberar un vehículo inmovilizado")
    .addStringOption(option =>
      option.setName("placa")
        .setDescription("Placa del vehículo")
        .setRequired(true)
    ),

  async execute(interaction) {
    const placa = interaction.options.getString("placa");
    const vehiculo = await Vehiculo.findOne({ placa });

    if (!vehiculo || !vehiculo.inmovilizado)
      return interaction.reply("❌ Este vehículo no está inmovilizado o no existe.");

    vehiculo.inmovilizado = false;
    await vehiculo.save();

    await interaction.reply(`✅ Vehículo con placa **${placa}** liberado.`);
  },
};