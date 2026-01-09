# BET Index Update Guide

Quick reference for updating the BET (Bucharest Exchange Trading) index composition in this application.

## Quick Update (via Claude)

Simply ask Claude Code:

```
"Please update the BET index weights"
```

Claude will automatically:
1. Run `./scripts/update-bet-index.sh`
2. Parse the latest data from BVB
3. Update `src/app/data/bet20map.ts`
4. Run validation tests

## Manual Update Process

### Step 1: Fetch Latest Data

```bash
./scripts/update-bet-index.sh
```

This will:
- Download current BET index from https://m.bvb.ro/
- Parse stock symbols and weights
- Save results to `/tmp/bet_weights_sorted.csv`
- Display composition table

### Step 2: Review Output

Check the displayed table:

```
📊 Current BET Index Composition:
==================================
Symbol     Weight %
----------------------------------
TLV           19.70
SNP           18.43
SNG           11.82
...
```

Verify:
- ✅ Total is approximately 100%
- ✅ 20 companies listed (or 10-20)
- ✅ Top holdings look reasonable

### Step 3: Update TypeScript File

Edit `src/app/data/bet20map.ts` with the new weights from the CSV file, or ask Claude to do it.

### Step 4: Run Validation Tests

```bash
npm test -- --include='**/bet20map.spec.ts' --browsers=ChromeHeadless --watch=false
```

Expected result: **20 SUCCESS** ✅

## What the Tests Verify

The validation suite checks:

| Check | Description |
|-------|-------------|
| **Data Integrity** | 10-20 companies, no duplicates, valid symbols |
| **Weight Sum** | Total weights = 99-101% (allows rounding) |
| **BVB Cap** | No single stock exceeds 20% |
| **Sort Order** | Weights in descending order |
| **Top Holdings** | TLV, SNP, H2O, SNG are present |
| **Top 4 Weight** | Combined top 4 ≥ 50% |
| **Fields** | All stocks have name, symbol, proc, type |

## Update Frequency

**Quarterly**: The BET index is officially reviewed in:
- 🗓️ **March**
- 🗓️ **June**
- 🗓️ **September**
- 🗓️ **December**

Update the application after each quarterly review.

## Troubleshooting

### Script fails to download

```bash
# Check if BVB website is accessible
curl -I https://m.bvb.ro/
```

If the site is down or has changed, you may need to:
1. Update the URL in the script
2. Adjust the HTML parsing regex in the Python section

### Tests fail with "weights sum incorrect"

The total weights should be within 99-101%. If not:
- ✅ Check if all 20 stocks are included
- ✅ Verify no typos in percentage values
- ✅ Ensure decimal format (19.70, not 19,70)

### Tests fail with "weights not in descending order"

The stocks must be ordered by weight (highest first). Check the order in `bet20map.ts`.

### New symbols appear

If BET adds new companies not in your file:
1. Look up the company name on bvb.ro
2. Add full entry with symbol, name, proc, type

### Companies removed from BET

If companies are no longer in BET-20:
- You can leave them in the file with `hidden: true`
- Or remove them entirely (breaking change if used in portfolios)

## Files Modified During Update

```
src/app/data/bet20map.ts          ← Main data file (you update this)
/tmp/bet_weights_sorted.csv       ← Temporary CSV from script
src/app/data/bet20map.spec.ts     ← Tests (no changes needed)
```

## Data Source

**Official source**: Bucharest Stock Exchange (BVB)
- URL: https://m.bvb.ro/FinancialInstruments/Indices/IndicesProfiles.aspx?i=BET
- Tab: "Info tranzactionare constituenti"
- Manual: https://bvb.ro/info/indices/Manual%20BET_EN.pdf

## See Also

- `scripts/README.md` - Detailed technical documentation
- `CLAUDE.md` - Main project documentation
- `src/app/data/bet20map.spec.ts` - Test source code
- `scripts/update-bet-index.sh` - Automation script

---

**Last Updated**: January 9, 2026
**Current BET Composition**: 20 companies
**Total Weight**: 100.97%
**Top Holdings**: TLV (19.70%), SNP (18.43%), SNG (11.82%), H2O (10.70%)
