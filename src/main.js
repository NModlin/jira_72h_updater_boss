const { app, Tray, Menu, BrowserWindow, ipcMain, Notification, shell, nativeImage, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const JiraService = require('./services/jiraService');
const NotificationHistory = require('./services/notificationHistory');
const fs = require('fs');
const os = require('os');

// Setup error logging
const logPath = path.join(app.getPath('userData'), 'error.log');
process.on('uncaughtException', (error) => {
  const errorMessage = `[${new Date().toISOString()}] Uncaught Exception: ${error.stack || error}\n`;
  fs.appendFileSync(logPath, errorMessage);
  console.error(errorMessage);
  // Optional: Show dialog on fatal error
  // dialog.showErrorBox('Unexpected Error', 'An error occurred. Please check the logs.');
});

const store = new Store();
const notificationHistory = new NotificationHistory();

// Windows
let tray = null;
let settingsWindow = null;
let historyWindow = null;
let dashboardWindow = null;
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

  // UX Improvement: Auto-open settings if not configured
  const settings = store.get('jiraSettings');
  if (!settings || !settings.jiraUrl || !settings.apiToken) {
    openSettingsWindow();
  }
});

app.on('window-all-closed', (e) => {
  // Don't quit the app when all windows are closed (tray app)
  e.preventDefault();
});

// macOS: Handle dock icon click
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    openSettingsWindow();
  }
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
  tray.setToolTip('Jira 72h Updater - Boss Edition with Dashboard');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Dashboard',
      click: () => openDashboardWindow(),
      type: 'normal'
    },
    {
      type: 'separator'
    },
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

  // Double-click tray icon to open dashboard
  tray.on('double-click', () => {
    openDashboardWindow();
  });
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

// Open Dashboard Window
function openDashboardWindow() {
  if (dashboardWindow) {
    dashboardWindow.focus();
    return;
  }

  dashboardWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: 'Jira Boss Dashboard - Visual Analytics & AI Insights',
    icon: path.join(__dirname, '../assets/icon.png')
  });

  // Load dashboard (dev or production)
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    // Development: Load from Vite dev server
    dashboardWindow.loadURL('http://localhost:5173');
    // dashboardWindow.webContents.openDevTools(); // Uncomment for debugging
  } else {
    // Production: Load from built files
    dashboardWindow.loadFile(path.join(__dirname, '../dashboard/dist/index.html'));
  }

  dashboardWindow.on('closed', () => {
    dashboardWindow = null;
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
    // Open dashboard and send ticket key to highlight it
    openDashboardWindow();

    if (dashboardWindow) {
      // Wait a bit for dashboard to load, then send ticket key
      setTimeout(() => {
        dashboardWindow.webContents.send('open-ticket', ticket.key);
      }, 1000);
    }

    // Also open in browser as fallback
    const settings = store.get('jiraSettings');
    const ticketUrl = `${settings.jiraUrl}/browse/${ticket.key}`;
    // Commenting out to use dashboard primarily
    // shell.openExternal(ticketUrl);
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

// Dashboard IPC Handlers

// Get settings for dashboard
ipcMain.handle('get-settings', async () => {
  return store.get('jiraSettings', {
    jiraUrl: '',
    userEmail: '',
    apiToken: '',
    teamEmails: [],
    statuses: ['In Progress', 'Open', 'Waiting for Support', 'Waiting for Customer'],
    hoursThreshold: 72
  });
});

// Save settings from dashboard
ipcMain.handle('save-settings', async (event, settings) => {
  store.set('jiraSettings', settings);
  return true;
});

// Fetch tickets using current JQL
ipcMain.handle('fetch-tickets', async (event, customJQL) => {
  const settings = store.get('jiraSettings');

  if (!settings || !settings.jiraUrl || !settings.userEmail || !settings.apiToken) {
    throw new Error('Please configure Jira settings first');
  }

  const jiraService = new JiraService(
    settings.jiraUrl,
    settings.userEmail,
    settings.apiToken,
    settings.teamEmails,
    settings.statuses,
    settings.hoursThreshold
  );

  try {
    if (customJQL) {
      // Use custom JQL if provided
      return await jiraService.searchWithJQL(customJQL);
    } else {
      // Use default stale tickets query
      return await jiraService.getStaleTickets();
    }
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    throw error;
  }
});

// Fetch single ticket details
ipcMain.handle('fetch-ticket-details', async (event, issueKey) => {
  const settings = store.get('jiraSettings');

  const jiraService = new JiraService(
    settings.jiraUrl,
    settings.userEmail,
    settings.apiToken,
    settings.teamEmails,
    settings.statuses,
    settings.hoursThreshold
  );

  return await jiraService.getIssueDetails(issueKey);
});

// Get current JQL query
ipcMain.handle('get-jql', async () => {
  const settings = store.get('jiraSettings');

  if (!settings || !settings.jiraUrl) {
    return 'project = HD AND updated <= -72h';
  }

  const jiraService = new JiraService(
    settings.jiraUrl,
    settings.userEmail,
    settings.apiToken,
    settings.teamEmails,
    settings.statuses,
    settings.hoursThreshold
  );

  return jiraService.buildJQL();
});

// Save custom JQL
ipcMain.handle('save-jql', async (event, jql) => {
  store.set('customJQL', jql);
  return true;
});

// Test JQL query
ipcMain.handle('test-jql', async (event, jql) => {
  const settings = store.get('jiraSettings');

  const jiraService = new JiraService(
    settings.jiraUrl,
    settings.userEmail,
    settings.apiToken,
    settings.teamEmails,
    settings.statuses,
    settings.hoursThreshold
  );

  try {
    const results = await jiraService.searchWithJQL(jql);
    return { success: true, count: results.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Rovo AI integration
ipcMain.handle('ask-rovo', async (event, question) => {
  const settings = store.get('jiraSettings');

  if (!settings || !settings.jiraUrl || !settings.apiToken) {
    throw new Error('Jira not configured');
  }

  try {
    // Call Atlassian Rovo API
    const auth = Buffer.from(`${settings.userEmail}:${settings.apiToken}`).toString('base64');

    const response = await fetch(`${settings.jiraUrl}/gateway/api/rovo/chat/v1/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: question
          }
        ],
        context: {
          products: ['jira'],
          sites: [settings.jiraUrl]
        }
      })
    });

    const data = await response.json();
    return data.messages?.[0]?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Rovo error:', error);
    throw new Error('Failed to connect to Rovo AI');
  }
});

// AI-generated graph data
ipcMain.handle('generate-graph', async (event, request) => {
  // This will use Rovo to interpret the request and return structured data
  const settings = store.get('jiraSettings');

  const prompt = `Based on this request: "${request}", generate a JSON response with chart data for Jira tickets. 
  Return format: { "chartType": "bar|line|pie", "data": [...], "labels": [...], "title": "..." }`;

  try {
    const auth = Buffer.from(`${settings.userEmail}:${settings.apiToken}`).toString('base64');

    const response = await fetch(`${settings.jiraUrl}/gateway/api/rovo/chat/v1/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        context: {
          products: ['jira'],
          sites: [settings.jiraUrl]
        }
      })
    });

    const data = await response.json();
    const content = data.messages?.[0]?.content;

    // Parse JSON from Rovo's response
    try {
      return JSON.parse(content);
    } catch {
      // If not JSON, return default structure
      return {
        chartType: 'bar',
        data: [],
        labels: [],
        title: 'Unable to generate graph',
        error: 'Could not parse AI response'
      };
    }
  } catch (error) {
    console.error('Generate graph error:', error);
    throw error;
  }
});

// Get notification history
ipcMain.handle('get-history', async () => {
  return notificationHistory.getAll();
});

// Window controls
ipcMain.on('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) window.close();
});

ipcMain.on('minimize-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) window.minimize();
});

// Send notification from dashboard
ipcMain.on('show-notification', (event, { title, body }) => {
  const notification = new Notification({
    title,
    body,
    icon: path.join(__dirname, '../assets/icon.png')
  });
  notification.show();
});
