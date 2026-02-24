# 🌙 RamadanBot - Dual Repository Structure Guide

## Overview

RamadanBot uses a **dual repository setup** to balance open documentation with secure code management. This guide explains how to set it up and maintain it.

---

## Repository Structure

### 1. **Private Repository** (Code + Configuration)
**Repository Name:** `ramadanbot` (current)
**Visibility:** Private
**Contains:**
- Full source code (components, pages, API routes)
- Environment variables and secrets
- Database configurations
- API keys and credentials
- Build artifacts and node_modules
- Internal documentation

**Access:** Authorized developers only
**Use Case:** Development, deployment, and maintenance

---

### 2. **Public Repository** (Documentation + License)
**Repository Name:** `ramadanbot-public`
**Visibility:** Public
**Contains:**
- `README.md` - Full project documentation
- `LICENSE` - MIT license
- `CONTRIBUTING.md` - Contribution guidelines (optional)
- `CODE_OF_CONDUCT.md` - Community standards (optional)
- Screenshots and demos

**Access:** Anyone (read-only)
**Use Case:** Public information, community reference

---

## Setup Instructions

### Step 1: Create Public Repository on GitHub

```bash
# 1. Go to GitHub and create new repository
#    Name: ramadanbot-public
#    Description: RamadanBot - Ramadan spiritual companion platform
#    Public: Yes
#    Initialize with README: No

# 2. Navigate to a temporary directory
cd /tmp
git clone --bare https://github.com/Abdallahnangere/ramadanbot.git ramadanbot-public-temp.git
cd ramadanbot-public-temp.git

# 3. Mirror push to public repository
git push --mirror https://github.com/Abdallahnangere/ramadanbot-public.git

# 4. Clean up
cd ..
rm -rf ramadanbot-public-temp.git
```

### Step 2: Clone Public Repository

```bash
git clone https://github.com/Abdallahnangere/ramadanbot-public.git
cd ramadanbot-public
```

### Step 3: Clean Public Repository

```bash
# Remove all sensitive files/folders from the public repo
git filter-branch --tree-filter 'rm -rf components app lib middleware.ts middleware.js ts config .env* secrets/ private/ src/' HEAD

# Force push to public repo
git push -f origin main

# Alternative: Start fresh with only public files
# (Recommended approach - cleaner history)
```

### Step 4: Add Only Public Files

From the public repository, keep **only**:

```
ramadanbot-public/
├── README.md              (from private repo)
├── LICENSE                (from private repo)
├── CONTRIBUTING.md        (create new)
├── CODE_OF_CONDUCT.md     (create new)
├── assets/                (screenshots, demos)
│   ├── demo.gif
│   ├── screenshot1.png
│   ├── screenshot2.png
│   └── architecture.png
└── .gitignore
```

**Delete everything sensitive:**
- `components/`, `app/`, `lib/`
- `middleware.ts`, `.env*` files
- `package-lock.json` (or regenerate without secrets)
- `.next/`, `node_modules/`, `build/`

### Step 5: Update README.md for Public Repository

```markdown
# 🌙 RamadanBot - Spiritual Companion for Ramadan

[Full README from private repo]

## For Developers

This is the **public documentation repository**. 

- **Source Code:** Private repository (for authorized developers)
- **Contributing:** [Link to contribution guidelines]
- **License:** MIT
- **Issues/Discussions:** Use GitHub Issues

## Getting Started

See the main website: https://www.ramadanbot.app

## Contact

- Email: founder@ramadanbot.app
- WhatsApp: +234 816 413 5836
- Website: https://www.ramadanbot.app
```

---

## Maintenance Workflow

### Keeping Repositories in Sync

#### When to Sync:
1. **Release New Features** → Update README in public
2. **Change License Terms** → Sync LICENSE file
3. **Update Documentation** → Sync to public repo
4. **Don't Sync:** Code changes, API routes, secrets

#### How to Sync (Selective Files Only):

```bash
# From private repo
cd ~/ramadanbot

# Copy public-only files
cp README.md ~/ramadanbot-public/
cp LICENSE ~/ramadanbot-public/

# Push to private repo
git add README.md LICENSE PRODUCTION_RELEASE_V3.0.md
git commit -m "docs: update documentation"
git push origin main

# Navigate to public repo
cd ~/ramadanbot-public

# Add the same updates
git add README.md LICENSE
git commit -m "docs: sync documentation from private repository"
git push origin main
```

---

## What Goes Where

### Private Repository Only ❌ PUBLIC
- Source code (components, pages, API routes)
- Environment variables (`.env.local`, `.env.production`)
- Database credentials and passwords
- API keys (Gemini, Neon, etc.)
- Deployment configurations
- Internal decision documentation
- Private design assets

### Public Repository Only 🌐 PRIVATE
- README.md (full documentation)
- LICENSE file
- Contributing guidelines
- Code of conduct
- Screenshots and demos
- High-level architecture diagrams (no code)
- Community guidelines

### Both Repositories ⚖️ SYNCHRONIZED
- License file updates
- Documentation changes
- Feature announcements
- Security advisories

---

## GitHub Settings

### Private Repository (`ramadanbot`)

**Settings → Security & Analysis:**
- ✅ Enable Dependabot alerts
- ✅ Enable secret scanning
- ✅ Enable branch protection

**Settings → Collaborators:**
- Add authorized developers only
- Use team-based access

**Settings → Deploy Keys:**
- Vercel has read-only access
- GitHub Actions for CI/CD

### Public Repository (`ramadanbot-public`)

**Settings → General:**
- ✅ Allow discussions
- ✅ Allow pull requests (with review)
- ✅ Require pull request reviews

**Settings → Branch Protection:**
- Require reviews before merge
- Require status checks to pass

---

## Deployment Notes

### Vercel Deployment (Private Repo)
- Vercel automatically deploys from `main` branch ofprivate repo
- Environment variables stored in Vercel settings
- No code from this repo is exposed publicly

### Documentation Website
- Update README.md in private repo
- Sync to public repo
- Website pulls from private repo README (or both)

---

## Security Checklist

- [ ] Verify no `.env` files in public repo
- [ ] Verify no API keys in public repo commits
- [ ] Verify no passwords or secrets in history
- [ ] Use `.gitignore` to prevent accidental commits
- [ ] Enable branch protection on `main`
- [ ] Require code review before merges
- [ ] Rotate any accidentally exposed credentials

---

## Example: Adding a New Feature

### Scenario: You publish v3.5 with new Qur'ān features

**Private Repo (Code):**
```bash
# 1. Update components, add new routes, etc.
git add components/ app/
git commit -m "feat: add new Qur'ān feature"

# 2. Update README with new feature description
git add README.md
git commit -m "docs: document new v3.5 feature"

# 3. Deploy to Vercel
git push origin main  # Vercel auto-deploys
```

**Public Repo (Documentation):**
```bash
# 1. Pull updated README from private repo
cd ../ramadanbot-public
git pull (manual copy of README.md)

# 2. Update public documentation
git add README.md
git commit -m "docs: public docs for v3.5 release"

# 3. Push public update
git push origin main
```

---

## Tools & Automation

### GitHub Actions (Optional)
Create `.github/workflows/sync-docs.yml` in private repo:

```yaml
name: Sync Public Docs

on:
  push:
    branches: [main]
    paths: ['README.md', 'LICENSE']

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Push to public repo
        run: |
          git config --global user.email "bot@ramadanbot.app"
          git config --global user.name "RamadanBot Bot"
          git clone https://github.com/Abdallahnangere/ramadanbot-public.git
          cp README.md LICENSE ramadanbot-public/
          cd ramadanbot-public
          git add .
          git commit -m "docs: auto-sync from private repo"
          git push https://${{ secrets.PUBLIC_REPO_TOKEN }}@github.com/Abdallahnangere/ramadanbot-public.git main
```

---

## Summary

| Aspect | Private | Public |
|--------|---------|--------|
| **URL** | github.com/Abdallahnangere/ramadanbot | github.com/Abdallahnangere/ramadanbot-public |
| **Content** | Code + Secrets | Docs + License |
| **Visibility** | Private | Public |
| **Deployment** | Vercel auto-deploys | Reference only |
| **Sync Frequency** | N/A | On major updates |
| **Write Access** | Authorized only | PR-based |

---

## References

- [GitHub: Managing multiple repositories](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings)
- [GitHub: Setting repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- [Best Practices: Separating public and private](https://www.atlassian.com/git/tutorials/git-sep-public-private)

---

**Created:** February 14, 2025  
**For:** RamadanBot v3.0+
