const { SlashCommandBuilder } = require("discord.js");
const Licencia = require("../../schemas/licenciaSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("renovar-licencia")
    .setDescription("Renovar la licencia de un usuario")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario que renovará la licencia")
        .setRequired(true)
    ),

  async execute(interaction) {
    const usuario = interaction.options.getUser("usuario");
    const licencia = await Licencia.findOne({ userId: usuario.id });
    if (!licencia) return interaction.reply("❌ No existe licencia para este usuario.");

    licencia.fechaExpedicion = new Date();
    licencia.fechaExpiracion = new Date(new Date().setFullYear(new Date().getFullYear() + 3));
    await licencia.save();

    await interaction.reply(`✅ Licencia de <@${usuario.id}> renovada hasta ${licencia.fechaExpiracion.toLocaleDateString()}.`);
  },
};