import red from '../../lib/red.js';
import { getUser, saveUsers } from '../../data/users.js';

red.bot({
  cmd: 'daily',
  desc: 'Claim your daily coins reward (registered users only)',
  fromMe: false,
  type: 'gambling',
  react: '🎁',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const user = getUser(senderNumber);

    // Check if user is registered
    if (!user) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ You must register first! Use .reg <age>'
      }, { quoted: msg });
    }

    // Initialize lastClaim if it doesn't exist
    if (!user.lastDaily) user.lastDaily = 0;

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in ms

    // Check if daily has already been claimed
    if (now - user.lastDaily < oneDay) {
      const remaining = oneDay - (now - user.lastDaily);
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `⏳ You have already claimed your daily reward.\nCome back in ${hours}h ${minutes}m.`
      }, { quoted: msg });
    }

    // Give daily reward
    const reward = 50; // coins
    user.coins += reward;
    user.lastDaily = now;

    saveUsers(); // save updated data

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎉 You claimed your daily reward of ${reward} coins!\nYou now have ${user.coins} coins.`
    }, { quoted: msg });
  }
});