import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./base/lottery.json');

export function getLotteryData() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ pool: [], lastWinner: null }, null, 2));
  }
  const data = JSON.parse(fs.readFileSync(filePath));
  return data;
}

export function saveLotteryData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}