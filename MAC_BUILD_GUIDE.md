# macOS Build Guide - Jira 72h Updater Boss Edition

## 🍎 Building for macOS

This guide shows how to build a macOS installer (.dmg file) for the Boss Edition.

---

## ⚠️ Important: Build on macOS

**You MUST build the macOS installer on a Mac.** Windows cannot create macOS installers.

If you're on Windows, you have two options:
1. **Use a Mac** to build the installer
2. **Use a cloud Mac** service (like MacStadium, AWS EC2 Mac, or GitHub Actions)

---

## 🚀 Quick Build (On Mac)

### Step 1: Install Dependencies

```bash
cd jira_72h_updater_boss
npm install
```

### Step 2: Build the macOS Installer

```bash
npm run build:mac
```

### Step 3: Find the Installer

The installer will be created at:
```
dist/Jira 72h Updater Boss Edition-0.5.0.dmg
```

---

## 📦 What Gets Created

### DMG File (Disk Image)
- **File**: `Jira 72h Updater Boss Edition-0.5.0.dmg`
- **Size**: ~100-150 MB
- **Type**: macOS disk image installer

### How to Install (For End Users)
1. Double-click the `.dmg` file
2. Drag the app icon to the Applications folder
3. Eject the disk image
4. Open the app from Applications folder
5. If you see "App can't be opened because it's from an unidentified developer":
   - Right-click the app → **Open**
   - Click **Open** in the dialog
   - The app will now run (only needed first time)

---

## 🔧 Build Options

### Build for macOS Only
```bash
npm run build:mac
```
**Output**: `.dmg` file for macOS

### Build for Windows Only
```bash
npm run build:win
```
**Output**: `.exe` installer for Windows

### Build for Both Platforms
```bash
npm run build:all
```
**Output**: Both `.dmg` (macOS) and `.exe` (Windows)

**Note**: Building for both requires macOS (Windows can't build .dmg files)

---

## 🍎 macOS-Specific Features

### Menu Bar Icon
On macOS, the app appears in the **menu bar** (top-right corner) instead of the system tray.

### Keyboard Shortcuts
- **⌘Q** - Quit the app (from any window)
- **⌘W** - Close current window
- **⌘,** - Open Settings (standard macOS shortcut)

### Notifications
macOS notifications appear in the **Notification Center** and can be customized in System Preferences.

---

## 📋 macOS Setup Instructions (For End Users)

### Step 1: Install the App

1. Download `Jira 72h Updater Boss Edition-0.5.0.dmg`
2. Double-click to open the disk image
3. Drag the app to the **Applications** folder
4. Eject the disk image

### Step 2: First Launch

1. Open **Applications** folder
2. Find **Jira 72h Updater Boss Edition**
3. Right-click → **Open** (first time only)
4. Click **Open** in the security dialog

### Step 3: Configure Settings

1. Look for the icon in the **menu bar** (top-right corner)
2. Click the icon → **Settings**
3. Fill in the form:

**Jira URL:**
```
https://rehrig.atlassian.net
```

**Your Email:**
```
your.email@rehrig.com
```

**API Token:**
- Click "🔗 Create API Token" button
- Or visit: https://id.atlassian.com/manage-profile/security/api-tokens

**Team Member Emails:**
```
douglascampbell@rehrig.com
sromero@Rehrig.com
LGreathouse@Rehrig.com
mmatias@rehrig.com
AClose@rehrig.com
ENgetich@Rehrig.com
NModlin@Rehrig.com
```

**Statuses:** (All checked)
- ✅ In Progress
- ✅ Open
- ✅ Waiting for Support
- ✅ Waiting for Customer

**Hours:** `72`

### Step 4: Test & Save

1. Click **"Test Connection"**
2. Should see: "✅ Connection successful!"
3. Click **"Save Settings"**

### Step 5: Enable Notifications

1. Open **System Preferences** → **Notifications**
2. Find **Jira 72h Updater Boss Edition**
3. Set alert style to **Alerts** (not Banners)
4. Enable **"Show in Notification Center"**
5. Enable **"Play sound for notifications"**

---

## 🔐 macOS Security & Permissions

### Gatekeeper Warning

When you first open the app, macOS may show:
```
"Jira 72h Updater Boss Edition" can't be opened because it is from an unidentified developer.
```

**Solution:**
1. Right-click the app → **Open**
2. Click **Open** in the dialog
3. The app will now run (only needed once)

### Why This Happens

The app is not **code-signed** with an Apple Developer certificate ($99/year).

**For internal team use**, this is fine. Just use the right-click method.

**For public distribution**, you would need to:
1. Join Apple Developer Program ($99/year)
2. Get a Developer ID certificate
3. Code-sign the app
4. Notarize the app with Apple

---

## 🛠️ Advanced: Code Signing (Optional)

If you want to distribute the app without the Gatekeeper warning:

### Step 1: Join Apple Developer Program
- Cost: $99/year
- URL: https://developer.apple.com/programs/

### Step 2: Get Developer ID Certificate
1. Open **Xcode** → **Preferences** → **Accounts**
2. Add your Apple ID
3. Download **Developer ID Application** certificate

### Step 3: Update package.json

Add to the `"mac"` section:
```json
"mac": {
  "category": "public.app-category.productivity",
  "target": ["dmg"],
  "icon": "assets/icon.png",
  "identity": "Developer ID Application: Your Name (TEAM_ID)",
  "hardenedRuntime": true,
  "gatekeeperAssess": false,
  "entitlements": "build/entitlements.mac.plist",
  "entitlementsInherit": "build/entitlements.mac.plist"
}
```

### Step 4: Build with Signing
```bash
npm run build:mac
```

The app will now be code-signed and won't show the Gatekeeper warning.

---

## 📊 Build Comparison

| Platform | Command | Output | Size | Build Time |
|----------|---------|--------|------|------------|
| **macOS** | `npm run build:mac` | `.dmg` | ~120 MB | 2-3 min |
| **Windows** | `npm run build:win` | `.exe` | ~100 MB | 2-3 min |
| **Both** | `npm run build:all` | `.dmg` + `.exe` | ~220 MB | 4-6 min |

---

## 🚨 Troubleshooting

### "Command not found: electron-builder"

**Solution:**
```bash
npm install
```

### "Cannot build for macOS on Windows"

**Solution:**
- Use a Mac to build the macOS installer
- Or use GitHub Actions (see below)

### "Icon file not found"

**Solution:**
Make sure `assets/icon.png` exists and is at least 256x256 pixels.

### "Build failed: No identity found"

**Solution:**
This is a code-signing error. Either:
1. Remove code-signing from package.json (for internal use)
2. Or get an Apple Developer certificate (for public distribution)

---

## 🤖 Automated Builds with GitHub Actions

You can automate macOS builds using GitHub Actions (free for public repos):

### Create `.github/workflows/build.yml`:

```yaml
name: Build macOS Installer

on:
  push:
    tags:
      - 'v*'

jobs:
  build-mac:
    runs-on: macos-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build macOS installer
        run: npm run build:mac
      
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: macos-installer
          path: dist/*.dmg
```

### Usage:
1. Push a tag: `git tag v0.5.0 && git push --tags`
2. GitHub Actions will build the macOS installer
3. Download from the Actions tab

---

## ✅ Quick Checklist (For Building on Mac)

- [ ] You're on a Mac (required)
- [ ] Node.js installed (`node --version`)
- [ ] Cloned the repository
- [ ] Ran `npm install`
- [ ] Icon file exists (`assets/icon.png`)
- [ ] Ran `npm run build:mac`
- [ ] Found the `.dmg` file in `dist/` folder
- [ ] Tested the installer on macOS

---

## 📞 Support

**Build Issues:**
- Check Node.js version: `node --version` (should be 16+)
- Check npm version: `npm --version` (should be 8+)
- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules && npm install`

**macOS-Specific Issues:**
- Gatekeeper: Use right-click → Open
- Notifications: Check System Preferences → Notifications
- Menu bar icon: Look in top-right corner (not dock)

---

## 🎯 Distribution Options

### Option 1: Direct Distribution (Easiest)
1. Build the `.dmg` file
2. Upload to shared drive or email
3. Users download and install
4. Users right-click → Open (first time)

### Option 2: Internal App Store
1. Set up internal file server
2. Host the `.dmg` file
3. Provide download link to team

### Option 3: Code-Signed Distribution (Most Professional)
1. Join Apple Developer Program ($99/year)
2. Code-sign the app
3. Notarize with Apple
4. Distribute without Gatekeeper warnings

---

**For most internal team use, Option 1 (Direct Distribution) is perfect!** 🎉

**Created by Nathan Modlin**

