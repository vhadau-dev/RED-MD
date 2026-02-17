import red from '../../lib/red.js';
import { randomChoice } from '../../lib/utils.js';

const compliments = [
  "You're an awesome friend!",
  "You light up the room!",
  "You have a great sense of humor!",
  "You're more helpful than you realize!",
  "You have impeccable manners!",
  "You're a great listener!",
  "Your smile is contagious!",
  "You're even more beautiful on the inside than on the outside!",
  "You bring out the best in other people!",
  "You're one of a kind!",
  "You're inspiring!",
  "You're a smart cookie!"
];

red.bot({
  cmd: "compliment",
  desc: "Get a compliment",
  fromMe: false,
  type: "fun",
  react: "💖",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const compliment = randomChoice(compliments);
    await sock.sendMessage(msg.key.remoteJid, { 
      text: `💖 *Compliment*\n\n${compliment}` 
    }, { quoted: msg });
  }
});
