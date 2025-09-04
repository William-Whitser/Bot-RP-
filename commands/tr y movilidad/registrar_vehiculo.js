const { SlashCommandBuilder } = require("discord.js");
const Vehiculo = require("../../schemas/vehiculoSchema");
const verificarPlacaDuplicada = require("../../utils/verificarPlacaDuplicada");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("registrar-vehiculo")
    .setDescription("Registra un vehículo nuevo")
    .addStringOption(option =>
      option.setName("placa")
        .setDescription("Placa del vehículo")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("modelo")
        .setDescription("Modelo del vehículo")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("color")
        .setDescription("Color del vehículo")
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName("propietario")
        .setDescription("Usuario propietario del vehículo")
        .setRequired(true)
    ),

  async execute(interaction) {
    const placa = interaction.options.getString("placa").toUpperCase();
    const modelo = interaction.options.getString("modelo");
    const color = interaction.options.getString("color");
    const propietario = interaction.options.getUser("propietario");

    const duplicada = await verificarPlacaDuplicada(placa);
    if (duplicada) {
      return interaction.reply({
        content: `❌ La placa **${placa}** ya está registrada.`,
        flags: 1 << 6 // respuesta privada
      });
    }

    const nuevoVehiculo = new Vehiculo({
      placa,
      modelo,
      color,
      usuarioId: propietario.id,
      inmovilizado: false
    });

    await nuevoVehiculo.save();

    await interaction.reply(`✅ Vehículo **${modelo}** color **${color}** con placa **${placa}** registrado para <@${propietario.id}>.`);
  }
};