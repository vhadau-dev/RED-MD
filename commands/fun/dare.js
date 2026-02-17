import red from '../../lib/red.js';
import { randomChoice } from '../../lib/utils.js';

const dares = [
  "Send a silly selfie to the group",
  "Do 20 pushups",
  "Sing your favorite song",
  "Dance for 1 minute",
  "Post an embarrassing photo",
  "Call a random contact and sing to them",
  "Do your best impression of someone in the group",
  "Speak in an accent for the next 10 minutes",
  "Let someone else send a message from your phone",
  "Change your profile picture to something embarrassing",
  "Tell a joke in the group",
  "Share your most embarrassing moment"
];

red.bot({
  cmd: "dare",
  desc: "Get a dare challenge",
  fromMe: false,
  type: "fun",
  react: "😈",
  filename: import.meta.url,
  handler: async (sock, msg, args) => {
    const dare = randomChoice(dares);
    await sock.sendMessage(msg.key.remoteJid, { 
      text: `😈 *Dare*\n\n${dare}` 
    }, { quoted: msg });
  }
});
