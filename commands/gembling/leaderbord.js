import red from '../../lib/red.js';
import { getUsers } from '../../data/users.js';

red.bot({
  cmd: 'leaderboard',
  desc: 'Show the richest users with a cool style',
  fromMe: false,
  type: 'gambling',
  react: '🏆',
  filename: import.meta.url,
  handler: async (sock, msg) => {
    const users = getUsers();
    if (!users || Object.keys(users).length === 0) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ No registered users yet!'
      }, { quoted: msg });
    }

    // Sort users by coins descending
    const sorted = Object.entries(users)
      .sort(([, a], [, b]) => b.coins - a.coins)
      .slice(0, 10); // top 10 users

    // Cool emojis for top ranks
    const rankEmojis = ['🥇', '🥈', '🥉', '🏅', '🏅', '🏅', '⭐', '⭐', '⭐', '⭐'];

    let leaderboardText = '✨💎 Richest Players 💎✨\n';
    leaderboardText += '─────────────────────\n';

    sorted.forEach(([number, user], index) => {
      const shortNumber = number.split('@')[0];
      const emoji = rankEmojis[index] || '⭐';
      leaderboardText += `${emoji} ${shortNumber} — ${user.coins} coins\n`;
    });

    leaderboardText += '─────────────────────\n';
    leaderboardText += '💰 Keep playing and climb the leaderboard! 💰';

    await sock.sendMessage(msg.key.remoteJid, { text: leaderboardText }, { quoted: msg });
  }
});