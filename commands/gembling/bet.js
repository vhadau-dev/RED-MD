import red from '../../lib/red.js';
import { getUser, saveUsers } from '../../data/users.js';

red.bot({
  cmd: 'bet',
  desc: 'Bet coins on a coin flip: .bet <heads/tails> <amount>',
  fromMe: false,
  type: 'gambling',
  react: '🎲',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const user = getUser(senderNumber);

    // Check if user is registered
    if (!user) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ You must register first! Use .reg <age>'
      }, { quoted: msg });
    }

    // Check arguments
    if (!args[0] || !args[1]) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Usage: .bet <heads/tails> <amount>'
      }, { quoted: msg });
    }

    const choice = args[0].toLowerCase();
    const betAmount = parseInt(args[1]);

    if (choice !== 'heads' && choice !== 'tails') {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Invalid choice! Use "heads" or "tails".'
      }, { quoted: msg });
    }

    if (isNaN(betAmount) || betAmount <= 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Invalid amount! Must be a positive number.'
      }, { quoted: msg });
    }

    if (betAmount > user.coins) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ You don't have enough coins! Your balance: ${user.coins}`
      }, { quoted: msg });
    }

    // Flip coin
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    let text = `🎲 Coin flip result: ${result}\n`;

    if (choice === result) {
      // Win
      user.coins += betAmount;
      text += `✅ You won ${betAmount} coins!\n💰 New balance: ${user.coins}`;
    } else {
      // Lose
      user.coins -= betAmount;
      text += `❌ You lost ${betAmount} coins.\n💰 New balance: ${user.coins}`;
    }

    saveUsers(); // save updated coins

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});