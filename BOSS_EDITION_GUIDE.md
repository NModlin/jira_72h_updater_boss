# Jira 72h Updater - Boss Edition Guide

## 👔 What is the Boss Edition?

The **Boss Edition** is a specialized version of the Jira Updater designed specifically for **managers, team leads, and supervisors** who need to monitor their team's Jira tickets rather than just their own.

---

## 🆚 Standard vs Boss Edition Comparison

| Feature | Standard Edition (48h) | Boss Edition (72h) |
|---------|----------------------|-------------------|
| **Primary Users** | Individual contributors | Managers & Team leads |
| **Default Time Threshold** | 48 hours | 72 hours |
| **JQL Query** | Fixed: `assignee = currentUser()` | **Fully customizable** |
| **Target Tickets** | Your own assigned tickets | Team tickets, projects, queues |
| **Use Case** | "What do I need to update?" | "What does my team need to update?" |
| **Autostart Option** | ✅ Yes | ❌ Not yet (can be added) |
| **Welcome Screen** | ✅ Yes | ❌ Not yet (can be added) |
| **Customization** | Limited | **Full JQL control** |

---

## 🎯 Who Should Use Boss Edition?

### Perfect For:
- ✅ **Team Managers** - Monitor your team's workload
- ✅ **Service Desk Supervisors** - Track queue health
- ✅ **Project Managers** - Keep projects moving
- ✅ **Department Heads** - Oversee multiple teams
- ✅ **Scrum Masters** - Monitor sprint tickets

### Not Ideal For:
- ❌ Individual contributors tracking only their own work (use Standard Edition)
- ❌ Users who don't need custom JQL queries

---

## 🔑 Key Difference: Customizable JQL

The Boss Edition's **killer feature** is the ability to define your own JQL (Jira Query Language) query.

### Standard Edition Query (Fixed):
```jql
assignee = currentUser() AND updated <= -48h AND status in ("Waiting for Customer", "Waiting for Support", "In Progress", "Open")
```
**Translation**: "Show me MY tickets that haven't been updated in 48 hours"

### Boss Edition Query (Customizable):
```jql
project = HD AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```
**Translation**: "Show me ALL tickets in the HD project that haven't been updated in 72 hours"

---

## 📋 Boss Edition Use Cases

### Use Case 1: Monitor Service Desk Queue
**Scenario**: You manage a service desk and want to ensure no customer tickets go stale.

**JQL Query**:
```jql
project = SERVICEDESK AND updated <= -72h AND status in ("Waiting for Support", "In Progress", "Open")
```

**Result**: Get notified about any open service desk ticket that hasn't been touched in 3 days.

---

### Use Case 2: Track Your Team's Workload
**Scenario**: You manage a team of 5 developers and want to see if anyone's tickets are going stale.

**JQL Query**:
```jql
assignee in (john.doe, jane.smith, bob.jones, alice.williams, charlie.brown) AND updated <= -72h AND status not in (Resolved, Closed, Done)
```

**Result**: Get notified when any team member's ticket hasn't been updated in 72 hours.

---

### Use Case 3: Monitor High-Priority Items
**Scenario**: You want to focus only on critical tickets that are going stale.

**JQL Query**:
```jql
priority in (Highest, High) AND updated <= -48h AND status not in (Resolved, Closed, Done)
```

**Result**: Get notified about high-priority tickets that haven't been updated in 48 hours (shorter threshold for urgent work).

---

### Use Case 4: Track Multiple Projects
**Scenario**: You oversee 3 different projects and want to monitor all of them.

**JQL Query**:
```jql
project in (PROJ1, PROJ2, PROJ3) AND updated <= -72h AND status not in (Pending, Resolved, Closed, Done)
```

**Result**: Get notified about stale tickets across all 3 projects.

---

### Use Case 5: Monitor Customer-Facing Tickets
**Scenario**: You want to ensure customers aren't waiting too long for responses.

**JQL Query**:
```jql
status in ("Waiting for Customer", "Customer Review") AND updated <= -72h
```

**Result**: Get notified when tickets in customer-facing statuses haven't been updated in 72 hours.

---

### Use Case 6: Track by Component
**Scenario**: You manage the "Mobile App" component and want to monitor those tickets.

**JQL Query**:
```jql
project = DEV AND component = "Mobile App" AND updated <= -72h AND status not in (Resolved, Closed, Done)
```

**Result**: Get notified about stale tickets in the Mobile App component.

---

## 🛠️ Setting Up Boss Edition

### Step 1: Install
```bash
cd jira_72h_updater_boss
npm install
npm start
```

### Step 2: Configure
1. Right-click tray icon → **Settings**
2. Enter your **Jira URL** (e.g., `https://company.atlassian.net`)
3. Enter your **email**
4. Paste your **API token**
5. **Customize the JQL query** to match your needs
6. Click **"Test Connection"**
7. Click **"Save Settings"**

### Step 3: Test
- Use **"Check Now"** from the tray menu
- Verify you receive notifications for the expected tickets
- Check **"View History"** to see the results

---

## 📊 JQL Query Examples Library

### By Team
```jql
assignee in (membersOf("support-team")) AND updated <= -72h AND status not in (Resolved, Closed, Done)
```

### By Sprint
```jql
sprint in openSprints() AND updated <= -72h AND status not in (Resolved, Closed, Done)
```

### By Reporter (Tickets you created)
```jql
reporter = currentUser() AND updated <= -72h AND status not in (Resolved, Closed, Done)
```

### By Label
```jql
labels = "customer-critical" AND updated <= -72h AND status not in (Resolved, Closed, Done)
```

### By Due Date (Overdue tickets)
```jql
duedate < now() AND status not in (Resolved, Closed, Done)
```

### By Created Date (Old tickets)
```jql
created <= -30d AND status not in (Resolved, Closed, Done)
```

### Complex Example (Multiple Conditions)
```jql
project = SUPPORT AND 
assignee in (membersOf("tier2-support")) AND 
priority in (High, Highest) AND 
updated <= -48h AND 
status in ("In Progress", "Waiting for Support")
```

---

## 🎓 JQL Tips for Managers

### 1. Start Simple
Begin with a basic query and add complexity as needed:
```jql
project = MYPROJECT AND updated <= -72h
```

### 2. Test in Jira First
Always test your JQL in Jira's web interface before using it in the app:
1. Go to **Issues** → **Search for issues**
2. Click **Advanced** (to switch to JQL mode)
3. Paste your query
4. Verify the results

### 3. Use Parentheses for Clarity
```jql
(project = PROJ1 OR project = PROJ2) AND updated <= -72h
```

### 4. Common JQL Operators
- `=` - Equals
- `!=` - Not equals
- `>` / `<` - Greater/less than
- `>=` / `<=` - Greater/less than or equal
- `IN` - In a list
- `NOT IN` - Not in a list
- `~` - Contains (text search)
- `AND` / `OR` - Logical operators

### 5. Useful JQL Functions
- `currentUser()` - The logged-in user
- `membersOf("team-name")` - Members of a team
- `now()` - Current date/time
- `startOfDay()` - Start of today
- `endOfWeek()` - End of this week

---

## ⚠️ Important Permissions Note

**You can only see tickets you have permission to view in Jira.**

If your JQL query targets tickets you don't have access to, they won't appear in the results. Make sure:
- ✅ You have the appropriate Jira permissions
- ✅ You're a member of the relevant projects
- ✅ Your role allows viewing team members' tickets

---

## 🔄 Workflow Recommendations

### Daily Routine
1. **Morning**: Check "View History" to see overnight notifications
2. **Midday**: Use "Check Now" for a manual check
3. **End of Day**: Review any stale tickets before leaving

### Weekly Review
1. Analyze patterns in notification history
2. Adjust JQL query if needed
3. Share insights with your team

### Team Communication
1. Share your JQL query with the team so they know what's being tracked
2. Use notifications as conversation starters, not accusations
3. Focus on process improvement, not blame

---

## 🚀 Building for Your Team

### Build the Installer
```bash
npm run build:win  # For Windows
npm run build:mac  # For macOS
```

### Distribute to Your Team
1. Share the installer file
2. Provide the setup guide (SETUP.md)
3. Help team members create API tokens
4. Share recommended JQL queries

---

## 📈 Advanced Features (Future Enhancements)

Potential features that could be added:

- [ ] Multiple JQL queries with different check intervals
- [ ] Slack/Teams integration for team notifications
- [ ] Dashboard view showing ticket trends
- [ ] Export notification history to CSV
- [ ] Custom notification sounds
- [ ] Autostart option (like Standard Edition)
- [ ] Welcome screen (like Standard Edition)

---

## 🆘 Troubleshooting Boss Edition

### "No tickets found" but I know there are stale tickets

**Check**:
1. Test your JQL query in Jira's web interface
2. Verify you have permission to view those tickets
3. Check the time threshold (72h vs 48h)
4. Ensure the status filter isn't excluding tickets

### "Too many notifications"

**Solutions**:
1. Increase the time threshold (e.g., 96h instead of 72h)
2. Add more status filters to exclude certain states
3. Narrow the project/team scope
4. Add priority filters to focus on important tickets

### "JQL syntax error"

**Solutions**:
1. Test the query in Jira first
2. Check for missing quotes around text values
3. Verify field names are correct (case-sensitive)
4. Use parentheses to group complex conditions

---

## 📞 Support

For help with:
- **JQL queries**: See [Jira JQL Documentation](https://support.atlassian.com/jira-software-cloud/docs/what-is-advanced-searching-in-jira-cloud/)
- **API tokens**: See [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
- **App issues**: Contact your system administrator

---

**Created by Nathan Modlin**

**Boss Edition - Empowering managers to keep their teams on track!** 👔

