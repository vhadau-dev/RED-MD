import red from '../../lib/red.js';
import { getUser, saveUsers } from '../../data/users.js';

red.bot({
  cmd: 'dice',
  desc: 'Roll a dice and win coins',
  fromMe: false,
  type: 'gambling',
  react: '🎲',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const user = getUser(senderNumber);

    if (!user) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ You must register first! Use .reg <age>'
      }, { quoted: msg });
    }

    // Check bet amount
    const betAmount = parseInt(args[0]);
    if (isNaN(betAmount) || betAmount <= 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Invalid amount! Usage: .dice <amount>'
      }, { quoted: msg });
    }

    if (betAmount > user.coins) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ You don't have enough coins! Your balance: ${user.coins}`
      }, { quoted: msg });
    }

    // Roll dice 1-6
    const diceRoll = Math.floor(Math.random() * 6) + 1;

    let text = `🎲 You rolled a ${diceRoll}!\n`;

    // Win multiplier logic
    if (diceRoll === 6) {
      const winnings = betAmount * 3;
      user.coins += winnings;
      text += `🎉 Jackpot! You won ${winnings} coins!\n💰 New balance: ${user.coins}`;
    } else if (diceRoll >= 4) {
      const winnings = betAmount * 2;
      user.coins += winnings;
      text += `🎉 Nice! You won ${winnings} coins!\n💰 New balance: ${user.coins}`;
    } else {
      user.coins -= betAmount;
      text += `❌ You lost ${betAmount} coins.\n💰 New balance: ${user.coins}`;
    }

    saveUsers();

    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});