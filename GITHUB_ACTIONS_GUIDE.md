# GitHub Actions Build Guide

## 🤖 Automated macOS & Windows Builds

I've set up GitHub Actions to automatically build installers for both platforms using GitHub's free servers!

---

## ✅ What's Set Up

### **Two Workflows:**

1. **`build-mac.yml`** - Builds macOS installer only
   - Runs on every push to `main` branch
   - Can be triggered manually
   - Creates `.dmg` file

2. **`build-all.yml`** - Builds both Windows and macOS installers
   - Runs when you create a version tag (e.g., `v0.5.0`)
   - Can be triggered manually
   - Creates both `.exe` and `.dmg` files
   - Automatically creates a GitHub Release with both installers

---

## 🚀 How to Use

### **Option 1: Push to GitHub (Automatic macOS Build)**

Every time you push to the `main` branch, GitHub will automatically build the macOS installer.

```bash
# Make sure you're in the Boss Edition folder
cd C:\GitHub\jira_72h_updater_boss

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Boss Edition with GitHub Actions"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/NModlin/jira_72h_updater_boss.git

# Push to GitHub
git push -u origin main
```

**What happens:**
- GitHub Actions automatically starts
- Builds the macOS installer on a Mac server
- You can download the `.dmg` file from the Actions tab

---

### **Option 2: Manual Trigger (Build Anytime)**

You can manually trigger a build without pushing code:

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Click **"Build macOS Installer"** (left sidebar)
4. Click **"Run workflow"** button (right side)
5. Click **"Run workflow"** (green button)

**What happens:**
- GitHub builds the macOS installer
- Takes about 3-5 minutes
- Download from the workflow run page

---

### **Option 3: Create a Release (Both Platforms)**

To build both Windows and macOS installers and create a release:

```bash
# Tag the current version
git tag v0.5.0

# Push the tag to GitHub
git push origin v0.5.0
```

**What happens:**
- GitHub builds **both** Windows and macOS installers
- Creates a **GitHub Release** with both files attached
- Anyone can download the installers from the Releases page

---

## 📥 How to Download Built Installers

### **From Actions Tab:**

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Click on the latest workflow run (green checkmark)
4. Scroll down to **"Artifacts"** section
5. Download:
   - **`macos-installer`** - Contains the `.dmg` file
   - **`windows-installer`** - Contains the `.exe` file (if built)

### **From Releases Page:**

1. Go to your GitHub repository
2. Click **"Releases"** (right sidebar)
3. Click on the latest release
4. Download the installers from **"Assets"** section

---

## 🔧 First-Time Setup

### **Step 1: Create GitHub Repository**

If you haven't already:

1. Go to https://github.com/new
2. Repository name: `jira_72h_updater_boss`
3. Description: "Boss Edition - Team Jira ticket monitoring"
4. Visibility: **Private** (recommended) or Public
5. Click **"Create repository"**

### **Step 2: Push Code to GitHub**

```bash
cd C:\GitHub\jira_72h_updater_boss

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Boss Edition with automated builds"

# Add remote (replace NModlin with your username)
git remote add origin https://github.com/NModlin/jira_72h_updater_boss.git

# Push to GitHub
git push -u origin main
```

### **Step 3: Wait for Build**

1. Go to your repository on GitHub
2. Click **"Actions"** tab
3. You'll see the build running (yellow dot)
4. Wait 3-5 minutes for it to complete (green checkmark)
5. Download the macOS installer from Artifacts

---

## 📋 Workflow Details

### **`build-mac.yml` (macOS Only)**

**Triggers:**
- ✅ Every push to `main` branch
- ✅ Manual trigger from Actions tab
- ✅ When you create a tag starting with `v`

**What it does:**
1. Checks out your code
2. Installs Node.js 18
3. Runs `npm install`
4. Runs `npm run build:mac`
5. Uploads the `.dmg` file as an artifact

**Build time:** ~3-5 minutes

---

### **`build-all.yml` (Both Platforms)**

**Triggers:**
- ✅ When you create a tag (e.g., `v0.5.0`)
- ✅ Manual trigger from Actions tab

**What it does:**
1. **Windows job**: Builds `.exe` on Windows server
2. **macOS job**: Builds `.dmg` on Mac server
3. **Release job**: Creates GitHub Release with both files

**Build time:** ~5-8 minutes (runs in parallel)

---

## 🎯 Common Workflows

### **Scenario 1: Quick macOS Build**

**Goal**: Build macOS installer without pushing code

**Steps:**
1. Go to GitHub → Actions tab
2. Click "Build macOS Installer"
3. Click "Run workflow"
4. Wait 3-5 minutes
5. Download from Artifacts

---

### **Scenario 2: Release New Version**

**Goal**: Build both installers and create a release

**Steps:**
```bash
# Update version in package.json (if needed)
# Then:
git add .
git commit -m "Release v0.5.0"
git tag v0.5.0
git push origin main
git push origin v0.5.0
```

**Result:**
- Both installers built
- GitHub Release created
- Installers attached to release

---

### **Scenario 3: Test Changes**

**Goal**: Test if changes work on macOS

**Steps:**
```bash
git add .
git commit -m "Test changes"
git push origin main
```

**Result:**
- macOS installer built automatically
- Download and test
- If it works, create a release tag

---

## 🚨 Troubleshooting

### **"Build failed"**

**Check:**
1. Go to Actions tab
2. Click on the failed run (red X)
3. Click on the job that failed
4. Read the error logs

**Common issues:**
- Missing dependencies: Check `package.json`
- Syntax errors: Check your code
- Icon missing: Make sure `assets/icon.png` exists

---

### **"Can't find the artifact"**

**Solution:**
1. Make sure the build completed (green checkmark)
2. Scroll down to "Artifacts" section
3. Artifacts expire after 30 days

---

### **"Release not created"**

**Check:**
1. Did you push a tag? (`git push origin v0.5.0`)
2. Tag must start with `v` (e.g., `v0.5.0`, not `0.5.0`)
3. Check Actions tab for errors

---

## 💰 Cost

**GitHub Actions is FREE for:**
- ✅ Public repositories (unlimited)
- ✅ Private repositories (2,000 minutes/month)

**Build times:**
- macOS build: ~3-5 minutes
- Windows build: ~2-3 minutes
- Both platforms: ~5-8 minutes

**Monthly usage estimate:**
- 10 builds/month = ~50 minutes (well within free tier)

---

## 🎓 Advanced: Customization

### **Change When Builds Run**

Edit `.github/workflows/build-mac.yml`:

```yaml
on:
  push:
    branches:
      - main        # Build on every push to main
      - develop     # Also build on develop branch
  pull_request:     # Build on pull requests
  workflow_dispatch: # Manual trigger
```

### **Add Notifications**

Add Slack/Discord notifications when builds complete:

```yaml
- name: Notify on success
  if: success()
  run: |
    curl -X POST -H 'Content-type: application/json' \
    --data '{"text":"✅ macOS build completed!"}' \
    YOUR_WEBHOOK_URL
```

---

## ✅ Summary

### **What You Get:**
- ✅ Automatic macOS builds (no Mac needed!)
- ✅ Automatic Windows builds
- ✅ GitHub Releases with both installers
- ✅ Free (within GitHub's limits)
- ✅ Fast (3-5 minutes per build)

### **How to Use:**
1. **Push code** → macOS installer built automatically
2. **Create tag** → Both installers built + Release created
3. **Manual trigger** → Build anytime from Actions tab

### **Next Steps:**
1. Push your code to GitHub
2. Go to Actions tab
3. Watch the build run
4. Download the macOS installer
5. Test it!

---

**You can now build macOS installers without a Mac!** 🎉

**Created by Nathan Modlin**

