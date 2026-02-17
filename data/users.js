import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const jsonPath = path.join(__dirname, 'data', 'users.json');

let users = {};

if (fs.existsSync(jsonPath)) {
    try {
        users = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (e) {
        users = {};
    }
}

export function saveUsers() {
    fs.writeFileSync(jsonPath, JSON.stringify(users, null, 2));
}

export function getUsers() {
    return users;
}

export function getUser(number) {
    return users[number] || null;
}

export function createUser(number, age) {
    if (!users[number]) {
        users[number] = {
            age,
            coins: 25000,
            registered: true
        };
        saveUsers();
    }
    return users[number];
}

export { users };
export default users;
