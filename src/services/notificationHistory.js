class NotificationHistory {
  constructor() {
    this.history = [];
    this.maxItems = 100;
  }

  add(type, message) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: type, // 'ticket', 'error', 'info'
      message: message
    };

    this.history.unshift(entry); // Add to beginning

    // Keep only the last maxItems
    if (this.history.length > this.maxItems) {
      this.history = this.history.slice(0, this.maxItems);
    }
  }

  getAll() {
    return this.history;
  }

  clear() {
    this.history = [];
  }
}

module.exports = NotificationHistory;

