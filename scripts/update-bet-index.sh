#!/bin/bash
# Automated BET Index Updater
# This script fetches the current BET index composition from BVB and updates bet20map.ts
# Usage: ./scripts/update-bet-index.sh

set -e

echo "========================================="
echo "BET Index Updater"
echo "========================================="
echo ""

# Step 1: Fetch the BET index page
echo "📥 Fetching BET index data from BVB..."
curl -s -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  "https://m.bvb.ro/FinancialInstruments/Indices/IndicesProfiles.aspx?i=BET" \
  -o /tmp/bet_index.html

if [ ! -s /tmp/bet_index.html ]; then
  echo "❌ Error: Failed to download BET index page"
  exit 1
fi

echo "✅ Downloaded $(wc -c < /tmp/bet_index.html) bytes"
echo ""

# Step 2: Parse the HTML to extract symbol and weight data
echo "🔍 Parsing BET index composition..."
python3 << 'PYTHON_SCRIPT' > /tmp/bet_weights.csv
import re

with open('/tmp/bet_index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all rows with stock data (symbol and weight in last column)
pattern = r'<td><a href="/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx\?s=([A-Z0-9]+)">.*?</td>(?:<td[^>]*>.*?</td>){7}<td[^>]*>([0-9,]+)</td>'
matches = re.findall(pattern, content, re.DOTALL)

print("Symbol,Weight")
for symbol, weight in matches:
    weight_clean = weight.replace(',', '.')
    print(f"{symbol},{weight_clean}")
PYTHON_SCRIPT

# Sort by weight descending
tail -n +2 /tmp/bet_weights.csv | sort -t, -k2 -rn > /tmp/bet_weights_sorted.csv

echo "✅ Found $(wc -l < /tmp/bet_weights_sorted.csv) companies in BET index"
echo ""

# Step 3: Display the composition
echo "📊 Current BET Index Composition:"
echo "=================================="
printf "%-10s %10s\n" "Symbol" "Weight %"
echo "----------------------------------"
awk -F',' '{printf "%-10s %10s\n", $1, $2}' /tmp/bet_weights_sorted.csv
echo ""

# Step 4: Get company names from existing bet20map.ts if available
echo "📝 To update bet20map.ts, please provide company names for any new symbols."
echo ""
echo "✅ Data saved to: /tmp/bet_weights_sorted.csv"
echo ""
echo "Next steps:"
echo "1. Review the weights above"
echo "2. Update src/app/data/bet20map.ts with these weights"
echo "3. Run validation test:"
echo "   npm test -- --include='**/bet20map.spec.ts' --browsers=ChromeHeadless --watch=false"
echo ""
echo "========================================="
