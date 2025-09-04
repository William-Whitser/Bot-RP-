const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Usuario = require("../../schemas/usuarioSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banco")
    .setDescription("Administra tu dinero en el banco")
    .addSubcommand(sub =>
      sub
        .setName("depositar")
        .setDescription("Deposita dinero en el banco")
        .addIntegerOption(opt =>
          opt
            .setName("cantidad")
            .setDescription("Cantidad de dinero a depositar")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("retirar")
        .setDescription("Retira dinero del banco")
        .addIntegerOption(opt =>
          opt
            .setName("cantidad")
            .setDescription("Cantidad de dinero a retirar")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
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
        flags: 1 << 6,
      });
    }

    if (subcommand === "depositar") {
      if (user.saldo < cantidad) {
        return interaction.reply({
          content: "❌ No tienes suficiente dinero en efectivo.",
          flags: 1 << 6,
        });
      }

      user.saldo -= cantidad;
      user.banco += cantidad;
      await user.save();

      const embed = new EmbedBuilder()
        .setTitle("🏦 Depósito realizado")
        .setDescription(`Has depositado **$${cantidad.toLocaleString()} Pesos Mexicanos** en el banco.`)
        .addFields(
          { name: "Efectivo", value: `$${user.saldo.toLocaleString()}`, inline: true },
          { name: "Banco", value: `$${user.banco.toLocaleString()}`, inline: true }
        )
        .setColor("Green")
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === "retirar") {
      if (user.banco < cantidad) {
        return interaction.reply({
          content: "❌ No tienes suficiente dinero en el banco.",
          flags: 1 << 6,
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

      return interaction.reply({ embeds: [embed] });
    }
  },
};