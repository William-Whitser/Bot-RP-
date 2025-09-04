const Licencia = require("../schemas/licenciaSchema");

module.exports = async function verificarExpiracionLicencia() {
  const hoy = new Date();

  try {
    const licencias = await Licencia.find({ fechaExpiracion: { $lte: hoy } });

    for (const licencia of licencias) {
      await Licencia.deleteOne({ _id: licencia._id });
      console.log(`❌ Licencia eliminada por expiración: ${licencia.numeroLicencia}`);
    }

    console.log("✅ Verificación de licencias expiradas completada.");
  } catch (error) {
    console.error("⚠️ Error verificando licencias expiradas:", error);
  }
};