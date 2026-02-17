import red from '../../lib/red.js';
import { randomChoice } from '../../lib/utils.js';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In the end, we only regret the chances we didn't take.", author: "Lewis Carroll" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" }
];

red.bot({
  cmd: "quote",
  desc: "Get an inspirational quote",
  fromMe: false,
  type: "fun",
  react: "💭",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const quote = randomChoice(quotes);
    const text = `💭 *Inspirational Quote*\n\n"${quote.text}"\n\n— ${quote.author}`;
    
    await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
  }
});
