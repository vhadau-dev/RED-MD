import red from '../../lib/red.js';

red.bot({
  cmd: "meme",
  desc: "Get a random meme",
  fromMe: false,
  type: "fun",
  react: "😆",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const text = `😆 *Random Meme*\n\n` +
      `Meme generation coming soon!\n` +
      `This will fetch random memes from popular sources.`;
    
    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});
