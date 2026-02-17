import red from '../../lib/red.js';
import { getUser, saveUsers } from '../../data/users.js';
import { config } from 'dotenv';
config(); // load .env

// Owners from .env (comma-separated numbers, no @)
const owners = process.env.OWNERS ? process.env.OWNERS.split(',') : [];

// In-memory lottery pool
let lotteryPool = [];

red.bot({
  cmd: 'lottery',
  desc: 'Buy lottery tickets or draw the lottery (owner only)',
  fromMe: false,
  type: 'gambling',
  react: '🎟️',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const user = getUser(senderNumber);

    // Only registered users
    if (!user) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ You must register first! Use .reg <age>'
      }, { quoted: msg });
    }

    if (!args[0]) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Usage:\n.lottery buy <amount> - buy ticket(s)\n.lottery draw - draw the lottery (owner only)'
      }, { quoted: msg });
    }

    const action = args[0].toLowerCase();

    // Buy tickets
    if (action === 'buy') {
      const ticketAmount = parseInt(args[1]);
      if (isNaN(ticketAmount) || ticketAmount <= 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ Invalid ticket amount! Example: .lottery buy 10'
        }, { quoted: msg });
      }

      if (ticketAmount > user.coins) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: `❌ You don't have enough coins! Your balance: ${user.coins}`
        }, { quoted: msg });
      }

      // Deduct coins and add tickets
      user.coins -= ticketAmount;
      for (let i = 0; i < ticketAmount; i++) {
        lotteryPool.push(senderNumber);
      }

      saveUsers();

      return await sock.sendMessage(msg.key.remoteJid, {
        text: `🎟️ You bought ${ticketAmount} ticket(s)!\n💰 Your balance: ${user.coins}\nTotal tickets in pool: ${lotteryPool.length}`
      }, { quoted: msg });

    } 
    // Draw lottery
    else if (action === 'draw') {
      // Only owners can draw
      if (!owners.includes(senderNumber.split('@')[0])) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ Only bot owners can draw the lottery!'
        }, { quoted: msg });
      }

      if (lotteryPool.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ No tickets in the pool yet!'
        }, { quoted: msg });
      }

      // Pick a random winner
      const winnerNumber = lotteryPool[Math.floor(Math.random() * lotteryPool.length)];
      const winner = getUser(winnerNumber);

      // Prize = total tickets × 10 coins
      const prize = lotteryPool.length * 10;
      winner.coins += prize;

      saveUsers();

      // Reset lottery
      lotteryPool = [];

      await sock.sendMessage(msg.key.remoteJid, {
        text: `🎉 Lottery Draw Complete!\nWinner: @${winnerNumber.split('@')[0]}\nPrize: ${prize} coins!`,
        mentions: [winnerNumber]
      }, { quoted: msg });
    } 
    else {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Invalid action! Use .lottery buy <amount> or .lottery draw'
      }, { quoted: msg });
    }
  }
});