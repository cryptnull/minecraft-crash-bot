const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;

const allowedChannelIds = [
    '1375184027249545388',
    '1375102048026230966',
    '1375103102126129223',
    'معرف_قناة_إضافية_2'
];
const allowedRoleIds = [
    '1375187025375920229',
    '1375103102126129223',
    '1375102048026230966',
    'معرف_رتبة_إضافية_2'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays bot usage information'),
    async execute(interaction) {
        if (!allowedChannelIds.includes(interaction.channelId)) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('This command can only be used in specific channels.')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }
        if (!interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id))) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('You don’t have permission to use this command.')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }

        let methods = [];
        try {
            const data = await fs.readFile('./methods.json', 'utf8');
            methods = Object.keys(JSON.parse(data));
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('Error loading methods, check methods.json')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }

        const methodList = methods.length ? methods.map(m => `**${m}**`).join('\n') : 'No methods available';
        const embed = new EmbedBuilder()
            .setColor('#FF4500')
            .setTitle('Crash Bot Commands')
            .setDescription('Here’s how to use the bot commands:')
            .addFields(
                { name: '/help', value: 'Shows this help message with bot usage information.', inline: false },
                {
                    name: '/attack <ip> <port> <time> <method>',
                    value: `Attacks a Minecraft server.\n**Example**: /attack 1.2.3.4 25565 60 method1\n**Available Methods**:\n${methodList}`,
                    inline: false
                }
            )
            .setThumbnail('https://j.top4top.io/p_3309604rd1.png')
            .setImage('https://j.top4top.io/p_3309604rd1.png')
            .setFooter({ text: 'Crash Bot | Powered by MCSlapper', iconURL: 'https://j.top4top.io/p_3309604rd1.png' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};