import red from '../../lib/red.js';
import { getUser } from '../../data/users.js';

red.bot({
  cmd: 'wallet',
  desc: 'Check your coins balance',
  fromMe: false,
  type: 'gambling',
  react: '💰',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const user = getUser(senderNumber);

    // Check if user is registered
    if (!user) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ You must register first! Use .reg <age>'
      }, { quoted: msg });
    }

    // Send wallet info
    await sock.sendMessage(msg.key.remoteJid, {
      text: `💰 Your wallet:\nCoins: ${user.coins}\nAge: ${user.age}`
    }, { quoted: msg });
  }
});