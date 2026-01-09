# Automated BET Index Update System

This document explains the **automated daily update system** for BET index weights that requires **zero manual intervention** and **no redeployment**.

## 🎯 What This Solves

**Problem**: BET index weights change quarterly, requiring manual updates and redeployment.

**Solution**: Fully automated system that:
- ✅ Fetches latest weights from BVB **every day at 2 AM UTC**
- ✅ Updates data automatically via GitHub Actions
- ✅ Deploys to GitHub Pages automatically
- ✅ **No manual intervention required**
- ✅ **No app redeployment needed**

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions (Cron)                     │
│                  Runs daily at 2:00 AM UTC                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  1. Scrape BVB Website │
              │  (update-bet-index.sh) │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │ 2. Generate JSON File  │
              │ (bet-index.json)       │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  3. Run Tests          │
              │  (bet20map.spec.ts)    │
              └───────────┬────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │  4. Commit & Push      │
              │  (if changed)          │
              └───────────┬────────────┘
                          │
                          ▼
     ┌────────────────────────────────────────┐
     │  5. GitHub Pages Auto-Deploy          │
     └────────────────┬───────────────────────┘
                      │
                      ▼
        ┌──────────────────────────────┐
        │  Angular App (Runtime)       │
        │  • Fetches bet-index.json    │
        │  • Caches for 24 hours       │
        │  • Falls back to embedded    │
        └──────────────────────────────┘
```

## 📂 Key Files

### Data Files
- **`src/assets/data/bet-index.json`** - Live BET index data (updated daily by GitHub Actions)
- **`src/app/data/bet20map.ts`** - Embedded fallback data (used if JSON fetch fails)

### Scripts
- **`scripts/update-bet-index-json.sh`** - Scrapes BVB and generates JSON
- **`scripts/update-bet-index.sh`** - Original CSV generator (still useful for manual review)

### Automation
- **`.github/workflows/update-bet-index.yml`** - GitHub Actions workflow (daily cron)

### Code
- **`src/app/services/storage.service.ts`** - `loadBetIndexFromJson()` method
- **`src/app/services/app.store.ts`** - Calls `loadBetIndexFromJson()` on app init
- **`src/app/data/bet20map.spec.ts`** - Validation tests

## 🔄 How It Works

### 1. Daily Automation (GitHub Actions)

Every day at **2:00 AM UTC** (after Romanian market close), GitHub Actions:

1. **Fetches** current BET composition from https://m.bvb.ro/
2. **Parses** HTML to extract symbols and weights
3. **Generates** JSON file with metadata:
   ```json
   {
     "lastUpdated": "2026-01-09T10:00:00Z",
     "totalWeight": 100.97,
     "companies": [...]
   }
   ```
4. **Validates** the data (runs tests)
5. **Commits** to repository (if changed)
6. **Deploys** to GitHub Pages automatically

### 2. Runtime Loading (Angular App)

When the app starts:

1. **Fetches** `assets/data/bet-index.json` from server
2. **Caches** in localStorage for 24 hours
3. **Falls back** to embedded `bet20map.ts` if fetch fails
4. **Updates** `$betIndex` signal with latest data

### 3. Caching Strategy

- **First load**: Fetches JSON from server
- **Subsequent loads** (within 24h): Uses cached data
- **After 24h**: Fetches fresh JSON
- **On error**: Falls back to embedded data

This provides:
- ⚡ **Fast loading** (uses cache)
- 🔄 **Fresh data** (updates daily)
- 🛡️ **Resilience** (fallback on errors)

## 🚀 Setup & Configuration

### Prerequisites

1. Repository hosted on GitHub
2. GitHub Pages enabled (already configured per angular.json)
3. GitHub Actions enabled (free tier is sufficient)

### Initial Setup (Already Done ✅)

The system is already configured and ready to use:

1. ✅ JSON file created in `src/assets/data/`
2. ✅ Scripts created and executable
3. ✅ GitHub Actions workflow created
4. ✅ StorageService updated with `loadBetIndexFromJson()`
5. ✅ AppStore updated to call the method
6. ✅ Tests created for validation

### Manual Trigger

You can manually trigger the update from GitHub:

1. Go to **Actions** tab in your repository
2. Select **"Update BET Index Daily"** workflow
3. Click **"Run workflow"**
4. Click **"Run workflow"** button

## 📊 Monitoring

### Check Last Update

In browser console, you'll see:
```
📥 Fetching BET index from assets/data/bet-index.json...
✅ Loaded BET index: 20 companies, total weight: 100.97%
📅 Last updated: 2026-01-09T10:00:00Z
```

Or if using cache:
```
📊 Using cached BET index (age: 45 minutes)
```

### Check GitHub Actions

1. Go to **Actions** tab in repository
2. Look for **"Update BET Index Daily"** runs
3. Green checkmark = success
4. Red X = failure (will use fallback data)

### Check JSON File

Visit: `https://yourusername.github.io/ngx-portofolio/assets/data/bet-index.json`

## 🔧 Maintenance

### Zero Maintenance Required

Once set up, the system runs automatically. No action needed.

### If GitHub Actions Fails

The app will automatically fall back to embedded data. You can:

1. Check the workflow run logs in GitHub Actions
2. Fix any issues (e.g., BVB website changes)
3. Manually run the workflow

### Update Script Logic

If BVB changes their website structure:

1. Update `scripts/update-bet-index-json.sh`
2. Adjust the regex pattern in the Python section
3. Test locally: `./scripts/update-bet-index-json.sh`
4. Commit the changes

### Adjust Update Frequency

Edit `.github/workflows/update-bet-index.yml`:

```yaml
on:
  schedule:
    # Daily at 2 AM UTC
    - cron: '0 2 * * *'

    # Every 6 hours
    # - cron: '0 */6 * * *'

    # Weekly on Mondays
    # - cron: '0 2 * * 1'
```

## 🧪 Testing

### Test JSON Generation

```bash
./scripts/update-bet-index-json.sh
cat src/assets/data/bet-index.json
```

### Test Validation

```bash
npm test -- --include='**/bet20map.spec.ts' --browsers=ChromeHeadless --watch=false
```

### Test Runtime Loading

1. Start dev server: `npm start`
2. Open browser console
3. Look for loading messages
4. Check Network tab for `bet-index.json` request

## 📈 Benefits

### For Users
- Always see current BET index weights
- No outdated data
- Portfolio calculations always accurate

### For Developers
- Zero maintenance
- No manual updates
- No redeployment needed
- Automatic validation
- Full audit trail (git history)

### For Operations
- Free (GitHub Actions free tier)
- Reliable (GitHub infrastructure)
- Monitorable (Action logs)
- Version controlled (JSON changes tracked)

## 🔐 Security

- ✅ No secrets required
- ✅ Read-only access to BVB
- ✅ Validated data before deployment
- ✅ Fallback prevents breakage
- ✅ All changes logged in git

## 📝 Cost

**$0/month** - Entirely free using:
- GitHub Actions free tier (2,000 minutes/month)
- GitHub Pages free hosting
- No external services

Daily 1-minute job = ~30 minutes/month (well under limit)

## 🎓 How to Explain to Others

"The BET index weights update automatically every day. A robot checks the stock exchange website at 2 AM, updates the data file, and deploys it. The app fetches the latest data when you open it. You never have to do anything manually."

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| App shows old weights | Clear localStorage, refresh page |
| GitHub Action fails | Check logs, fix script, or use fallback |
| JSON fetch fails | App automatically uses embedded fallback |
| Tests fail | GitHub Action won't deploy bad data |
| BVB website changed | Update regex in `update-bet-index-json.sh` |

## 🎉 Summary

You now have a **fully automated, zero-maintenance system** that keeps your BET index weights up-to-date **daily** without any manual intervention or redeployment. The app fetches fresh data at runtime and gracefully falls back to embedded data if anything fails.

**Set it and forget it!** 🚀
