import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const jsonPath = path.join(__dirname, 'data', 'mods.json');

let mods = [];

if (fs.existsSync(jsonPath)) {
    try {
        mods = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (e) {
        mods = [];
    }
}

export function saveMods() {
    fs.writeFileSync(jsonPath, JSON.stringify(mods, null, 2));
}

export { mods };
