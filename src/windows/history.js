const { ipcRenderer } = require('electron');

const historyList = document.getElementById('historyList');

// Request history data on load
ipcRenderer.send('get-history');

// Receive history data
ipcRenderer.on('history-data', (event, history) => {
  renderHistory(history);
});

// Listen for history updates
ipcRenderer.on('history-updated', (event, history) => {
  renderHistory(history);
});

function renderHistory(history) {
  if (!history || history.length === 0) {
    historyList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <p>No notifications yet</p>
      </div>
    `;
    return;
  }

  historyList.innerHTML = history.map(item => {
    const date = new Date(item.timestamp);
    const timeString = date.toLocaleString();

    return `
      <div class="history-item ${item.type}">
        <div class="history-time">${timeString}</div>
        <div class="history-message">${escapeHtml(item.message)}</div>
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

