import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const jsonPath = path.join(__dirname, 'data', 'group.json');

let groups = {};

if (fs.existsSync(jsonPath)) {
    try {
        groups = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (e) {
        groups = {};
    }
}

export function saveGroups() {
    fs.writeFileSync(jsonPath, JSON.stringify(groups, null, 2));
}

export function getGroup(jid) {
    if (!groups[jid]) {
        groups[jid] = {
            jid,
            antilink: false,
            welcome: true,
            goodbye: true,
            welcomeMessage: "Welcome @user to @group!",
            goodbyeMessage: "Goodbye @user!",
            mute: false,
            locked: false,
            rules: "No rules set yet."
        };
        saveGroups();
    }
    return groups[jid];
}

export function updateGroup(jid, settings) {
    const group = getGroup(jid);
    Object.assign(group, settings);
    saveGroups();
    return group;
}

export { groups };
