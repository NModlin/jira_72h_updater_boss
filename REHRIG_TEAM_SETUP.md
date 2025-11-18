# Rehrig Team Setup Guide - Jira 72h Updater Boss Edition

## 🚀 Quick Setup for Rehrig Team

This guide is specifically for setting up the Boss Edition to monitor the Rehrig support team.

---

## Step 1: Install & Run

```bash
cd jira_72h_updater_boss
npm install
npm start
```

---

## Step 2: Configure Settings

**Right-click the tray icon** → **Settings**

### Fill in the form:

#### **Jira URL:**
```
https://rehrig.atlassian.net
```

#### **Your Email:**
```
your.email@rehrig.com
```
*(Use YOUR email - the one you use to log into Jira)*

#### **API Token:**
1. Click the "🔗 Create API Token" button in the settings window
2. Or go to: https://id.atlassian.com/manage-profile/security/api-tokens
3. Click "Create API token"
4. Label it: "Jira 72h Updater Boss"
5. Copy and paste the token

#### **Team Member Emails:**
Copy and paste this list:
```
douglascampbell@rehrig.com
sromero@Rehrig.com
LGreathouse@Rehrig.com
mmatias@rehrig.com
AClose@rehrig.com
ENgetich@Rehrig.com
NModlin@Rehrig.com
```

#### **Ticket Statuses to Monitor:**
✅ **In Progress** (checked)  
✅ **Open** (checked)  
✅ **Waiting for Support** (checked)  
✅ **Waiting for Customer** (checked)  

*(All four should be checked by default)*

#### **Hours Without Update:**
```
72
```
*(Default is 72 hours = 3 days)*

---

## Step 3: Test Connection

Click **"Test Connection"**

You should see:
```
✅ Connection successful!

Generated JQL Query:
assignee in ("douglascampbell@rehrig.com", "sromero@Rehrig.com", "LGreathouse@Rehrig.com", "mmatias@rehrig.com", "AClose@rehrig.com", "ENgetich@Rehrig.com", "NModlin@Rehrig.com") AND updated <= -72h AND status in ("In Progress", "Open", "Waiting for Support", "Waiting for Customer")
```

---

## Step 4: Save Settings

Click **"Save Settings"**

The app will now:
- ✅ Check every hour automatically
- ✅ Send desktop notifications for stale tickets
- ✅ Track all 7 team members
- ✅ Monitor the 4 key statuses
- ✅ Alert when tickets haven't been updated in 72 hours

---

## 🔔 What Happens Next?

### Automatic Checks
- **First check**: 5 seconds after you save settings
- **Subsequent checks**: Every 1 hour

### When Stale Tickets Are Found
You'll get a desktop notification like:
```
🔔 Jira Ticket Needs Update: HD-1234
Customer can't log in - assigned to sromero@Rehrig.com
```

### Click the Notification
- Opens the ticket in your browser
- You can see the details and take action

### View History
- Right-click tray icon → **"View History"**
- See all past notifications
- Color-coded by type (ticket/error/info)

---

## 🎯 What This Monitors

The app will notify you about tickets that match **ALL** of these criteria:

1. ✅ **Assigned to one of the 7 team members**
2. ✅ **In one of the 4 statuses** (In Progress, Open, Waiting for Support, Waiting for Customer)
3. ✅ **Not updated in 72 hours** (3 days)

---

## 🛠️ Customization Options

### Change the Time Threshold

Want to be notified sooner? Change **"Hours Without Update"**:
- **48 hours** = 2 days (more aggressive)
- **96 hours** = 4 days (more relaxed)
- **120 hours** = 5 days (very relaxed)

### Add/Remove Team Members

Just edit the **"Team Member Emails"** field:
- Add new members (one per line or comma-separated)
- Remove members you don't want to track

### Change Which Statuses to Monitor

Uncheck any status you don't want to monitor:
- Uncheck "Waiting for Customer" if you don't want to track those
- Uncheck "Open" if you only want active work

---

## 📊 Example Scenarios

### Scenario 1: Daily Morning Check
**Use Case**: You want to see what's stale before your morning standup

**Action**: Right-click tray icon → **"Check Now"**

**Result**: Immediate check, notifications for any stale tickets

---

### Scenario 2: Weekly Review
**Use Case**: Every Friday, review what went stale this week

**Action**: Right-click tray icon → **"View History"**

**Result**: See all notifications from the week

---

### Scenario 3: Urgent Projects Only
**Use Case**: You want to focus on tickets that are going stale faster

**Settings Change**:
- Change **"Hours Without Update"** to **48**
- Uncheck **"Waiting for Customer"** (not urgent)

**Result**: Get notified about active work that's been idle for 2 days

---

## 🚨 Troubleshooting

### "No notifications appearing"

**Check**:
1. Are there actually stale tickets? (Check in Jira web interface)
2. Do you have permission to view team members' tickets?
3. Are notifications enabled in Windows settings?

**Test**:
- Use **"Check Now"** from the tray menu
- Check **"View History"** to see if checks are running

---

### "Connection failed"

**Check**:
1. Is the Jira URL correct? (`https://rehrig.atlassian.net`)
2. Is your email correct?
3. Is your API token valid?

**Fix**:
- Generate a new API token
- Make sure there are no extra spaces when pasting

---

### "Too many notifications"

**Solutions**:
1. Increase the hours threshold (e.g., 96 instead of 72)
2. Uncheck some statuses (e.g., uncheck "Waiting for Customer")
3. Remove some team members from the list

---

## 📈 Build for Distribution

Once you've tested and it's working, you can build an installer:

### For Windows:
```bash
npm run build:win
```
**Output**: `dist/Jira 72h Updater Boss Edition Setup 0.5.0.exe`

### For macOS:
```bash
npm run build:mac
```
**Output**: `dist/Jira 72h Updater Boss Edition-0.5.0.dmg`

**Note**: macOS installers must be built on a Mac. See `MAC_BUILD_GUIDE.md` for details.

Share the installer with other managers on your team!

---

## 🔐 Security Notes

- ✅ Your API token is stored **locally** on your computer only
- ✅ The token is **never sent** anywhere except to Jira
- ✅ All communication uses **HTTPS** (encrypted)
- ✅ No data is collected or sent to third parties
- ✅ The app only **reads** ticket data—it never modifies anything

---

## 📞 Support

For help:
- **Technical issues**: Contact Nathan Modlin (NModlin@Rehrig.com)
- **Jira access issues**: Contact your Jira administrator
- **API token issues**: See https://id.atlassian.com/manage-profile/security/api-tokens

---

## ✅ Quick Checklist

Before you start monitoring:

- [ ] Installed dependencies (`npm install`)
- [ ] Started the app (`npm start`)
- [ ] Configured Jira URL (`https://rehrig.atlassian.net`)
- [ ] Entered your email
- [ ] Created and pasted API token
- [ ] Pasted team member emails (all 7 members)
- [ ] Verified all 4 statuses are checked
- [ ] Set hours threshold (72)
- [ ] Clicked "Test Connection" (successful)
- [ ] Clicked "Save Settings"
- [ ] Verified app is running in system tray

---

**You're all set! The app will now monitor your team's tickets automatically.** 🎉

**Created by Nathan Modlin**

