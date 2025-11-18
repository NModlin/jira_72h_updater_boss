# Setup Guide - Jira 72h Updater Boss Edition

This guide will walk you through setting up and running the Jira 72h Updater Boss Edition application.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Electron (desktop framework)
- electron-store (settings storage)
- electron-builder (packaging tool)
- node-fetch (HTTP client)

### 2. Run the Application

```bash
npm start
```

The application will:
- Start in the background
- Appear in your system tray (Windows) or menu bar (macOS)
- NOT open any windows automatically

### 3. Configure Jira Settings

1. **Locate the tray icon**: Look for the app icon in your system tray/menu bar
2. **Right-click** the icon
3. **Select "Settings"**
4. **Fill in the form**:
   - **Jira URL**: Your company's Jira instance (e.g., `https://mycompany.atlassian.net`)
   - **User Email**: Your Jira account email
   - **API Token**: Generate one from [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
   - **JQL Query**: Customize or use the default query

5. **Test your connection**: Click "Test Connection" to verify
6. **Save**: Click "Save Settings"

## Understanding the JQL Query

### Default Query

```jql
project = HD AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

**What this means**:
- `project = HD`: Targets the "HD" service desk project
- `updated <= -72h`: Tickets not updated in the last 72 hours
- `status not in (...)`: Excludes tickets that are done/closed/pending

### Customizing the Query

The Boss Edition allows you to fully customize the JQL query to match your team's needs.

#### Example 1: Track Multiple Projects
```jql
project in (HD, SUPPORT, DEV) AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

#### Example 2: Track Specific Team Members
```jql
assignee in (john.doe@company.com, jane.smith@company.com) AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

#### Example 3: Track by Team
```jql
assignee in (membersOf("support-team")) AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

#### Example 4: Track High Priority Only
```jql
priority in (Highest, High) AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

#### Example 5: Track Customer-Facing Statuses
```jql
status in ("Waiting for Customer", "Customer Review") AND updated <= -72h
```

#### Example 6: Different Time Threshold (96 hours)
```jql
project = HD AND updated <= -96h AND status not in (Pending, Resolved, Closed, Done)
```

### Testing Your JQL Query

Before using a custom query in the app:

1. **Open Jira** in your web browser
2. **Go to Issues** → **Search for issues**
3. **Switch to Advanced** (JQL mode)
4. **Paste your query** and run it
5. **Verify the results** match what you expect
6. **Copy the working query** to the app's Settings

## How the Background Checker Works

### Timing
- **First check**: 5 seconds after app starts
- **Subsequent checks**: Every 1 hour

### What happens during a check
1. App reads your saved Jira settings
2. Constructs the API request with your JQL query
3. Calls Jira API: `/rest/api/3/search/jql`
4. Processes the results
5. Sends notifications for each stale ticket

### Notification Behavior
- **On ticket found**: Shows notification with ticket key and summary
- **On click**: Opens the ticket in your default browser
- **On API error (401)**: Shows error notification that opens Settings when clicked

## Menu Options Explained

### Settings
Opens the configuration window where you can:
- Update your Jira URL
- Change your email
- Update your API token
- Modify your JQL query
- Test your connection

### View History
Opens a window showing:
- All recent notifications
- Timestamps
- Notification types (ticket/error/info)
- Color-coded by type

### Check Now
Manually triggers a Jira check immediately (doesn't wait for the hourly interval).

### Exit
Completely shuts down the application.

## Building for Distribution

### Prerequisites for Building

**For Windows builds**:
- Can be built on any platform
- Produces `.exe` installer

**For macOS builds**:
- Must be built on macOS
- Produces `.dmg` disk image
- May require code signing for distribution

### Build Commands

```bash
# Build for Windows only
npm run build:win

# Build for macOS only
npm run build:mac

# Build for both platforms
npm run build:all
```

### Output Location

Built installers will be in the `dist/` folder:
- Windows: `dist/Jira 72h Updater Boss Edition Setup 0.5.0.exe`
- macOS: `dist/Jira 72h Updater Boss Edition-0.5.0.dmg`

## Troubleshooting

### Issue: "Cannot find module 'electron'"

**Solution**:
```bash
rm -rf node_modules
npm install
```

### Issue: "Jira API Token is invalid"

**Possible causes**:
1. Token has expired
2. Token was copied incorrectly (extra spaces)
3. Email doesn't match the Jira account

**Solution**:
1. Generate a new API token
2. Ensure no extra spaces when pasting
3. Verify email matches your Jira login

### Issue: "No notifications appearing"

**Check**:
1. Does your JQL query return results in Jira's web interface?
2. Are system notifications enabled for the app?
3. Check "View History" to see if checks are running

**Test**:
- Use "Check Now" from the menu
- Check the console output if running in development mode

### Issue: "JQL query error"

**Solution**:
1. Test your JQL query in Jira's web interface first
2. Check for syntax errors (quotes, parentheses, commas)
3. Verify field names are correct (case-sensitive)
4. Ensure you have permission to view the tickets

### Issue: App icon not showing in tray

**Solution**:
- The `assets/icon.png` file needs to be a valid PNG image
- Recommended size: 256x256 pixels
- Check the system tray overflow area (click the up arrow ^)

## Development Tips

### Viewing Console Logs

When running in development mode (`npm start`), check the terminal for:
- Jira API responses
- Error messages
- Check timing information

### Debugging Windows

To open DevTools for a window:
- Add this to the window creation in `main.js`:
  ```javascript
  settingsWindow.webContents.openDevTools();
  ```

### Changing Check Interval

Edit `src/main.js`, find `startBackgroundChecker()`:

```javascript
// Change this value (in milliseconds)
checkInterval = setInterval(() => {
  performJiraCheck();
}, 60 * 60 * 1000); // 1 hour = 60 * 60 * 1000 ms
```

For testing, you might want:
```javascript
}, 5 * 60 * 1000); // 5 minutes
```

## Security Best Practices

1. **Never commit your API token** to version control
2. **Use HTTPS** for your Jira URL
3. **Regenerate tokens periodically** for security
4. **Don't share your config file** (contains your token)
5. **Ensure you have proper permissions** to view team tickets

## Manager-Specific Tips

### 1. Start with a Narrow Query
Begin with a specific project or team, then expand as needed.

### 2. Test During Business Hours
Run your first checks during work hours to see realistic results.

### 3. Adjust the Threshold
72 hours is the default, but you might want:
- 48 hours for urgent projects
- 96 hours for less critical work

### 4. Use Multiple Instances
You can run multiple instances with different queries by:
- Installing to different folders
- Using different JQL queries for different teams/projects

### 5. Share the Query
Document your JQL query so team members understand what's being tracked.

## Next Steps

After setup:
1. ✅ Install dependencies
2. ✅ Run the app
3. ✅ Configure Jira settings
4. ✅ Customize JQL query
5. ✅ Test the connection
6. ✅ Wait for notifications (or use "Check Now")
7. ✅ Build installers for distribution (optional)

## Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [JQL Reference](https://support.atlassian.com/jira-software-cloud/docs/what-is-advanced-searching-in-jira-cloud/)
- [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)

---

**Created by Nathan Modlin**

