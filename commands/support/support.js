import red from '../../lib/red.js';
import { Buffer } from 'buffer';
import { config } from 'dotenv';
config(); // load .env

red.bot({
  cmd: 'support',
  desc: 'Get official support links for WhatsApp and Discord with banner image from .env',
  fromMe: false,
  type: 'support',
  react: '🛠️',
  filename: import.meta.url,
  handler: async (sock, msg) => {
    const imageUrl = process.env.RED_IMAGE; // fetch image from .env

    if (!imageUrl) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '❌ RED_IMAGE is not set in .env' }, { quoted: msg });
    }

    const text = `
🛠️ *Official Support Links* 🛠️

📱 *WhatsApp Support:* 
https://chat.whatsapp.com/IUCqqmql60qEEBCWOqNiBd

💬 *Discord Support:* 
https://discord.gg/2Km7qcPMT

───────────────────
💫 Join us for help, updates, and community!
`;

    try {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await sock.sendMessage(msg.key.remoteJid, {
        image: buffer,
        caption: text
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Failed to load image from RED_IMAGE\nError: ${err.message}` }, { quoted: msg });
    }
  }
});