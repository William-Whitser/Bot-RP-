const { SlashCommandBuilder } = require('discord.js');
const Usuario = require("../../schemas/usuarioSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("transferir")
    .setDescription("Transfiere dinero a otro usuario")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario al que transferir")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("cantidad")
        .setDescription("Cantidad a transferir")
        .setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("usuario");
    const cantidad = interaction.options.getInteger("cantidad");

    if (target.id === interaction.user.id) {
      return interaction.reply({
        content: "❌ No puedes transferirte a ti mismo.",
        flags: 1 << 6
      });
    }

    let user = await Usuario.findOne({ usuarioId: interaction.user.id });
    if (!user) {
      user = new Usuario({ usuarioId: interaction.user.id, saldo: 0, banco: 0 });
      await user.save();
    }

    if (user.saldo < cantidad) {
      return interaction.reply({
        content: "❌ No tienes suficiente dinero en efectivo.",
        flags: 1 << 6
      });
    }

    let receptor = await Usuario.findOne({ usuarioId: target.id });
    if (!receptor) {
      receptor = new Usuario({ usuarioId: target.id, saldo: 0, banco: 0 });
      await receptor.save();
    }

    user.saldo -= cantidad;
    receptor.saldo += cantidad;

    await user.save();
    await receptor.save();

    await interaction.reply(`💸 Has transferido **${cantidad} Pesos Mexicanos** a **${target.username}**`);
  }
};