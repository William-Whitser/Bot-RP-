const { SlashCommandBuilder } = require('discord.js');
const Item = require("../../schemas/itemSchema");
const Usuario = require("../../schemas/usuarioSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tienda")
    .setDescription("Compra un item de la tienda")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Nombre del item a comprar")
        .setRequired(true)
    ),

  async execute(interaction) {
    let itemName = interaction.options.getString("item");
    let item = await Item.findOne({ nombre: itemName });
    if (!item) return interaction.reply("❌ Ese item no existe en la tienda.");

    let user = await Usuario.findOne({ userId: interaction.user.id });
    if (!user || user.saldo < item.precio) return interaction.reply("❌ No tienes suficiente dinero.");

    user.saldo -= item.precio;
    user.items.push({ nombre: item.nombre, cantidad: 1 });
    await user.save();

    await interaction.reply(`✅ Compraste **${item.nombre}** por **${item.precio} Pesos Mexicanos**`);
  }
};