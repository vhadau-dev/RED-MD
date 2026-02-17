import config from '../config.js';

// Format currency
export function formatCurrency(amount) {
  return `${config.DEFAULT_CURRENCY} ${amount.toLocaleString()}`;
}

// Format phone number
export function formatPhone(jid) {
  return jid.replace('@s.whatsapp.net', '').replace('@g.us', '');
}

// Get mention tag
export function getMention(jid) {
  return `@${formatPhone(jid)}`;
}

// Check cooldown
export function checkCooldown(lastTime, cooldownMs) {
  if (!lastTime) return { canUse: true, remaining: 0 };
  
  const now = Date.now();
  const timePassed = now - new Date(lastTime).getTime();
  const remaining = cooldownMs - timePassed;
  
  if (remaining <= 0) {
    return { canUse: true, remaining: 0 };
  }
  
  return { canUse: false, remaining };
}

// Format time remaining
export function formatTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

// Random number between min and max (inclusive)
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random choice from array
export function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Calculate win/loss for gambling
export function calculateGambleResult(bet, winChance = 0.5) {
  const won = Math.random() < winChance;
  const multiplier = won ? random(1.5, 2.5) : 0;
  const winAmount = Math.floor(bet * multiplier);
  
  return { won, winAmount, multiplier };
}

// Validate bet amount
export function validateBet(bet, balance) {
  if (isNaN(bet) || bet < config.MIN_BET) {
    return { valid: false, message: `❌ Minimum bet is ${formatCurrency(config.MIN_BET)}` };
  }
  
  if (bet > config.MAX_BET) {
    return { valid: false, message: `❌ Maximum bet is ${formatCurrency(config.MAX_BET)}` };
  }
  
  if (bet > balance) {
    return { valid: false, message: `❌ Insufficient balance. You have ${formatCurrency(balance)}` };
  }
  
  return { valid: true };
}

// Extract mentioned users from message
export function extractMentions(msg) {
  const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
  return mentions;
}

// Get quoted message
export function getQuotedMessage(msg) {
  return msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
}

// Sleep function
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  formatCurrency,
  formatPhone,
  getMention,
  checkCooldown,
  formatTime,
  random,
  randomChoice,
  calculateGambleResult,
  validateBet,
  extractMentions,
  getQuotedMessage,
  sleep
};
