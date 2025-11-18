# Push to GitHub - Quick Guide

## 🚀 Get Your macOS Installer Built Automatically!

Follow these steps to push your code to GitHub and get the macOS installer built automatically.

---

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `jira_72h_updater_boss`
   - **Description**: "Boss Edition - Team Jira ticket monitoring with automated builds"
   - **Visibility**: **Private** (recommended for internal tools)
3. **DO NOT** check "Add a README file"
4. **DO NOT** check "Add .gitignore"
5. Click **"Create repository"**

---

## Step 2: Initialize Git and Push

Open PowerShell in the `jira_72h_updater_boss` folder and run:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Boss Edition with GitHub Actions for automated builds"

# Add remote (replace NModlin with YOUR GitHub username)
git remote add origin https://github.com/NModlin/jira_72h_updater_boss.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `NModlin` with your GitHub username!**

---

## Step 3: Watch the Build

1. Go to your repository on GitHub
2. Click **"Actions"** tab at the top
3. You'll see **"Build macOS Installer"** running (yellow dot 🟡)
4. Wait 3-5 minutes for it to complete (green checkmark ✅)

---

## Step 4: Download the macOS Installer

1. Click on the completed workflow run (green checkmark)
2. Scroll down to **"Artifacts"** section
3. Click **"macos-installer"** to download
4. Extract the ZIP file
5. You'll have: `Jira 72h Updater Boss Edition-0.5.0.dmg`

---

## 🎉 That's It!

You now have a macOS installer built on GitHub's Mac servers - **no Mac needed!**

---

## 🔄 Future Updates

### To Build Again:

Just push changes to GitHub:

```powershell
git add .
git commit -m "Updated settings"
git push
```

GitHub will automatically build a new macOS installer!

---

### To Create a Release (Both Windows & macOS):

```powershell
# Update version in package.json if needed
# Then:
git add .
git commit -m "Release v0.5.1"
git tag v0.5.1
git push origin main
git push origin v0.5.1
```

This will:
- ✅ Build Windows installer (`.exe`)
- ✅ Build macOS installer (`.dmg`)
- ✅ Create a GitHub Release with both files

---

## 🚨 Troubleshooting

### "Permission denied (publickey)"

You need to set up SSH keys or use HTTPS with a personal access token.

**Quick fix - Use HTTPS:**
```powershell
git remote set-url origin https://github.com/NModlin/jira_72h_updater_boss.git
```

Then when you push, enter your GitHub username and password (or personal access token).

---

### "Repository not found"

Make sure:
1. You created the repository on GitHub
2. The repository name matches exactly
3. You replaced `NModlin` with YOUR username

---

### "Build failed on GitHub"

1. Go to Actions tab
2. Click the failed run (red X)
3. Click on the job
4. Read the error message
5. Usually it's a missing dependency or syntax error

---

## 📞 Need Help?

See `GITHUB_ACTIONS_GUIDE.md` for detailed information about:
- Manual triggers
- Creating releases
- Downloading artifacts
- Customizing workflows

---

**Ready to push? Run the commands in Step 2!** 🚀

**Created by Nathan Modlin**

