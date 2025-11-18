# Quick Start - Jira 72h Updater Boss Edition

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies (1 minute)
```bash
cd jira_72h_updater_boss
npm install
```

### 2. Run the App (30 seconds)
```bash
npm start
```

Look for the app icon in your **system tray** (Windows) or **menu bar** (macOS).

### 3. Configure Settings (2 minutes)

**Right-click the tray icon** → **Settings**

Fill in:
- **Jira URL**: `https://your-company.atlassian.net`
- **Email**: `your.email@company.com`
- **API Token**: [Get one here](https://id.atlassian.com/manage-profile/security/api-tokens)
- **JQL Query**: Use the default or customize

### 4. Test Connection (30 seconds)
Click **"Test Connection"** → Should see "Connection successful!"

### 5. Save & Monitor (30 seconds)
Click **"Save Settings"** → App will check every hour automatically

---

## 📋 Default JQL Query

```jql
project = HD AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

**Customize this to match your team's needs!**

---

## 🎯 Common Customizations

### Track Your Team
```jql
assignee in (john.doe, jane.smith) AND updated <= -72h AND status not in (Resolved, Closed, Done)
```

### Track Multiple Projects
```jql
project in (PROJ1, PROJ2) AND updated <= -72h AND status not in (Resolved, Closed, Done)
```

### Track High Priority Only
```jql
priority in (Highest, High) AND updated <= -48h AND status not in (Resolved, Closed, Done)
```

---

## 🔔 What Happens Next?

- **Every hour**: App checks Jira using your JQL query
- **When stale tickets found**: You get a desktop notification
- **Click notification**: Opens the ticket in your browser
- **View History**: Right-click tray icon → "View History"

---

## 🛠️ Build for Distribution

```bash
npm run build:win  # Windows installer
npm run build:mac  # macOS installer
```

Output: `dist/Jira 72h Updater Boss Edition Setup 0.5.0.exe`

---

## 📚 Need More Help?

- **Full Setup Guide**: See `SETUP.md`
- **Boss Edition Features**: See `BOSS_EDITION_GUIDE.md`
- **JQL Examples**: See `BOSS_EDITION_GUIDE.md` (JQL section)

---

**Created by Nathan Modlin** 👔

