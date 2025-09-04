const { SlashCommandBuilder } = require('discord.js');
const Usuario = require("../../schemas/usuarioSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("saldo")
    .setDescription("Consulta tu saldo actual en efectivo y banco"),

  async execute(interaction) {
    let user = await Usuario.findOne({ usuarioId: interaction.user.id }); // ← corregido aquí

    if (!user) {
      user = new Usuario({
        usuarioId: interaction.user.id,
        saldo: 0,
        banco: 0
      });
      await user.save(); // ← evita duplicados
    }

    await interaction.reply({
      embeds: [{
        title: "💰 Tu Saldo",
        description: `**Efectivo:** ${user.saldo} Pesos Mexicanos\n**Banco:** ${user.banco} Pesos Mexicanos`,
        color: 0x00ff99
      }]
    });
  }
};