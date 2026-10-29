module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isCommand()) return;
        console.log(`Interaction received: ${interaction.commandName} in channel ${interaction.channelId}`);

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.log(`Command not found: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (error && error.code === 10062) return;
            try {
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            } catch (err) {
                console.error('Failed to send error message for interaction:', err);
            }
        }
    }
};
