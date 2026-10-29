const fs = require('fs').promises;
const path = require('path');

module.exports = {
    async log(message) {
        const logPath = path.join(__dirname, '..', 'files', 'log.txt');
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        await fs.appendFile(logPath, logMessage);
    }
};