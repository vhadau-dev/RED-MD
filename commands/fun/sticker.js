import red from '../../lib/red.js';
import { downloadContentFromMessage } from '@adiwajshing/baileys';
import { Buffer } from 'buffer';

red.bot({
  cmd: 'sticker|s',
  desc: 'Convert an image or short video to a sticker',
  fromMe: false,
  type: 'fun',
  react: '🎨',
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    try {
      // Get the media message (image/video)
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const mediaMessage = msg.message.imageMessage || msg.message.videoMessage || quoted?.imageMessage || quoted?.videoMessage;

      if (!mediaMessage) {
        return await sock.sendMessage(msg.key.remoteJid, {
          text: '❌ Please send or reply to an image/video to convert to sticker'
        }, { quoted: msg });
      }

      // Download the media
      const stream = await downloadContentFromMessage(mediaMessage, mediaMessage.mimetype.split('/')[1]);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      // Send as sticker
      await sock.sendMessage(msg.key.remoteJid, { sticker: buffer }, { quoted: msg });

    } catch (error) {
      console.error(error);
      await sock.sendMessage(msg.key.remoteJid, {
        text: `❌ Failed to create sticker: ${error.message}`
      }, { quoted: msg });
    }
  }
});