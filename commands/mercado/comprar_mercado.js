const { SlashCommandBuilder } = require("discord.js");
const usuarioSchema = require("../../schemas/usuarioSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("comprar-mercado")
    .setDescription("Compra un objeto del mercado negro")
    .addStringOption(option =>
      option.setName("item")
        .setDescription("El objeto que quieres comprar")
        .setRequired(true)
        .addChoices(
          { name: "Pistola", value: "pistola" },
          { name: "Drogas", value: "drogas" },
          { name: "Explosivos", value: "explosivos" }
        )
    ),

  async execute(interaction) {
    const item = interaction.options.getString("item");
    const userId = interaction.user.id;

    const precios = {
      pistola: 5000,
      drogas: 3000,
      explosivos: 10000,
    };

    let usuario = await usuarioSchema.findOne({ userId });
    if (!usuario) {
      usuario = new usuarioSchema({ userId, banco: 0, saldo: 0 });
      await usuario.save();
    }

    if (usuario.saldo < precios[item]) {
      return interaction.reply("❌ No tienes suficiente dinero para esta compra.");
    }

    usuario.saldo -= precios[item];
    await usuario.save();

    return interaction.reply(`✅ Has comprado **${item}** por **$${precios[item]}** del mercado negro.`);
  }
};