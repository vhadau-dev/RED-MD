import red from '../../lib/red.js';
import { randomChoice } from '../../lib/utils.js';

const roasts = [
  "You're like a software update. Whenever I see you, I think 'Not now.'",
  "If I had a dollar for every smart thing you say, I'd be broke.",
  "You're proof that evolution can go in reverse.",
  "I'd agree with you, but then we'd both be wrong.",
  "You're not stupid; you just have bad luck thinking.",
  "I'm jealous of people who don't know you.",
  "You bring everyone so much joy... when you leave the room.",
  "I'd explain it to you, but I left my English-to-Dingbat dictionary at home.",
  "You're like a cloud. When you disappear, it's a beautiful day.",
  "If laughter is the best medicine, your face must be curing the world!"
];

red.bot({
  cmd: "roast",
  desc: "Get roasted!",
  fromMe: false,
  type: "fun",
  react: "🔥",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const roast = randomChoice(roasts);
    await sock.sendMessage(msg.key.remoteJid, { 
      text: `🔥 *Roasted!*\n\n${roast}` 
    }, { quoted: msg });
  }
});
