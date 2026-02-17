import red from '../../lib/red.js';
import { randomChoice } from '../../lib/utils.js';

const truths = [
  "What's the most embarrassing thing you've ever done?",
  "Have you ever lied to your best friend?",
  "What's your biggest fear?",
  "What's the worst thing you've ever said to someone?",
  "Have you ever cheated on a test?",
  "What's your biggest secret?",
  "Who was your first crush?",
  "What's the most childish thing you still do?",
  "What's a bad habit you have?",
  "Have you ever broken the law?",
  "What's something you're glad your parents don't know about you?",
  "What's the longest you've gone without showering?"
];

red.bot({
  cmd: "truth",
  desc: "Get a truth question",
  fromMe: false,
  type: "fun",
  react: "🤔",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const truth = randomChoice(truths);
    await sock.sendMessage(msg.key.remoteJid, { 
      text: `🤔 *Truth*\n\n${truth}` 
    }, { quoted: msg });
  }
});
