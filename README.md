# Minecraft Crash Bot

A Discord bot designed for Minecraft server stress testing and security research. This tool allows researchers to test server resilience against specific network and packet configurations.

## ⚠️ Disclaimer
This project is created strictly for educational and research purposes only. The developer (cryptnull) does not condone or support the use of this tool for illegal activities, unauthorized attacks, or disrupting public servers. Use this software only on servers you own or have explicit permission to test.

## Requirements
* Node.js (v16.9.0 or higher)
* Java (for specific method executions)

## Setup

1. Clone the repository:
   `git clone https://github.com/cryptnull/minecraft-crash-bot.git`
2. Install the required Node.js dependencies:
   `npm install`
3. Create a `.env` file in the root directory and add your Discord bot token:
   `DISCORD_TOKEN=your_bot_token_here`
4. Run the bot:
   `node bot.js`

## Commands
* `/help` - Displays bot usage information and available methods.
* `/attack <ip> <port> <time> <method>` - Initiates a test against a specific Minecraft server.

## License
© 2024 cryptnull. All Rights Reserved.
