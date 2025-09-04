const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Usuario = require("../../schemas/usuarioSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Retira dinero del banco")
    .addIntegerOption(option =>
      option.setName("cantidad")
        .setDescription("Cantidad a retirar")
        .setRequired(true)
    ),

  async execute(interaction) {
    const cantidad = interaction.options.getInteger("cantidad");
    const usuarioId = interaction.user.id;

    let user = await Usuario.findOne({ usuarioId });

    if (!user) {
      user = new Usuario({ usuarioId, saldo: 0, banco: 0 });
      await user.save();
    }

    if (cantidad <= 0) {
      return interaction.reply({
        content: "⚠️ La cantidad debe ser mayor a 0.",
        flags: 1 << 6
      });
    }

    if (user.banco < cantidad) {
      return interaction.reply({
        content: "❌ No tienes suficiente dinero en el banco.",
        flags: 1 << 6
      });
    }

    user.banco -= cantidad;
    user.saldo += cantidad;
    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🏦 Retiro realizado")
      .setDescription(`Has retirado **$${cantidad.toLocaleString()} Pesos Mexicanos** del banco.`)
      .addFields(
        { name: "Efectivo", value: `$${user.saldo.toLocaleString()}`, inline: true },
        { name: "Banco", value: `$${user.banco.toLocaleString()}`, inline: true }
      )
      .setColor("Blue")
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};