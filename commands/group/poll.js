import red from '../../lib/red.js';
import { groups } from '../../data/groups.js';

// Store polls in memory (can be saved to JSON if needed)
const activePolls = {};

red.bot({
  cmd: "poll",
  desc: "Create a single-choice poll in the group",
  fromMe: false,
  type: "group",
  react: "📊",
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, {
        text: '❌ This command can only be used in groups'
      }, { quoted: msg });
    }

    const groupId = msg.key.remoteJid;

    // If args is empty, show usage
    if (!args.length) {
      return await sock.sendMessage(groupId, {
        text: `📊 *Poll Feature*\n\nUsage:\n.poll <question> | <option1> | <option2>\n\nOnly one option per user is allowed.`
      }, { quoted: msg });
    }

    // Parse question and options
    const content = args.join(' ').split('|').map(s => s.trim());
    if (content.length < 3) {
      return await sock.sendMessage(groupId, {
        text: '❌ Please provide a question and at least 2 options\nUsage:\n.poll <question> | <option1> | <option2>'
      }, { quoted: msg });
    }

    const question = content[0];
    const options = content.slice(1);

    // Create poll
    activePolls[groupId] = {
      question,
      options,
      votes: {}, // userJid: optionIndex
    };

    // Build poll message
    let pollText = `📊 *New Poll*\n\n*${question}*\n\n`;
    options.forEach((opt, idx) => {
      pollText += `${idx + 1}. ${opt}\n`;
    });
    pollText += `\nReply with the option number to vote (1-${options.length}). Only one vote allowed.`;

    await sock.sendMessage(groupId, { text: pollText }, { quoted: msg });
  }
});

// Optional: Add a separate listener in your index.js or message handler to handle voting:
// sock.ev.on('messages.upsert', async ({ messages, type }) => {
//   const msg = messages[0];
//   if (!msg.message || msg.key.fromMe) return;
//   const groupId = msg.key.remoteJid;
//   const poll = activePolls[groupId];
//   if (!poll) return;

//   const text = msg.message.conversation;
//   const vote = parseInt(text);
//   if (!isNaN(vote) && vote > 0 && vote <= poll.options.length) {
//     if (poll.votes[msg.key.participant || msg.key.remoteJid]) {
//       await sock.sendMessage(groupId, { text: '❌ You have already voted!' }, { quoted: msg });
//       return;
//     }
//     poll.votes[msg.key.participant || msg.key.remoteJid] = vote - 1;
//     await sock.sendMessage(groupId, { text: `✅ Vote recorded for option: ${poll.options[vote - 1]}` }, { quoted: msg });
//   }
// });