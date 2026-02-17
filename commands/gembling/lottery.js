import red from '../../lib/red.js';
import { getUser, saveUsers } from '../../data/users.js';
import { getLotteryData, saveLotteryData } from '../../data/lottery.js';
import { config } from 'dotenv';
config();

const owners = process.env.OWNERS ? process.env.OWNERS.split(',') : [];

red.bot({
  cmd: 'lottery',
  desc: 'Buy lottery tickets or draw the lottery (owner only)',
  fromMe: false,
  type: 'gambling',
  react: '🎟️',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const user = getUser(senderNumber);
    if (!user) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Register first with .reg <age>' }, { quoted: msg });

    if (!args[0]) return await sock.sendMessage(msg.key.remoteJid, { text: 'Usage: .lottery buy <amount> or .lottery draw' }, { quoted: msg });

    const data = getLotteryData();

    const action = args[0].toLowerCase();
    if (action === 'buy') {
      const ticketAmount = parseInt(args[1]);
      if (isNaN(ticketAmount) || ticketAmount <= 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid ticket amount!' }, { quoted: msg });
      if (ticketAmount > user.coins) return await sock.sendMessage(msg.key.remoteJid, { text: `❌ Not enough coins! Balance: ${user.coins}` }, { quoted: msg });

      user.coins -= ticketAmount;
      for (let i = 0; i < ticketAmount; i++) data.pool.push(senderNumber);

      saveUsers();
      saveLotteryData(data);

      return await sock.sendMessage(msg.key.remoteJid, { text: `🎟️ Bought ${ticketAmount} ticket(s)! Pool size: ${data.pool.length}` }, { quoted: msg });

    } else if (action === 'draw') {
      if (!owners.includes(senderNumber.split('@')[0])) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Only owners can draw lottery!' }, { quoted: msg });
      if (data.pool.length === 0) return await sock.sendMessage(msg.key.remoteJid, { text: '❌ No tickets in pool!' }, { quoted: msg });

      const winnerNumber = data.pool[Math.floor(Math.random() * data.pool.length)];
      const winner = getUser(winnerNumber);

      const prize = data.pool.length * 10;
      winner.coins += prize;

      data.lastWinner = winnerNumber;
      data.pool = [];

      saveUsers();
      saveLotteryData(data);

      await sock.sendMessage(msg.key.remoteJid, { text: `🎉 Lottery Draw Complete!\nWinner: @${winnerNumber.split('@')[0]}\nPrize: ${prize} coins!`, mentions: [winnerNumber] }, { quoted: msg });
    } else {
      return await sock.sendMessage(msg.key.remoteJid, { text: '❌ Invalid action! Use buy or draw.' }, { quoted: msg });
    }
  }
});