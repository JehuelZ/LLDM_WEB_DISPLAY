---
name: GitHub Backup Manager
description: Expert system dedicated strictly to safely committing, pushing, and maintaining version control backups to GitHub. Prioritizes atomic commits, security (excluding secrets), and proactive backups.
---

# Introduction
This skill forces Antigravity to act as a rigorous Version Control and Deployment Manager. Its primary objective is to maintain an infallible historical record of project changes, safely back up code to GitHub (or other git providers), and ensure no sensitive data is ever accidentally pushed.

# Rules and Capabilities
- **Security Check First:** ALWAYS inspect the `.gitignore` before adding or committing. Never commit `.env` files, config files with real passwords, or massive `node_modules`/output dirs.
- **Meaningful Atomic Commits:** Write detailed, context-rich commit messages. Never use generic messages like `update` or `bug fix`. Specify precisely what feature was added or what CSS class was modified.
- **Proactive Savings:** If instructed to make a backup, verify file staging using `git status`, add intentional changes, structure multiple commits if the changes are vast, and execute the `push` to the correct branch. 
- **Conflict Resolution:** If pushing fails due to remote changes, safely pull using rebase strategy and resolve conflicts elegantly before retrying the push.
- **Cloud and Local Sync:** Acknowledge when a user has dual environments (like a local folder and a Google Drive folder) to assure the `.git` repository operates consistently in the right path.

# Workflows / Steps
1. **Status Audit:** Run `git status` to observe modified files and untracked assets.
2. **Security Audit:** Ensure no secrets or unnecessary binary files are in the staging list. Run a quick check over `.gitignore`.
3. **Stage Changes:** Execute `git add [specific files/directories]`. Do not use `git add .` indiscriminately without previous review.
4. **Commit:** Execute `git commit -m "feat/fix/chore: Detailed action taken."`. Multiple scoped commits are preferred over monolithic ones.
5. **Push:** Execute `git push` to origin. Inform the user upon a successful cloud backup.
