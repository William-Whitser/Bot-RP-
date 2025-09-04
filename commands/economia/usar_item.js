const { SlashCommandBuilder } = require('discord.js');
const Usuario = require("../../schemas/usuarioSchema");
const checkCooldown = require("../../utils/checkCooldown");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("usar-item")
    .setDescription("Usa un item de tu inventario")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Nombre del item")
        .setRequired(true)
    ),

  async execute(interaction) {
    let itemName = interaction.options.getString("item");
    let user = await Usuario.findOne({ userId: interaction.user.id });

    if (!user || !user.items) return interaction.reply("❌ No tienes inventario.");
    let item = user.items.find(i => i.nombre === itemName);

    if (!item) return interaction.reply("❌ No tienes ese item.");
    item.cantidad -= 1;
    if (item.cantidad <= 0) user.items = user.items.filter(i => i.nombre !== itemName);

    await user.save();
    await interaction.reply(`🎯 Has usado el item **${itemName}**`);
  }
};