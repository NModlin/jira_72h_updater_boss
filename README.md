# Jira 72h Updater - Boss Edition

A cross-platform desktop application designed for managers to monitor their team's Jira tickets and receive native notifications for tickets that haven't been updated in 72 hours.

**Created by Nathan Modlin**

## Features

- 🔔 **Native Notifications**: Get desktop notifications for stale team tickets
- 🖥️ **System Tray App**: Runs quietly in the background (Windows system tray / macOS menu bar)
- ⚙️ **Customizable JQL**: Define your own JQL query to match your team's workflow
- 📊 **Notification History**: View a log of all recent notifications
- 🔄 **Automatic Checks**: Runs every hour automatically
- 🌐 **Cross-Platform**: Works on both Windows and macOS
- 👔 **Boss Edition**: Specifically designed for managers tracking team tickets

## Differences from Standard Edition

| Feature | Standard Edition (48h) | Boss Edition (72h) |
|---------|----------------------|-------------------|
| **Target Users** | Individual contributors | Managers/Team leads |
| **Default Threshold** | 48 hours | 72 hours |
| **JQL Query** | Fixed (user's tickets) | Fully customizable |
| **Default Query** | `assignee = currentUser()` | `project = HD AND updated <= -72h` |
| **Use Case** | Track your own work | Track team's work |

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Jira account with API access
- Manager/admin access to view team tickets

## Installation

1. Clone or download this repository
2. Navigate to the `jira_72h_updater_boss` folder:
```bash
cd jira_72h_updater_boss
```

3. Install dependencies:
```bash
npm install
```

## Getting Your Jira API Token

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Give it a label (e.g., "Jira 72h Updater Boss")
4. Copy the generated token
5. Paste it into the app's Settings window

## Running the Application

### Development Mode

```bash
npm start
```

The app will start and appear in your system tray (Windows) or menu bar (macOS).

### First-Time Setup

1. **Right-click the tray icon** and select **"Settings"**
2. **Enter your Jira URL** (e.g., `https://your-company.atlassian.net`)
3. **Enter your email** (the one you use for Jira)
4. **Paste your API token**
5. **Customize the JQL query** (or use the default)
6. **Click "Test Connection"** to verify
7. **Click "Save Settings"**

## Default JQL Query

The Boss Edition comes with this default query:

```jql
project = HD AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

**What this means:**
- `project = HD` - Targets the "HD" service desk project
- `updated <= -72h` - Tickets not updated in 72 hours
- `status not in (...)` - Excludes finished/pending tickets

### Customizing the JQL Query

You can modify the JQL query to match your team's needs. Examples:

**Track multiple projects:**
```jql
project in (HD, SUPPORT, DEV) AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

**Track specific team members:**
```jql
assignee in (john.doe, jane.smith) AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

**Track by component:**
```jql
project = HD AND component = "Customer Support" AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

**Different time threshold:**
```jql
project = HD AND updated <= -96h AND status not in (Pending, Resolved, Closed, Done)
```

## Menu Options

Right-click the tray icon to access:

- **Settings** - Configure Jira credentials and JQL query
- **View History** - See all past notifications
- **Check Now** - Force an immediate check (don't wait for hourly interval)
- **Exit** - Close the app completely

## Building for Distribution

### Build for Windows

```bash
npm run build:win
```

Output: `dist/Jira 72h Updater Boss Edition Setup 0.5.0.exe`

### Build for macOS

```bash
npm run build:mac
```

Output: `dist/Jira 72h Updater Boss Edition-0.5.0.dmg`

### Build for Both Platforms

```bash
npm run build:all
```

## How It Works

### Automatic Monitoring

1. **First check**: 5 seconds after app starts
2. **Subsequent checks**: Every 1 hour
3. **Query execution**: Uses your custom JQL query
4. **Notifications**: One notification per stale ticket found

### Notification Behavior

- **On ticket found**: Shows notification with ticket key and summary
- **On click**: Opens the ticket in your default browser
- **On API error (401)**: Shows error notification that opens Settings when clicked

### Notification History

- Stores the last 100 notifications
- Shows timestamp, type (ticket/error/info), and message
- Accessible via "View History" menu option

## Use Cases for Managers

### 1. Monitor Service Desk Queue
Track all open tickets in your service desk that haven't been updated in 72 hours.

```jql
project = SERVICEDESK AND updated <= -72h AND status in ("Waiting for Support", "In Progress", "Open")
```

### 2. Track Team Workload
Monitor tickets assigned to your team members.

```jql
assignee in (membersOf("support-team")) AND updated <= -72h AND status not in (Resolved, Closed, Done)
```

### 3. Monitor High Priority Items
Focus on critical tickets that are going stale.

```jql
priority in (Highest, High) AND updated <= -48h AND status not in (Resolved, Closed, Done)
```

### 4. Track Customer-Facing Tickets
Monitor tickets in customer-facing statuses.

```jql
status in ("Waiting for Customer", "Customer Review") AND updated <= -72h
```

## Troubleshooting

### "Connection failed" error
- ✅ Verify your Jira URL is correct (base URL only, no paths)
- ✅ Check that your email matches your Jira account
- ✅ Generate a new API token and try again
- ✅ Ensure you have permission to view the tickets in your JQL query

### Not receiving notifications
- ✅ Use "Check Now" to force a manual check
- ✅ Verify your JQL query returns results in Jira's web interface
- ✅ Check Windows notification settings
- ✅ Check "View History" to see if checks are running

### JQL query errors
- ✅ Test your JQL query in Jira's web interface first
- ✅ Use the "Test Connection" button to validate
- ✅ Check for syntax errors (missing quotes, parentheses, etc.)
- ✅ Ensure field names are correct (case-sensitive)

### App not starting
- ✅ Check Task Manager for existing instances
- ✅ Look in the system tray overflow area (click the up arrow ^)
- ✅ Try running from command line to see error messages

## Security & Privacy

- ✅ Your API token is stored **locally** on your computer only
- ✅ The token is **never sent** anywhere except to your Jira instance
- ✅ All communication with Jira uses **HTTPS** (encrypted)
- ✅ No data is collected or sent to third parties
- ✅ The app only reads ticket data—it never modifies anything

## File Structure

```
jira_72h_updater_boss/
├── src/
│   ├── main.js                      # Main Electron process
│   ├── services/
│   │   ├── jiraService.js          # Jira API integration
│   │   └── notificationHistory.js  # Notification logging
│   └── windows/
│       ├── settings.html           # Settings window UI
│       ├── settings.js             # Settings window logic
│       ├── history.html            # History window UI
│       └── history.js              # History window logic
├── assets/
│   └── icon.png                    # App icon
├── package.json                    # NPM configuration
└── README.md                       # This file
```

## License

MIT

## Author

Created by **Nathan Modlin**

## Support

For issues or questions, please contact your system administrator or open an issue in the repository.

---

## Quick Start Guide

1. **Install**: `npm install`
2. **Run**: `npm start`
3. **Configure**: Right-click tray icon → Settings
4. **Customize**: Edit the JQL query to match your needs
5. **Test**: Click "Test Connection"
6. **Save**: Click "Save Settings"
7. **Monitor**: App checks every hour automatically

---

**Boss Edition - Empowering managers to keep their teams on track!** 👔

