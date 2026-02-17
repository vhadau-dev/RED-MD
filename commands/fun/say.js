import red from '../../lib/red.js';

red.bot({
  cmd: "say",
  desc: "Make the bot say something",
  fromMe: false,
  type: "fun",
  react: "💬",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const text = args.join(' ');
    
    if (!text) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Please provide text for me to say\nUsage: .say <text>'
      }, { quoted: msg });
    }
    
    await sock.sendMessage(msg.key.remoteJid, { text });
  }
});
