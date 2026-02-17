// data/users.js
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./base/users.json'); // use .json for easier parsing

// Load users or initialize empty
let users = {};
if (fs.existsSync(filePath)) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    users = JSON.parse(raw);
  } catch (e) {
    console.error('Error reading users file:', e);
    users = {};
  }
}

// Save helper
export function saveUsers() {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

// Get all users
export function getUsers() {
  return users;
}

// Get single user
export function getUser(number) {
  return users[number] || null;
}

// Create new user
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

// Optional: export users object
export default users;