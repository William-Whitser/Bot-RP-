const { SlashCommandBuilder } = require("discord.js");
const SueldoRol = require("../../schemas/sueldoRolSchema");
const config = require("../../config/config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("añadir-sueldo")
    .setDescription("Asigna un sueldo a un rol específico")
    .addRoleOption(option =>
      option.setName("rol")
        .setDescription("Rol al que asignar sueldo")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("sueldo")
        .setDescription("Cantidad de dinero que recibirá el rol")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.roles.cache.has(config.roles.admin)) {
      return interaction.reply({ content: "❌ No tienes permiso para usar este comando.", ephemeral: true });
    }

    const rol = interaction.options.getRole("rol");
    const sueldo = interaction.options.getInteger("sueldo");

    let data = await SueldoRol.findOne({ rolId: rol.id });
    if (!data) {
      data = new SueldoRol({ rolId: rol.id, sueldo });
    } else {
      data.sueldo = sueldo;
    }

    await data.save();

    await interaction.reply(`✅ El rol ${rol} ahora tiene un sueldo de **${sueldo} pesos**.`);
  }
};