import red from '../../lib/red.js';

red.bot({
  cmd: "ascii",
  desc: "Convert text to ASCII art",
  fromMe: false,
  type: "fun",
  react: "🎨",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const text = args.join(' ');
    
    if (!text) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Please provide text to convert\nUsage: .ascii <text>'
      }, { quoted: msg });
    }
    
    // Simple ASCII art conversion (basic implementation)
    const asciiText = `\`\`\`\n${text.toUpperCase()}\n\`\`\``;
    
    await sock.sendMessage(msg.key.remoteJid, { 
      text: `🎨 *ASCII Art*\n\n${asciiText}\n\n_Note: Advanced ASCII art coming soon!_` 
    }, { quoted: msg });
  }
});
