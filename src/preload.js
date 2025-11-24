const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Settings
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

    // Jira data fetching
    fetchTickets: (jql) => ipcRenderer.invoke('fetch-tickets', jql),
    fetchTicketDetails: (issueKey) => ipcRenderer.invoke('fetch-ticket-details', issueKey),

    // JQL query management
    getJQL: () => ipcRenderer.invoke('get-jql'),
    saveJQL: (jql) => ipcRenderer.invoke('save-jql', jql),
    testJQL: (jql) => ipcRenderer.invoke('test-jql', jql),

    // Notifications
    notify: (title, body) => ipcRenderer.send('show-notification', { title, body }),

    // Rovo AI integration
    askRovo: (question) => ipcRenderer.invoke('ask-rovo', question),
    generateGraph: (request) => ipcRenderer.invoke('generate-graph', request),

    // History
    getHistory: () => ipcRenderer.invoke('get-history'),

    // App control
    openExternal: (url) => ipcRenderer.send('open-external', url),
    closeWindow: () => ipcRenderer.send('close-window'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),

    // Event listeners
    onTicketClick: (callback) => ipcRenderer.on('open-ticket', (event, ticketKey) => callback(ticketKey)),
    onSettingsUpdate: (callback) => ipcRenderer.on('settings-updated', (event, settings) => callback(settings))
});
