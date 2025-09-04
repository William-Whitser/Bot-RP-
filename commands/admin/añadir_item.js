const { SlashCommandBuilder } = require("discord.js");
const Item = require("../../schemas/itemSchema");
const config = require("../../config/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("añadir-item")
    .setDescription("Añadir un nuevo item a la tienda")
    .addStringOption(option =>
      option.setName("nombre")
        .setDescription("Nombre del item")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("precio")
        .setDescription("Precio del item")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.roles.admin)) {
      return interaction.reply({ content: "❌ No tienes permiso para usar este comando.", ephemeral: true });
    }

    const nombre = interaction.options.getString("nombre");
    const precio = interaction.options.getInteger("precio");

    const nuevoItem = new Item({
      nombre,
      precio
    });

    await nuevoItem.save();

    await interaction.reply(`✅ Item **${nombre}** añadido a la tienda por **${precio} pesos**.`);
  }
};