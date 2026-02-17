import red from '../../lib/red.js';
import { getGroup, updateGroup } from '../../data/groups.js';

red.bot({
  cmd: 'antilink',
  desc: 'Manage antilink protection in your group',
  fromMe: false,
  type: 'group',
  react: '🔗',
  filename: import.meta.url,
  handler: async (sock, msg, args, { sender, isGroup }) => {
    if (!isGroup) 
      return await sock.sendMessage(msg.key.remoteJid, { text: '❌ This command only works in groups' }, { quoted: msg });

    const groupId = msg.key.remoteJid;

    // Fetch group metadata
    let groupMetadata;
    try {
      groupMetadata = await sock.groupMetadata(groupId);
    } catch {
      return await sock.sendMessage(groupId, { text: '❌ Failed to fetch group info' }, { quoted: msg });
    }

    // Fix sender ID format
    const senderId = sender.includes('@s.whatsapp.net') ? sender : sender + '@s.whatsapp.net';
    const participant = groupMetadata.participants.find(p => p.id === senderId);

    // Check if admin or bot owner
    const isAdmin = participant && (participant.admin === 'admin' || participant.admin === 'superadmin' || participant.superAdmin);
    const isOwner = process.env.OWNERS?.split(',').includes(senderId.split('@')[0]);

    if (!isAdmin && !isOwner)
      return await sock.sendMessage(groupId, { text: '❌ Only admins can use this' }, { quoted: msg });

    const groupData = getGroup(groupId);

    if (!args[0]) 
      return await sock.sendMessage(groupId, { text: '❌ Usage: .antilink on/off/warn/kick/delete [count]' }, { quoted: msg });

    const sub = args[0].toLowerCase();

    if (sub === 'on') {
      updateGroup(groupId, { antilink: true });
      return await sock.sendMessage(groupId, { text: '✅ Antilink enabled' }, { quoted: msg });
    }

    if (sub === 'off') {
      updateGroup(groupId, { antilink: false });
      return await sock.sendMessage(groupId, { text: '❌ Antilink disabled' }, { quoted: msg });
    }

    if (!groupData.antilink) 
      return await sock.sendMessage(groupId, { text: '❌ Turn on antilink first with .antilink on' }, { quoted: msg });

    if (sub === 'warn' || sub === 'kick' || sub === 'delete') {
      const value = args[1] ? parseInt(args[1]) : null;
      const settings = { ...groupData.settings };

      if (sub === 'warn') {
        settings.antilinkAction = 'warn';
        settings.antilinkCount = value || 1;
      } else settings.antilinkAction = sub;

      updateGroup(groupId, { settings });
      return await sock.sendMessage(
        groupId,
        { text: `⚠️ Antilink action set to ${sub}${sub === 'warn' ? ' after ' + settings.antilinkCount + ' infractions' : ''}` },
        { quoted: msg }
      );
    }

    await sock.sendMessage(groupId, { text: '❌ Invalid subcommand. Use on/off/warn/kick/delete' }, { quoted: msg });
  }
});