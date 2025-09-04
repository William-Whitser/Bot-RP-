const { SlashCommandBuilder } = require("discord.js");
const Licencia = require("../../schemas/licenciaSchema");
const config = require("../../config/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suspender-licencia")
    .setDescription("Suspender la licencia de un usuario")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario al que suspender la licencia")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("razon")
        .setDescription("Razón de la suspensión")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.roles.policia)) {
      return interaction.reply({ content: "❌ Solo la policía puede suspender licencias.", ephemeral: true });
    }

    const usuario = interaction.options.getUser("usuario");
    const razon = interaction.options.getString("razon");

    let licencia = await Licencia.findOne({ userId: usuario.id });
    if (!licencia) {
      return interaction.reply({ content: "⚠️ Este usuario no tiene licencia registrada.", ephemeral: true });
    }

    licencia.estado = "Suspendida";
    licencia.razonSuspension = razon;
    await licencia.save();

    await interaction.reply(`🚫 La licencia de ${usuario} ha sido suspendida. Razón: **${razon}**`);
  }
};