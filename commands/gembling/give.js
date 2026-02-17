import red from '../../lib/red.js';
import { getUser } from '../../data/users.js';

// In-memory lottery pool and last winner (keep same as lottery.js)
let lotteryPool = []; // make sure to sync with your lottery.js pool
let lastWinner = null; // store last winner number here

red.bot({
  cmd: 'lotterystats',
  desc: 'Show current lottery stats',
  fromMe: false,
  type: 'gambling',
  react: '📊',
  filename: import.meta.url,
  handler: async (sock, msg) => {

    const totalTickets = lotteryPool.length;
    const estimatedPrize = totalTickets * 10; // same calculation as lottery.js

    let text = '🎟️ Current Lottery Stats 🎟️\n';
    text += '────────────────────────────\n';
    text += `Total tickets in pool: ${totalTickets}\n`;
    text += `Estimated jackpot: ${estimatedPrize} coins\n`;
    if (lastWinner) {
      text += `Last winner: @${lastWinner.split('@')[0]}\n`;
    } else {
      text += 'Last winner: None yet\n';
    }
    text += '────────────────────────────\n';
    text += 'Buy tickets with .lottery buy <amount> to participate!';

    const mentions = lastWinner ? [lastWinner] : [];

    await sock.sendMessage(msg.key.remoteJid, {
      text,
      mentions
    }, { quoted: msg });
  }
});