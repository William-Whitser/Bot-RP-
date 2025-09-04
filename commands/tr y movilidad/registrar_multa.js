const { SlashCommandBuilder } = require("discord.js");
const Multa = require("../../schemas/multaSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("registrar-multa")
    .setDescription("Registrar una multa a un usuario")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario multado")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("motivo")
        .setDescription("Motivo de la multa")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("monto")
        .setDescription("Monto de la multa")
        .setRequired(true)
    ),

  async execute(interaction) {
    const usuario = interaction.options.getUser("usuario");
    const motivo = interaction.options.getString("motivo");
    const monto = interaction.options.getInteger("monto");
    const oficialId = interaction.user.id;

    const nuevaMulta = new Multa({
      usuarioId: usuario.id,
      oficialId,
      motivo,
      monto
    });

    await nuevaMulta.save();

    await interaction.reply(`🚔 Multa registrada para <@${usuario.id}> 
        Motivo: **${motivo}** con valor de **$${monto}**.`);
  },
};