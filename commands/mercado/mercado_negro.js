
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mercado-negro")
    .setDescription("Muestra los objetos disponibles en el mercado negro"),
  
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🕵️ Mercado Negro")
      .setDescription("Aquí puedes ver los artículos ilegales disponibles.")
      .addFields(
        { name: "🔫 Pistola", value: "$5000", inline: true },
        { name: "💊 Drogas", value: "$3000", inline: true },
        { name: "🧨 Explosivos", value: "$10000", inline: true },
      )
      .setColor("DarkRed")
      .setFooter({ text: "Usa /comprar-mercado <item>" });

    await interaction.reply({ embeds: [embed] });
  }
};