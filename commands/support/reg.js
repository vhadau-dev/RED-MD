import red from '../../lib/red.js';
import { getUser, createUser } from '../../data/users.js'; // ✅ correct path

red.bot({
  cmd: 'reg',
  desc: 'Register yourself to play gambling commands',
  fromMe: false,
  type: 'support',
  react: '✅',
  filename: import.meta.url,
  handler: async (sock, msg, args, { senderNumber }) => {
    if (!args[0]) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Please enter your age. Example: .reg 15'
      }, { quoted: msg });
    }

    const age = parseInt(args[0]);
    if (isNaN(age) || age < 13) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ Invalid age! You must be 13 or older to register.'
      }, { quoted: msg });
    }

    if (getUser(senderNumber)) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '✅ You are already registered!'
      }, { quoted: msg });
    }

    createUser(senderNumber, age);

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎉 Registration complete! You now have 100 coins to play gambling games.`
    }, { quoted: msg });
  }
});