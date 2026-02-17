import red from '../../lib/red.js';
import { getUser } from '../../data/users.js';

red.bot({
  cmd: 'casino',
  desc: 'Open the casino menu and pick a game',
  fromMe: false,
  type: 'gambling',
  react: '🎰',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    const user = getUser(senderNumber);

    if (!user) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ You must register first! Use .reg <age> to play.'
      }, { quoted: msg });
      return;
    }

    const casinoMenu = `
🎰 Welcome to the Casino, @${senderNumber.split('@')[0]}! 🎰
💰 Your balance: ${user.coins} coins

Choose a game by typing the command:
────────────────────────────
🎲 Dice Roll — .dice <number> <bet>
🍒 Slots — .slots <bet>
🪙 Coinflip — .bet <heads/tails> <bet>
💀 Rob — .rob <target-number>
🎟️ Lottery — .lottery buy <amount>
💼 Work — .work
🗓️ Daily Bonus — .daily
🏆 Leaderboard — .leaderboard
────────────────────────────
Have fun and gamble responsibly! ⚡
`;

    await sock.sendMessage(msg.key.remoteJid, {
      text: casinoMenu,
      mentions: [senderNumber]
    }, { quoted: msg });
  }
}); 