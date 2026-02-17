import red from '../../lib/red.js';
import { random } from '../../lib/utils.js';

red.bot({
  cmd: "rate",
  desc: "Rate something or someone",
  fromMe: false,
  type: "fun",
  react: "⭐",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const thing = args.join(' ');
    
    if (!thing) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Please specify what to rate\nUsage: .rate <something>'
      }, { quoted: msg });
    }
    
    const rating = random(0, 100);
    const stars = '⭐'.repeat(Math.ceil(rating / 20));
    
    let comment = '';
    if (rating < 20) comment = 'Terrible! 😱';
    else if (rating < 40) comment = 'Not great... 😕';
    else if (rating < 60) comment = 'Average 😐';
    else if (rating < 80) comment = 'Pretty good! 😊';
    else comment = 'Excellent! 🎉';
    
    const text = `⭐ *Rating*\n\n` +
      `${thing}\n\n` +
      `Rating: ${rating}/100\n` +
      `${stars}\n\n` +
      `${comment}`;
    
    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});
