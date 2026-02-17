import red from '../../lib/red.js';
import config from '../../config.js';

red.bot({
  cmd: "funhelp",
  desc: "Show fun commands help",
  fromMe: false,
  type: "fun",
  react: "❓",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const text = `🎉 *Fun Commands Help*\n\n` +
      `*Entertainment:*\n` +
      `${config.PREFIX}joke - Get a random joke\n` +
      `${config.PREFIX}meme - Get a random meme\n` +
      `${config.PREFIX}quote - Get an inspirational quote\n` +
      `${config.PREFIX}fact - Get a fun fact\n` +
      `${config.PREFIX}emoji - Get a random emoji\n\n` +
      `*Social:*\n` +
      `${config.PREFIX}roast - Get roasted\n` +
      `${config.PREFIX}compliment - Get a compliment\n` +
      `${config.PREFIX}ship @user1 @user2 - Ship two people\n` +
      `${config.PREFIX}rate <thing> - Rate something\n\n` +
      `*Games:*\n` +
      `${config.PREFIX}truth - Get a truth question\n` +
      `${config.PREFIX}dare - Get a dare challenge\n\n` +
      `*Utility:*\n` +
      `${config.PREFIX}ascii <text> - Convert to ASCII art\n` +
      `${config.PREFIX}say <text> - Make bot say something`;
    
    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});
