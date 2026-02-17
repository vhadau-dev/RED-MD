import red from '../../lib/red.js';
import { randomChoice } from '../../lib/utils.js';

const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'];

red.bot({
  cmd: "emoji",
  desc: "Get a random emoji",
  fromMe: false,
  type: "fun",
  react: "😀",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const emoji = randomChoice(emojis);
    await sock.sendMessage(msg.key.remoteJid, { 
      text: `Random Emoji: ${emoji}` 
    }, { quoted: msg });
  }
});
