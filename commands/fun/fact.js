import red from '../../lib/red.js';
import { randomChoice } from '../../lib/utils.js';

const facts = [
  "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible!",
  "A group of flamingos is called a 'flamboyance'.",
  "Octopuses have three hearts and red blood.",
  "Bananas are berries, but strawberries aren't!",
  "The shortest war in history lasted only 38 minutes (Anglo-Zanzibar War, 1896).",
  "A single cloud can weigh more than 1 million pounds.",
  "Sharks existed before trees. Sharks have been around for about 400 million years, while trees have been around for 350 million years.",
  "The human brain uses 20% of the body's energy despite being only 2% of its mass.",
  "There are more stars in the universe than grains of sand on all Earth's beaches.",
  "A day on Venus is longer than a year on Venus!"
];

red.bot({
  cmd: "fact",
  desc: "Get a random fun fact",
  fromMe: false,
  type: "fun",
  react: "🧠",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const fact = randomChoice(facts);
    await sock.sendMessage(msg.key.remoteJid, { 
      text: `🧠 *Fun Fact*\n\n${fact}` 
    }, { quoted: msg });
  }
});
