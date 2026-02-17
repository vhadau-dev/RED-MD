import red from '../../lib/red.js';
import { randomChoice } from '../../lib/utils.js';

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a fake noodle? An impasta!",
  "Why did the bicycle fall over? It was two tired!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What did the ocean say to the beach? Nothing, it just waved!",
  "Why did the math book look sad? Because it had too many problems!",
  "What do you call cheese that isn't yours? Nacho cheese!"
];

red.bot({
  cmd: "joke",
  desc: "Get a random joke",
  fromMe: false,
  type: "fun",
  react: "😂",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const joke = randomChoice(jokes);
    await sock.sendMessage(msg.key.remoteJid, { 
      text: `😂 *Random Joke*\n\n${joke}` 
    }, { quoted: msg });
  }
});
