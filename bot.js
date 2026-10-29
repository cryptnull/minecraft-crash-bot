require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

async function loadCommands() {
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith('.js'));
    const commandsArray = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        delete require.cache[require.resolve(filePath)];
        const command = require(filePath);
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());
        }
    }
    return commandsArray;
}

async function loadEvents() {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = (await fs.readdir(eventsPath)).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        delete require.cache[require.resolve(filePath)];
        const event = require(filePath);
        if (event.name && event.execute) {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

async function deployCommands(commandsArray) {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    await rest.put(Routes.applicationCommands('1375108092060241930'), { body: commandsArray });
    console.log('✅ Commands deployed globally!');
}

async function startBot() {
    const commandsArray = await loadCommands();
    await deployCommands(commandsArray);
    await loadEvents();
    await client.login(process.env.DISCORD_TOKEN);
    console.log('✅ Bot logged in successfully!');
}

startBot().catch(console.error);
