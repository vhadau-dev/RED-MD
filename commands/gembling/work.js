import red from '../../lib/red.js';
import { getUser, saveUsers } from '../../data/users.js';

red.bot({
  cmd: 'work',
  desc: 'Work to earn coins (cooldown 1 hour)',
  fromMe: false,
  type: 'gambling',
  react: '💼',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const user = getUser(senderNumber);

    if (!user) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ You must register first! Use .reg <age>'
      }, { quoted: msg });
    }

    // Set cooldown (1 hour)
    const now = Date.now();
    const cooldown = 60 * 60 * 1000; // 1 hour in ms

    if (!user.lastWork) user.lastWork = 0;

    if (now - user.lastWork < cooldown) {
      const remaining = cooldown - (now - user.lastWork);
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `⏳ You are tired! Come back in ${minutes}m ${seconds}s.`
      }, { quoted: msg });
    }

    // Earn random coins
    const earnings = Math.floor(Math.random() * 100) + 50; // 50–150 coins
    user.coins += earnings;
    user.lastWork = now;

    saveUsers();

    await sock.sendMessage(msg.key.remoteJid, {
      text: `💼 You worked hard and earned ${earnings} coins!\n💰 Your balance: ${user.coins}`
    }, { quoted: msg });
  }
});