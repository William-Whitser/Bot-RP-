const { SlashCommandBuilder } = require("discord.js");
const Licencia = require("../../schemas/licenciaSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editar-licencia")
    .setDescription("Editar los puntos de una licencia")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario dueño de la licencia")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("puntos")
        .setDescription("Nuevo número de puntos")
        .setRequired(true)
    ),

  async execute(interaction) {
    const usuario = interaction.options.getUser("usuario");
    const puntos = interaction.options.getInteger("puntos");

    const licencia = await Licencia.findOne({ userId: usuario.id });
    if (!licencia) return interaction.reply("❌ No se encontró una licencia para este usuario.");

    licencia.puntos = puntos;
    await licencia.save();

    await interaction.reply(`✅ Licencia de <@${usuario.id}> actualizada a **${puntos} puntos**.`);
  },
};