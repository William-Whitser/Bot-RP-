
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Muestra la lista de comandos disponibles"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("📖 Lista de Comandos")
            .setDescription("Aquí tienes todos los comandos disponibles organizados por categorías:")
            .addFields(
                {
                    name: "💰 Economía",
                    value: "`/saldo` → Muestra tu saldo\n`/recoger-dinero` → Recoge tu sueldo según tu rol\n`/usar-item` → Usa un objeto de tu inventario\n`/vender-item <item> <cantidad>` → Vende un objeto de tu inventario\n`/inventario` → Muestra los objetos en tu inventario\n`/leadboard` → Muestra el top 10 de usuarios más ricos",
                    inline: false
                },
                {
                    name: "🏦 Banco",
                    value: "`/banco depositar <cantidad>` → Deposita dinero en tu cuenta\n`/banco retirar <cantidad>` → Retira dinero de tu cuenta",
                    inline: false
                },
                {
                    name: "👮 Admin",
                    value: "`/add-money <usuario> <cantidad>` → Añade dinero a un usuario\n`/añadir-sueldo-rol <rol> <cantidad>` → Define el sueldo de un rol",
                    inline: false
                },
            )
            .setFooter({ text: "Sistema de Economía 💸", iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
    },
};