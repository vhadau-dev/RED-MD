import red from '../../lib/red.js';
import { getUser, saveUsers } from '../../data/users.js';

red.bot({
  cmd: 'slots',
  desc: 'Play a slot machine: .slots <amount>',
  fromMe: false,
  type: 'gambling',
  react: '🎰',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const user = getUser(senderNumber);

    // Check if user is registered
    if (!user) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ You must register first! Use .reg <age>'
      }, { quoted: msg });
    }

    // Check bet amount
    const betAmount = parseInt(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Invalid amount! Usage: .slots <amount>'
      }, { quoted: msg });
    }

    if (betAmount > user.coins) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ You don't have enough coins! Your balance: ${user.coins}`
      }, { quoted: msg });
    }

    // Slot symbols
    const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '⭐', '🔔'];
    const spin = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    let text = `🎰 Your spin: ${spin.join(' | ')}\n`;

    // Check results
    let multiplier = 0;
    if (spin[0] === spin[1] && spin[1] === spin[2]) {
      multiplier = 3; // 3 matching symbols = triple
      text += `🎉 Jackpot! You won ${betAmount * multiplier} coins!`;
      user.coins += betAmount * multiplier;
    } else if (spin[0] === spin[1] || spin[1] === spin[2] || spin[0] === spin[2]) {
      multiplier = 2; // 2 matching symbols = double
      text += `🎉 Nice! You won ${betAmount * multiplier} coins!`;
      user.coins += betAmount * multiplier;
    } else {
      text += `❌ You lost ${betAmount} coins.`;
      user.coins -= betAmount;
    }

    saveUsers(); // save coins

    text += `\n💰 New balance: ${user.coins}`;
    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});