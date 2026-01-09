# BET Index Update Scripts

This directory contains automation scripts for updating the BET (Bucharest Exchange Trading) index composition.

## Quick Start

To update the BET index weights, simply ask Claude Code:

```
"Please update the BET index weights"
```

Claude will automatically:
1. Run `./scripts/update-bet-index.sh` to fetch current data from BVB
2. Parse the HTML to extract symbols and weights
3. Update `src/app/data/bet20map.ts` with the new weights
4. Preserve company names from the existing file

## Manual Process

If you want to run it manually:

### Step 1: Fetch Current Data

```bash
./scripts/update-bet-index.sh
```

This script:
- Downloads the BET index page from https://m.bvb.ro/
- Parses the HTML table to extract stock symbols and their weights
- Saves the data to `/tmp/bet_weights_sorted.csv`
- Displays a summary of the current composition

### Step 2: Review the Data

The script will display something like:

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

### Step 3: Update TypeScript File

Ask Claude to update the `src/app/data/bet20map.ts` file with the weights from `/tmp/bet_weights_sorted.csv`.

### Step 4: Run Validation Tests

After updating the file, run the validation tests:

```bash
npm test -- --include='**/bet20map.spec.ts' --browsers=ChromeHeadless --watch=false
```

The tests verify:
- ✅ Total weights sum to ~100%
- ✅ All 20 companies are present (or between 10-20)
- ✅ No single stock exceeds 20% (BVB cap)
- ✅ Weights are in descending order
- ✅ All required fields are valid
- ✅ Top 4 holdings represent at least 50%
- ✅ No duplicate symbols

**Expected output**: `20 SUCCESS` (all tests pass)

## How It Works

### Technical Details

1. **Fetch**: Uses `curl` with a user agent to download the mobile BVB page
2. **Parse**: Python regex extracts `<td>` rows containing:
   - Stock symbol from the link: `?s=SYMBOL`
   - Weight percentage from the last column (9th `<td>`)
3. **Transform**: Converts Romanian decimal format (comma) to standard (dot)
4. **Sort**: Orders by weight descending
5. **Update**: Merges weights with existing company names in bet20map.ts

### Data Source

- **URL**: https://m.bvb.ro/FinancialInstruments/Indices/IndicesProfiles.aspx?i=BET
- **Tab**: "Info tranzactionare constituenti" (Trading info for constituents)
- **Format**: HTML table with 9 columns, weight % in last column

### Update Frequency

The BET index is reviewed **quarterly** (March, June, September, December).
It's recommended to update this data:
- After each quarterly review
- When you notice discrepancies in portfolio calculations
- At least once every 3-6 months

## Troubleshooting

### Script fails to download

- Check internet connection
- Verify BVB website is accessible: https://m.bvb.ro/
- The website might have changed structure - check the HTML manually

### Wrong number of companies

The BET index should have between 10-20 companies (typically 20).
If you see a different number, the parsing regex may need adjustment.

### Missing company names

If new symbols appear in BET, you'll need to add their full names manually to bet20map.ts.
Search for the symbol on bvb.ro to find the official company name.

## Files

- `update-bet-index.sh` - Main automation script
- `README.md` - This documentation
- Output: `/tmp/bet_weights_sorted.csv` - Temporary CSV with latest weights

## See Also

- BET Index Manual: https://bvb.ro/info/indices/Manual%20BET_EN.pdf
- BVB Index Profiles: https://bvb.ro/FinancialInstruments/Indices/IndicesProfiles
