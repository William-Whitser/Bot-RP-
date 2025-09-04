const { SlashCommandBuilder } = require('discord.js');
const Usuario = require("../../schemas/usuarioSchema");
const SueldoRol = require("../../schemas/sueldoRolSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recoger-dinero")
    .setDescription("Recoge tu sueldo dependiendo de tus roles"),

  async execute(interaction) {
    let user = await Usuario.findOne({ userId: interaction.user.id });
    if (!user) {
      user = await Usuario.create({ userId: interaction.user.id, saldo: 0, banco: 0 });
    }

    let rolesUsuario = interaction.member.roles.cache.map(r => r.id);
    let sueldos = await SueldoRol.find({ rolId: { $in: rolesUsuario } });

    let total = sueldos.reduce((acc, s) => acc + s.sueldo, 0);

    if (total <= 0) {
      return interaction.reply({ content: "❌ No tienes roles con sueldo asignado.", ephemeral: true });
    }

    user.saldo += total;
    await user.save();

    await interaction.reply({
      content: `💸 Has recogido tu sueldo: **${total} Pesos Mexicanos**`
    });
  }
};