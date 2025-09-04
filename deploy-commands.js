const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const commands = [];
const foldersPath = './commands';
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = `./commands/${folder}`;
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`${commandsPath}/${file}`);

    if (
      'data' in command &&
      typeof command.data?.toJSON === 'function' &&
      'execute' in command
    ) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`[⚠️ ADVERTENCIA] El comando en ${file} está mal estructurado o no usa SlashCommandBuilder.`);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

(async () => {
  try {
    console.log('🔄 Actualizando comandos slash...');

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log('✅ ¡Comandos actualizados correctamente!');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
})();