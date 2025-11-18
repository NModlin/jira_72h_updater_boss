const { app, Tray, Menu, BrowserWindow, ipcMain, Notification, shell, nativeImage } = require('electron');
const path = require('path');
const Store = require('electron-store');
const JiraService = require('./services/jiraService');
const NotificationHistory = require('./services/notificationHistory');
const fs = require('fs');

const store = new Store();
const notificationHistory = new NotificationHistory();

// Windows
let tray = null;
let settingsWindow = null;
let historyWindow = null;
let checkInterval = null;

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

// App initialization
app.whenReady().then(() => {
  createTray();
  startBackgroundChecker();
});

app.on('window-all-closed', (e) => {
  // Don't quit the app when all windows are closed (tray app)
  e.preventDefault();
});

// Create fallback icon if main icon fails
function createFallbackIcon() {
  const size = process.platform === 'darwin' ? 22 : 16;
  const canvas = require('electron').nativeImage.createEmpty();
  return canvas;
}

// Create system tray
function createTray() {
  const iconPath = path.join(__dirname, '../assets/icon.png');
  
  let trayIcon;
  if (fs.existsSync(iconPath)) {
    try {
      trayIcon = nativeImage.createFromPath(iconPath);
      if (trayIcon.isEmpty()) {
        console.warn('Icon is empty, using fallback');
        trayIcon = createFallbackIcon();
      } else {
        // Resize for tray
        if (process.platform === 'win32') {
          trayIcon = trayIcon.resize({ width: 16, height: 16 });
        } else if (process.platform === 'darwin') {
          trayIcon = trayIcon.resize({ width: 22, height: 22 });
        }
      }
    } catch (error) {
      console.error('Error loading icon:', error);
      trayIcon = createFallbackIcon();
    }
  } else {
    console.warn('Icon file not found:', iconPath);
    trayIcon = createFallbackIcon();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('Jira 72h Updater - Boss Edition');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => openSettingsWindow()
    },
    {
      label: 'View History',
      click: () => openHistoryWindow()
    },
    {
      label: 'Check Now',
      click: () => performJiraCheck()
    },
    {
      type: 'separator'
    },
    {
      label: 'Exit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
}

// Open Settings Window
function openSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 600,
    height: 750,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'Settings - Jira 72h Updater Boss Edition'
  });

  settingsWindow.loadFile(path.join(__dirname, 'windows/settings.html'));

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

// Open History Window
function openHistoryWindow() {
  if (historyWindow) {
    historyWindow.focus();
    return;
  }

  historyWindow = new BrowserWindow({
    width: 500,
    height: 600,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'Notification History - Jira 72h Updater Boss Edition'
  });

  historyWindow.loadFile(path.join(__dirname, 'windows/history.html'));

  historyWindow.on('closed', () => {
    historyWindow = null;
  });
}

// Background checker
function startBackgroundChecker() {
  // Initial check after 5 seconds
  setTimeout(() => {
    performJiraCheck();
  }, 5000);

  // Then check every hour
  checkInterval = setInterval(() => {
    performJiraCheck();
  }, 60 * 60 * 1000); // 1 hour
}

// Perform Jira check
async function performJiraCheck() {
  const settings = store.get('jiraSettings');

  if (!settings || !settings.jiraUrl || !settings.userEmail || !settings.apiToken ||
      !settings.teamEmails || settings.teamEmails.length === 0) {
    console.log('Settings not configured, skipping check');
    return;
  }

  console.log('Performing Jira check...');

  const jiraService = new JiraService(
    settings.jiraUrl,
    settings.userEmail,
    settings.apiToken,
    settings.teamEmails,
    settings.statuses,
    settings.hoursThreshold
  );

  try {
    const tickets = await jiraService.getStaleTickets();
    
    console.log(`Found ${tickets.length} stale tickets`);

    if (tickets.length === 0) {
      // Log that check was performed
      notificationHistory.add('info', 'Check completed - No stale tickets found');
      updateHistoryWindow();
    } else {
      // Send notification for each ticket
      tickets.forEach(ticket => {
        sendTicketNotification(ticket);
      });
    }
  } catch (error) {
    console.error('Jira check failed:', error);
    
    if (error.status === 401) {
      sendErrorNotification();
    } else {
      notificationHistory.add('error', `Check failed: ${error.message}`);
      updateHistoryWindow();
    }
  }
}

// Send ticket notification
function sendTicketNotification(ticket) {
  const notification = new Notification({
    title: `Jira Ticket Needs Update: ${ticket.key}`,
    body: ticket.summary,
    icon: path.join(__dirname, '../assets/icon.png')
  });

  notification.on('click', () => {
    const settings = store.get('jiraSettings');
    const ticketUrl = `${settings.jiraUrl}/browse/${ticket.key}`;
    shell.openExternal(ticketUrl);
  });

  notification.show();

  // Add to history
  notificationHistory.add('ticket', `${ticket.key}: ${ticket.summary}`);
  updateHistoryWindow();
}

// Send error notification
function sendErrorNotification() {
  const notification = new Notification({
    title: 'Jira Notifier Error',
    body: 'Your Jira API Token is invalid or has expired. Please update it in Settings.',
    icon: path.join(__dirname, '../assets/icon.png')
  });

  notification.on('click', () => {
    openSettingsWindow();
  });

  notification.show();

  // Add to history
  notificationHistory.add('error', 'API Token is invalid or expired');
  updateHistoryWindow();
}

// Update history window if open
function updateHistoryWindow() {
  if (historyWindow) {
    historyWindow.webContents.send('history-updated', notificationHistory.getAll());
  }
}

// IPC Handlers
ipcMain.on('save-settings', (event, settings) => {
  store.set('jiraSettings', settings);
  event.reply('settings-saved', true);
});

ipcMain.on('load-settings', (event) => {
  const settings = store.get('jiraSettings', {
    jiraUrl: '',
    userEmail: '',
    apiToken: '',
    teamEmails: [],
    statuses: ['In Progress', 'Open', 'Waiting for Support', 'Waiting for Customer'],
    hoursThreshold: 72
  });
  event.reply('settings-loaded', settings);
});

ipcMain.on('test-connection', async (event, settings) => {
  const jiraService = new JiraService(
    settings.jiraUrl,
    settings.userEmail,
    settings.apiToken,
    settings.teamEmails,
    settings.statuses,
    settings.hoursThreshold
  );

  try {
    await jiraService.testConnection();

    // Also test the JQL query
    const jql = jiraService.buildJQL();
    event.reply('test-result', {
      success: true,
      message: `Connection successful!\n\nGenerated JQL Query:\n${jql}`
    });
  } catch (error) {
    event.reply('test-result', { success: false, message: error.message });
  }
});

ipcMain.on('get-history', (event) => {
  event.reply('history-data', notificationHistory.getAll());
});

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

