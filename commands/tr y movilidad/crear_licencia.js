const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Licencia = require("../../schemas/licenciaSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crear-licencia")
    .setDescription("Crear una licencia nueva para un usuario")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario al que se le creará la licencia")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("nombre")
        .setDescription("Nombre completo del usuario")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("runt")
        .setDescription("Código RUNT del usuario")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("categoria")
        .setDescription("Categoría de la licencia (ej: A1, B1, C1-2...)")
        .setRequired(true)
    ),

  async execute(interaction) {
    const usuario = interaction.options.getUser("usuario");
    const nombre = interaction.options.getString("nombre");
    const RUNT = interaction.options.getString("runt");
    const categoria = interaction.options.getString("categoria");

    const nuevaLicencia = new Licencia({
      usuarioId: usuario.id,
      nombre,
      RUNT,
      categoria,
      puntos: 12,
      fechaExpedicion: new Date(),
      fechaExpiracion: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
    });

    await nuevaLicencia.save();

    const embed = new EmbedBuilder()
      .setTitle("🚗 Nueva Licencia Creada")
      .setDescription(`Licencia creada para <@${usuario.id}>`)
      .addFields(
        { name: "Nombre", value: nombre, inline: true },
        { name: "Categoría", value: categoria, inline: true },
        { name: "Puntos", value: "12", inline: true },
        { name: "RUNT", value: RUNT, inline: true }
      )
      .setColor("Green");

    await interaction.reply({ embeds: [embed] });
  },
};