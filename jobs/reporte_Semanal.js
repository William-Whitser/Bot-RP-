const { EmbedBuilder, WebhookClient } = require("discord.js");
const Multa = require("../schemas/multaSchema");
const Vehiculo = require("../schemas/vehiculoSchema");
const Usuario = require("../schemas/usuarioSchema");

module.exports = async function reporteSemanal() {
  try {
    const multasTotales = await Multa.countDocuments();
    const vehiculosTotales = await Vehiculo.countDocuments();
    const usuariosTotales = await Usuario.countDocuments();

    const embed = new EmbedBuilder()
      .setTitle("📊 Reporte Semanal - Mexicali RP")
      .setColor("#2ecc71")
      .addFields(
        { name: "🚔 Multas registradas", value: `${multasTotales}`, inline: true },
        { name: "🚗 Vehículos registrados", value: `${vehiculosTotales}`, inline: true },
        { name: "👤 Usuarios registrados", value: `${usuariosTotales}`, inline: true },
      )
      .setFooter({ text: "Generado automáticamente" })
      .setTimestamp();

    // Webhook (pon tu URL del webhook aquí)
    const webhookClient = new WebhookClient({ url: "TU_WEBHOOK_DISCORD_AQUI" });

    await webhookClient.send({ embeds: [embed] });
    console.log("✅ Reporte semanal enviado correctamente.");
  } catch (error) {
    console.error("⚠️ Error generando el reporte semanal:", error);
  }
};