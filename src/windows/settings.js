const { ipcRenderer } = require('electron');

// DOM elements
const form = document.getElementById('settingsForm');
const jiraUrlInput = document.getElementById('jiraUrl');
const userEmailInput = document.getElementById('userEmail');
const apiTokenInput = document.getElementById('apiToken');
const teamEmailsInput = document.getElementById('teamEmails');
const hoursThresholdInput = document.getElementById('hoursThreshold');
const statusInProgressCheckbox = document.getElementById('statusInProgress');
const statusOpenCheckbox = document.getElementById('statusOpen');
const statusWaitingSupportCheckbox = document.getElementById('statusWaitingSupport');
const statusWaitingCustomerCheckbox = document.getElementById('statusWaitingCustomer');
const testBtn = document.getElementById('testBtn');
const cancelBtn = document.getElementById('cancelBtn');
const openTokenPageLink = document.getElementById('openTokenPage');
const openTokenPageInlineLink = document.getElementById('openTokenPageInline');
const messageDiv = document.getElementById('message');

// Load settings on window open
ipcRenderer.send('load-settings');

ipcRenderer.on('settings-loaded', (event, settings) => {
  jiraUrlInput.value = settings.jiraUrl || '';
  userEmailInput.value = settings.userEmail || '';
  apiTokenInput.value = settings.apiToken || '';

  // Load team emails
  if (settings.teamEmails && Array.isArray(settings.teamEmails)) {
    teamEmailsInput.value = settings.teamEmails.join('\n');
  } else {
    teamEmailsInput.value = '';
  }

  // Load hours threshold
  hoursThresholdInput.value = settings.hoursThreshold || 72;

  // Load status checkboxes
  const statuses = settings.statuses || ['In Progress', 'Open', 'Waiting for Support', 'Waiting for Customer'];
  statusInProgressCheckbox.checked = statuses.includes('In Progress');
  statusOpenCheckbox.checked = statuses.includes('Open');
  statusWaitingSupportCheckbox.checked = statuses.includes('Waiting for Support');
  statusWaitingCustomerCheckbox.checked = statuses.includes('Waiting for Customer');
});

// Save settings
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate and clean Jira URL
  const urlValidation = validateJiraUrl(jiraUrlInput.value.trim());
  if (!urlValidation.valid) {
    showMessage(urlValidation.message, 'error');
    return;
  }

  const jiraUrl = urlValidation.cleanUrl || jiraUrlInput.value.trim();

  // Parse team emails
  const teamEmails = parseTeamEmails(teamEmailsInput.value);
  if (teamEmails.length === 0) {
    showMessage('Please enter at least one team member email.', 'error');
    return;
  }

  // Get selected statuses
  const statuses = getSelectedStatuses();
  if (statuses.length === 0) {
    showMessage('Please select at least one status to monitor.', 'error');
    return;
  }

  // Get hours threshold
  const hoursThreshold = parseInt(hoursThresholdInput.value);
  if (!hoursThreshold || hoursThreshold < 1) {
    showMessage('Please enter a valid hours threshold (minimum 1 hour).', 'error');
    return;
  }

  const settings = {
    jiraUrl: jiraUrl,
    userEmail: userEmailInput.value.trim(),
    apiToken: apiTokenInput.value.trim(),
    teamEmails: teamEmails,
    statuses: statuses,
    hoursThreshold: hoursThreshold
  };

  ipcRenderer.send('save-settings', settings);
});

ipcRenderer.on('settings-saved', (event, success) => {
  if (success) {
    showMessage('Settings saved successfully!', 'success');
    setTimeout(() => {
      window.close();
    }, 1500);
  }
});

// Test connection
testBtn.addEventListener('click', () => {
  // Validate and clean Jira URL
  const urlValidation = validateJiraUrl(jiraUrlInput.value.trim());
  if (!urlValidation.valid) {
    showMessage(urlValidation.message, 'error');
    return;
  }

  const jiraUrl = urlValidation.cleanUrl || jiraUrlInput.value.trim();

  // Parse team emails
  const teamEmails = parseTeamEmails(teamEmailsInput.value);
  if (teamEmails.length === 0) {
    showMessage('Please enter at least one team member email.', 'error');
    return;
  }

  // Get selected statuses
  const statuses = getSelectedStatuses();
  if (statuses.length === 0) {
    showMessage('Please select at least one status to monitor.', 'error');
    return;
  }

  // Get hours threshold
  const hoursThreshold = parseInt(hoursThresholdInput.value);
  if (!hoursThreshold || hoursThreshold < 1) {
    showMessage('Please enter a valid hours threshold.', 'error');
    return;
  }

  const settings = {
    jiraUrl: jiraUrl,
    userEmail: userEmailInput.value.trim(),
    apiToken: apiTokenInput.value.trim(),
    teamEmails: teamEmails,
    statuses: statuses,
    hoursThreshold: hoursThreshold
  };

  if (!settings.jiraUrl || !settings.userEmail || !settings.apiToken) {
    showMessage('Please fill in all required fields before testing.', 'error');
    return;
  }

  testBtn.disabled = true;
  testBtn.textContent = 'Testing...';

  ipcRenderer.send('test-connection', settings);
});

ipcRenderer.on('test-result', (event, result) => {
  testBtn.disabled = false;
  testBtn.textContent = 'Test Connection';

  if (result.success) {
    showMessage(result.message, 'success');
  } else {
    showMessage(result.message, 'error');
  }
});

// Cancel button
cancelBtn.addEventListener('click', () => {
  window.close();
});

// Open API token page - main button
openTokenPageLink.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-external', 'https://id.atlassian.com/manage-profile/security/api-tokens');
});

// Open API token page - inline link
openTokenPageInlineLink.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-external', 'https://id.atlassian.com/manage-profile/security/api-tokens');
});

// Helper function to show messages
function showMessage(text, type) {
  messageDiv.textContent = text;
  messageDiv.className = `message ${type} show`;

  setTimeout(() => {
    messageDiv.classList.remove('show');
  }, 5000);
}

// Helper function to parse team emails
function parseTeamEmails(emailsText) {
  if (!emailsText || !emailsText.trim()) {
    return [];
  }

  // Split by newlines and commas, then clean up
  const emails = emailsText
    .split(/[\n,]+/)
    .map(email => email.trim())
    .filter(email => email.length > 0)
    .filter(email => email.includes('@')); // Basic email validation

  return emails;
}

// Helper function to get selected statuses
function getSelectedStatuses() {
  const statuses = [];

  if (statusInProgressCheckbox.checked) {
    statuses.push(statusInProgressCheckbox.value);
  }
  if (statusOpenCheckbox.checked) {
    statuses.push(statusOpenCheckbox.value);
  }
  if (statusWaitingSupportCheckbox.checked) {
    statuses.push(statusWaitingSupportCheckbox.value);
  }
  if (statusWaitingCustomerCheckbox.checked) {
    statuses.push(statusWaitingCustomerCheckbox.value);
  }

  return statuses;
}

// Helper function to validate and clean Jira URL
function validateJiraUrl(url) {
  if (!url) {
    return { valid: false, message: 'Jira URL is required.' };
  }

  // Check if URL starts with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return { valid: false, message: 'Jira URL must start with https:// (e.g., https://rehrig.atlassian.net)' };
  }

  // Parse the URL
  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    return { valid: false, message: 'Invalid URL format. Use: https://your-company.atlassian.net' };
  }

  // Check for common mistakes - paths that shouldn't be in the base URL
  const invalidPaths = ['/jira/', '/servicedesk/', '/projects/', '/browse/', '/secure/'];
  const hasInvalidPath = invalidPaths.some(path => parsedUrl.pathname.includes(path));

  if (hasInvalidPath) {
    // Extract just the base URL (protocol + hostname + port if any)
    const cleanUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    return {
      valid: true,
      cleanUrl: cleanUrl,
      message: `URL cleaned: Using ${cleanUrl} (removed project path)`
    };
  }

  // Check if it's an Atlassian domain
  if (!parsedUrl.hostname.includes('atlassian.net') && !parsedUrl.hostname.includes('jira')) {
    // Show warning but allow it (might be self-hosted)
    console.warn('URL does not appear to be an Atlassian domain. This might be okay for self-hosted Jira.');
  }

  // Return the clean base URL
  const cleanUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
  return { valid: true, cleanUrl: cleanUrl };
}

