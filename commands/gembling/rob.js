import red from '../../lib/red.js';
import { getUser, saveUsers } from '../../data/users.js';

red.bot({
  cmd: 'rob',
  desc: 'Try to rob another user (risky gamble)',
  fromMe: false,
  type: 'gambling',
  react: '💀',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const robber = getUser(senderNumber);

    if (!robber) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ You must register first! Use .reg <age>'
      }, { quoted: msg });
    }

    if (!args[0]) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Usage: .rob <target-number>'
      }, { quoted: msg });
    }

    const targetNumber = args[0].includes('@') ? args[0] : `${args[0]}@s.whatsapp.net`;
    const target = getUser(targetNumber);

    if (!target) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Target user is not registered!'
      }, { quoted: msg });
    }

    if (target.coins <= 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Target has no coins to steal!'
      }, { quoted: msg });
    }

    // Success chance (50%)
    const success = Math.random() < 0.5;

    let stolenAmount = Math.floor(Math.random() * Math.min(target.coins, 50)) + 1; // 1-50 coins max

    if (success) {
      robber.coins += stolenAmount;
      target.coins -= stolenAmount;
      await sock.sendMessage(msg.key.remoteJid, {
        text: `💰 Success! You stole ${stolenAmount} coins from @${targetNumber.split('@')[0]}!\nYour balance: ${robber.coins}`,
        mentions: [targetNumber]
      }, { quoted: msg });
    } else {
      // Failure penalty: lose some coins
      const penalty = Math.min(robber.coins, stolenAmount);
      robber.coins -= penalty;
      await sock.sendMessage(msg.key.remoteJid, {
        text: `💀 Failed! You were caught and lost ${penalty} coins.\nYour balance: ${robber.coins}`,
        mentions: [targetNumber]
      }, { quoted: msg });
    }

    saveUsers();
  }
});