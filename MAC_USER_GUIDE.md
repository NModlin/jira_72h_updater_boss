# macOS User Guide - Jira 72h Updater Boss Edition

## 🍎 Installation & Setup for Mac Users

This guide is for **managers using macOS** who want to monitor their team's Jira tickets.

---

## 📥 Step 1: Install the App

### Download the Installer
Get the file: `Jira 72h Updater Boss Edition-0.5.0.dmg`

### Install the App
1. **Double-click** the `.dmg` file
2. A window will open showing the app icon and Applications folder
3. **Drag the app icon** to the **Applications** folder
4. **Eject** the disk image (right-click → Eject)

### First Launch
1. Open **Applications** folder (⌘+Shift+A)
2. Find **Jira 72h Updater Boss Edition**
3. **Right-click** the app → **Open** (important!)
4. Click **Open** in the security dialog

**Why right-click?** macOS blocks apps from unidentified developers. Right-clicking bypasses this (only needed once).

---

## ⚙️ Step 2: Configure Settings

### Find the Menu Bar Icon
Look in the **top-right corner** of your screen (menu bar). You'll see a small icon.

### Open Settings
Click the menu bar icon → **Settings**

### Fill in the Form

#### **Jira URL:**
```
https://rehrig.atlassian.net
```

#### **Your Email:**
```
your.email@rehrig.com
```
*(The email you use to log into Jira)*

#### **API Token:**
1. Click the **"🔗 Create API Token"** button in the settings window
2. Or visit: https://id.atlassian.com/manage-profile/security/api-tokens
3. Click **"Create API token"**
4. Label it: **"Jira 72h Updater Boss"**
5. **Copy** the token
6. **Paste** it in the settings window

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

## ✅ Step 3: Test & Save

### Test the Connection
1. Click **"Test Connection"**
2. You should see:
   ```
   ✅ Connection successful!
   
   Generated JQL Query:
   assignee in ("douglascampbell@rehrig.com", ...)
   ```

### Save Settings
1. Click **"Save Settings"**
2. The settings window will close
3. The app is now monitoring your team's tickets!

---

## 🔔 Step 4: Enable Notifications

### Configure macOS Notifications
1. Open **System Preferences** (or **System Settings** on macOS 13+)
2. Click **Notifications**
3. Scroll down and find **Jira 72h Updater Boss Edition**
4. Configure:
   - **Alert Style**: **Alerts** (not Banners)
   - **Show in Notification Center**: ✅ ON
   - **Badge app icon**: ✅ ON
   - **Play sound for notifications**: ✅ ON
   - **Show notifications on lock screen**: ✅ ON (optional)

**Why Alerts instead of Banners?**
- **Alerts** stay on screen until you dismiss them
- **Banners** disappear after a few seconds

---

## 🎯 How It Works

### Automatic Monitoring
- **First check**: 5 seconds after you save settings
- **Subsequent checks**: Every 1 hour
- **What it monitors**: Tickets assigned to your 7 team members that haven't been updated in 72 hours

### When Stale Tickets Are Found
You'll get a notification like:
```
🔔 Jira Ticket Needs Update: HD-1234
Customer can't log in - assigned to sromero@Rehrig.com
```

### Click the Notification
- Opens the ticket in your default browser
- You can see details and take action

### Manual Check
Click the menu bar icon → **"Check Now"** to check immediately

---

## 📊 View History

### See Past Notifications
1. Click the menu bar icon
2. Click **"View History"**
3. See all past notifications with:
   - Ticket key and summary
   - Timestamp
   - Type (color-coded)

### Clear History
Click **"Clear History"** to remove all past notifications

---

## 🛠️ Customization

### Change Time Threshold
Want to be notified sooner?
1. Click menu bar icon → **Settings**
2. Change **"Hours Without Update"**:
   - **48** = 2 days (more aggressive)
   - **96** = 4 days (more relaxed)
   - **120** = 5 days (very relaxed)
3. Click **"Save Settings"**

### Add/Remove Team Members
1. Click menu bar icon → **Settings**
2. Edit the **"Team Member Emails"** field
3. Add new members (one per line or comma-separated)
4. Remove members you don't want to track
5. Click **"Save Settings"**

### Change Which Statuses to Monitor
1. Click menu bar icon → **Settings**
2. Check/uncheck statuses:
   - Uncheck **"Waiting for Customer"** if you don't want to track those
   - Uncheck **"Open"** if you only want active work
3. Click **"Save Settings"**

---

## ⌨️ Keyboard Shortcuts

- **⌘Q** - Quit the app (from any window)
- **⌘W** - Close current window
- **⌘,** - Open Settings (standard macOS shortcut)

---

## 🚨 Troubleshooting

### "I don't see the menu bar icon"

**Check**:
1. Look in the **top-right corner** of your screen
2. It might be hidden if you have many menu bar icons
3. Try hiding other menu bar apps to make room

**Solution**:
- Hold **⌘** and drag menu bar icons to rearrange them
- The app icon should appear

---

### "No notifications appearing"

**Check**:
1. Are there actually stale tickets? (Check in Jira web)
2. Are notifications enabled in System Preferences?
3. Did you click "Save Settings" after configuring?

**Test**:
- Click menu bar icon → **"Check Now"**
- Click menu bar icon → **"View History"** to see if checks are running

**Fix**:
1. Open **System Preferences** → **Notifications**
2. Find **Jira 72h Updater Boss Edition**
3. Make sure notifications are **enabled**
4. Set alert style to **Alerts**

---

### "Connection failed"

**Check**:
1. Is the Jira URL correct? (`https://rehrig.atlassian.net`)
2. Is your email correct?
3. Is your API token valid?

**Fix**:
1. Generate a new API token
2. Make sure there are no extra spaces when pasting
3. Click **"Test Connection"** before saving

---

### "App won't open - unidentified developer"

**Solution**:
1. **Right-click** the app in Applications folder
2. Click **Open**
3. Click **Open** in the security dialog
4. The app will now run (only needed once)

**Alternative**:
1. Open **System Preferences** → **Security & Privacy**
2. Click **"Open Anyway"** next to the blocked app message

---

### "Too many notifications"

**Solutions**:
1. **Increase hours threshold**: Change from 72 to 96 or 120
2. **Uncheck some statuses**: Uncheck "Waiting for Customer"
3. **Remove some team members**: Only monitor critical team members

---

### "App is using too much battery"

**Solution**:
The app checks every hour, which is very light on battery. If you're concerned:
1. The app only runs when your Mac is awake
2. It uses minimal resources (< 50 MB RAM)
3. Network requests are small (< 1 KB per check)

**Normal behavior**: The app should use < 1% CPU on average.

---

## 🔐 Security & Privacy

### Your Data is Safe
- ✅ API token stored **locally** on your Mac only
- ✅ Token **never sent** anywhere except to Jira
- ✅ All communication uses **HTTPS** (encrypted)
- ✅ No data collected or sent to third parties
- ✅ App only **reads** ticket data—never modifies anything

### Where Settings Are Stored
```
~/Library/Application Support/jira-72h-updater-boss/config.json
```

### To Completely Remove the App
1. Quit the app (⌘Q)
2. Delete from Applications folder
3. Delete settings folder:
   ```bash
   rm -rf ~/Library/Application\ Support/jira-72h-updater-boss
   ```

---

## 📋 Quick Reference

### Menu Bar Icon Actions
- **Settings** - Configure the app
- **Check Now** - Check for stale tickets immediately
- **View History** - See past notifications
- **Quit** - Close the app

### What Gets Monitored
Tickets that match **ALL** of these:
1. ✅ Assigned to one of the 7 team members
2. ✅ In one of the 4 statuses (In Progress, Open, Waiting for Support, Waiting for Customer)
3. ✅ Not updated in 72 hours (3 days)

### Default Settings
- **Check frequency**: Every 1 hour
- **Time threshold**: 72 hours (3 days)
- **Statuses**: In Progress, Open, Waiting for Support, Waiting for Customer
- **Team members**: 7 Rehrig support team members

---

## 🎓 Tips for Managers

### Daily Morning Check
**Use Case**: See what's stale before your morning standup

**Action**: Click menu bar icon → **"Check Now"**

**Result**: Immediate check, notifications for any stale tickets

---

### Weekly Review
**Use Case**: Every Friday, review what went stale this week

**Action**: Click menu bar icon → **"View History"**

**Result**: See all notifications from the week

---

### Focus on Urgent Work
**Use Case**: Only track tickets that are going stale faster

**Settings**:
- Change **"Hours Without Update"** to **48**
- Uncheck **"Waiting for Customer"** (not urgent)

**Result**: Get notified about active work that's been idle for 2 days

---

### Monitor Specific Team Members
**Use Case**: Only track your direct reports

**Settings**:
- Remove team members you don't manage from the email list
- Keep only your direct reports

**Result**: Only see notifications for your team

---

## 📞 Support

**Technical Issues:**
- Contact: Nathan Modlin (NModlin@Rehrig.com)

**Jira Access Issues:**
- Contact your Jira administrator

**API Token Issues:**
- Visit: https://id.atlassian.com/manage-profile/security/api-tokens

---

## ✅ Setup Checklist

Before you start monitoring:

- [ ] Downloaded the `.dmg` file
- [ ] Installed the app to Applications folder
- [ ] Opened the app (right-click → Open)
- [ ] Found the menu bar icon (top-right corner)
- [ ] Configured Jira URL (`https://rehrig.atlassian.net`)
- [ ] Entered your email
- [ ] Created and pasted API token
- [ ] Pasted team member emails (all 7 members)
- [ ] Verified all 4 statuses are checked
- [ ] Set hours threshold (72)
- [ ] Clicked "Test Connection" (successful)
- [ ] Clicked "Save Settings"
- [ ] Enabled notifications in System Preferences
- [ ] Set alert style to "Alerts"

---

**You're all set! The app will now monitor your team's tickets automatically.** 🎉

**Created by Nathan Modlin**

