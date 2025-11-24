# Boss Edition Dashboard Integration Guide

## 🎯 What's New in Version 1.0

The Boss Edition now includes a **fully integrated visual dashboard** with:

✅ **Visual Analytics** - Charts, graphs, and tables  
✅ **AI-Powered Insights** - Rovo AI integration for chat and graph generation  
✅ **Interactive Filters** - Dynamic filtering by team, assignee, project, priority  
✅ **Seamless Notifications** - Click notifications to open dashboard  
✅ **AI Graph Generator** - Ask Rovo to create custom charts in natural language  

---

## 🚀 Quick Start

### Installation

```bash
cd jira_72h_updater_boss
npm install
npm install --prefix dashboard
```

### Development Mode

```bash
# Terminal 1: Start dashboard dev server
cd dashboard
npm run dev

# Terminal 2: Start Electron app
cd ..
npm start
```

### Build for Production

```bash
npm run build
```

This will:
1. Build the React dashboard (`dashboard/dist/`)
2. Package the Electron app with the dashboard included

---

## 📁 Project Structure

```
jira_72h_updater_boss/
├── src/
│   ├── main.js                  # Electron main process (updated)
│   ├── preload.js               # IPC bridge (NEW)
│   ├── services/
│   │   ├── jiraService.js       # Jira API client (enhanced)
│   │   └── notificationHistory.js
│   └── windows/
│       ├── settings.html
│       └── history.html
├── dashboard/                   # React dashboard (NEW)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   │   ├── AIChatAssistant.jsx   # Rovo chat
│   │   │   │   └── AIGraphGenerator.jsx  # AI graphs
│   │   │   ├── dashboard/
│   │   │   │   ├── AssigneeChart.jsx
│   │   │   │   ├── TrendChart.jsx
│   │   │   │   ├── TicketTable.jsx
│   │   │   │   └── RequestTypeTable.jsx
│   │   │   └── layout/
│   │   │       ├── Sidebar.jsx
│   │   │       ├── FilterSidebar.jsx
│   │   │       └── DashboardLayout.jsx
│   │   ├── context/
│   │   │   └── DashboardContext.jsx
│   │   ├── services/
│   │   │   └── jiraService.js
│   │   └── App.jsx
│   ├── vite.config.js           # Configured for Electron
│   └── package.json
├── package.json                 # Boss Edition with dashboard scripts
└── assets/
    └── icon.png
```

---

## 🎮 Usage

### Opening the Dashboard

**Three ways to open:**

1. **Double-click** the tray icon
2. **Right-click** tray → "Open Dashboard"
3. **Click** a notification → Dashboard opens to that ticket

### Dashboard Features

#### 1. Open Tickets (Default View)
- **Assignee Chart**: See ticket status by team member
- **Trend Chart**: Track ticket volume over time
- **Request Type Table**: Breakdown by ticket type
- **Ticket Table**: Full list with filtering

#### 2. Jira Trends (AI-Powered)
- **AI Graph Generator**: Natural language chart creation
- **Historical Trends**: Ticket creation patterns
- **Workload Analysis**: Team capacity visualization

**Example AI Requests:**
- "Show me high priority tickets by assignee"
- "Graph ticket resolution time this month"
- "Display stale tickets by project"

#### 3. Rovo AI Chat
- Click the **blue chat button** (bottom right)
- Ask questions like:
  - "Which team member needs help?"
  - "Summarize ticket HD-123"
  - "What's our average response time?"

### Filters (Right Sidebar)

- **Team Name** - Search for specific teams
- **Assignee** - Filter by team member
- **Project** - Select Jira projects
- **Priority** - High, Medium, Low, etc.
- **Request Type** - Incident, Service Request, etc.

---

## 🔧 Configuration

### Jira Settings

Dashboard uses the same settings as the tray app:

1. Right-click tray → **Settings**
2. Enter:
   - **Jira URL**: `https://yourcompany.atlassian.net`
   - **Email**: Your Atlassian email
   - **API Token**: [Generate here](https://id.atlassian.com/manage-profile/security/api-tokens)
   - **Team Emails**: Team members to monitor
   - **Custom JQL**: (Optional) Advanced filtering

### Rovo AI Requirements

Rovo is **automatically available** if:
- ✅ Your Jira instance has Rovo enabled
- ✅ You have valid API credentials
- ✅ No extra API key needed!

---

## 🛠️ Technical Details

### IPC Communication

The dashboard communicates with Electron via `window.electronAPI`:

```javascript
// In React components
const tickets = await window.electronAPI.fetchTickets(jql);
const settings = await window.electronAPI.getSettings();
const response = await window.electronAPI.askRovo(question);
const graphData = await window.electronAPI.generateGraph(request);
```

### Jira Service Methods

Enhanced `JiraService` class:

- `getStaleTickets()` - Default stale ticket query
- `searchWithJQL(jql)` - Custom JQL queries
- `getIssueDetails(key)` - Full ticket details
- `testConnection()` - Validate credentials

### Background Notifications

**Behavior:**
- ✅ Notifications **continue** while dashboard is open
- ✅ Clicking a notification **opens dashboard** to that ticket
- ✅ Dashboard shows ticket in table (highlighted)

---

## 🎨 AI Graph Generator

### How It Works

1. User types natural language request
2. Request sent to Rovo AI via `generateGraph` IPC
3. Rovo interprets request and queries Jira
4. Returns structured JSON: `{ chartType, data, labels, title }`
5. Dashboard renders chart using Recharts

### Supported Chart Types

- **Bar Chart**: Categorical comparisons
- **Line Chart**: Trends over time
- **Pie Chart**: Distribution/proportions

### Example Workflow

```
User: "Show me ticket count by priority"
  ↓
Rovo: Queries Jira for priority distribution
  ↓
Returns: {
  chartType: "bar",
  data: [12, 5, 23, 8],
  labels: ["Highest", "High", "Medium", "Low"],
  title: "Tickets by Priority"
}
  ↓
Dashboard: Renders bar chart
```

---

## 📦 Building for Distribution

### Windows

```bash
npm run build:win
```

Output: `dist/Jira 72h Updater Boss Edition Setup.exe`

### macOS

```bash
npm run build:mac
```

Output: `dist/Jira 72h Updater Boss Edition.dmg`

### Both Platforms

```bash
npm run build:all
```

---

## 🔍 Troubleshooting

### Dashboard Won't Load

**Check:**
1. Dashboard built? `ls dashboard/dist/index.html`
2. Dev server running? (for dev mode)
3. Console errors? (Enable devTools in `main.js` line 232)

**Fix:**
```bash
cd dashboard
npm run build
cd ..
npm start
```

### Rovo AI Not Responding

**Check:**
1. Jira URL correct?
2. API token valid?
3. Rovo enabled for your organization?

**Test:**
- Visit `https://yourjira.atlassian.net/gateway/api/rovo`
- Should not show 404

### Graphs Not Generating

**Possible Causes:**
- Rovo response not in expected JSON format
- Network timeout
- Insufficient Jira data

**Debug:**
- Check console for error details
- Try simpler requests first
- Verify Jira has data for the query

---

## 🚧 Known Limitations

1. **AI Graphs** - Dependent on Rovo's ability to parse natural language
2. **JQL Complexity** - Very complex queries may timeout
3. **Data Volume** - Large datasets (>500 tickets) may slow rendering

---

## 📝 Development Tips

### Hot Reload Development

```bash
# Terminal 1
cd dashboard && npm run dev

# Terminal 2
npm start
```

Dashboard changes reflect immediately (no Electron restart needed).

### Debug Mode

Uncomment in `main.js` line 232:
```javascript
dashboardWindow.webContents.openDevTools();
```

### Testing Notifications

```bash
# From tray menu
Right-click → "Check Now"
```

---

## 🎓 User Training

### For Managers

**Daily Workflow:**
1. Double-click tray icon to open dashboard
2. Review "Open Tickets" for team overview
3. Use filters to drill down by assignee/priority
4. Ask Rovo for insights: "Who needs help?"
5. Use AI Graph Generator for stakeholder reports

**Weekly Review:**
1. Go to "Jira Trends" view
2. Generate graphs for meetings:
   - "Show resolution time trends"
   - "Graph ticket backlog by project"
3. Export screenshots for reports

### For Team Members

Dashboard is **read-only** for team visibility:
- See what's being monitored
- Understand ticket priorities
- No actions required (notifications handled separately)

---

## 🔒 Security Notes

- **Credentials**: Stored locally via `electron-store`
- **API Tokens**: Never exposed to dashboard (Electron handles authentication)
- **Context Isolation**: Dashboard runs in sandboxed renderer process
- **No External Services**: All data stays between your machine and Jira

---

## 📚 Additional Resources

- [Jira REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)
- [Atlassian Rovo](https://www.atlassian.com/software/rovo)
- [JQL Reference](https://support.atlassian.com/jira-software-cloud/docs/what-is-advanced-searching-in-jira-cloud/)
- [Electron IPC](https://www.electronjs.org/docs/latest/api/ipc-main)

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Electron console logs
3. Test Jira API connection manually
4. Contact your system administrator

---

**Created by Nathan Modlin**  
**Boss Edition v1.0 - Dashboard Integration** 🎉
