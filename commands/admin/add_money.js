const { SlashCommandBuilder } = require("discord.js");
const Usuario = require("../../schemas/usuarioSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-money")
    .setDescription("Agrega dinero al saldo de un usuario")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario al que se le agregará dinero")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("cantidad")
        .setDescription("Cantidad de dinero a agregar")
        .setRequired(true)
    ),

  async execute(interaction) {
    const usuario = interaction.options.getUser("usuario");
    const cantidad = interaction.options.getInteger("cantidad");

    let user = await Usuario.findOne({ usuarioId: usuario.id });

    if (!user) {
      user = await Usuario.create({
        usuarioId: usuario.id,
        saldo: cantidad,
        banco: 0
      });
    } else {
      user.saldo += cantidad;
      await user.save();
    }

    await interaction.reply(`💸 Se agregaron **${cantidad} pesos** al saldo de <@${usuario.id}>.`);
  }
};