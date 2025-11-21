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

## Download & Installation

### macOS
1.  Download the latest `.dmg` file from the [Releases page](https://github.com/NModlin/jira_72h_updater_boss/releases) (or provided distribution link).
2.  Double-click the `.dmg` file to open it.
3.  Drag the **Jira 72h Updater Boss Edition** app to your **Applications** folder.
4.  **Important**: Since this app is not signed with an Apple Developer ID, you must open it this way the first time:
    -   **Right-click** (or Control-click) the app in your Applications folder.
    -   Select **Open** from the menu.
    -   Click **Open** in the dialog box that appears.

### Windows
1.  Download the latest `.exe` installer.
2.  Double-click the installer to run it.
3.  The app will install and automatically start in your system tray.

## First-Time Setup

1.  **Right-click the tray icon** (look for the bell icon) and select **"Settings"**.
2.  **Enter your Jira URL** (e.g., `https://your-company.atlassian.net`).
3.  **Enter your email** (the one you use for Jira).
4.  **Paste your API token**.
    -   *Need a token?* Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens), create one, and copy it.
5.  **Customize the JQL query** (or use the default).
6.  **Click "Test Connection"** to verify everything works.
7.  **Click "Save Settings"**.

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

## Menu Options

Right-click the tray icon to access:

- **Settings** - Configure Jira credentials and JQL query
- **View History** - See all past notifications
- **Check Now** - Force an immediate check (don't wait for hourly interval)
- **Exit** - Close the app completely

## How It Works

1.  **First check**: 5 seconds after app starts
2.  **Subsequent checks**: Every 1 hour
3.  **Notifications**: You'll get a desktop notification for each stale ticket found. Clicking it opens the ticket in your browser.

## Security & Privacy

- ✅ Your API token is stored **locally** on your computer only.
- ✅ The token is **never sent** anywhere except to your Jira instance.
- ✅ All communication with Jira uses **HTTPS** (encrypted).
- ✅ The app only reads ticket data—it never modifies anything.

---

## Support

For issues or questions, please contact your system administrator or open an issue in the repository.

---

**Boss Edition - Empowering managers to keep their teams on track!** 👔

---
### For Developers

To build from source:
1. `npm install`
2. `npm start` (dev)
3. `npm run build:mac` or `npm run build:win` (build)
