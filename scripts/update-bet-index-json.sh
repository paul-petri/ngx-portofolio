#!/bin/bash
# Automated BET Index Updater - JSON Generator
# This script fetches the current BET index composition from BVB and generates JSON
# Usage: ./scripts/update-bet-index-json.sh [output_file]

set -e

OUTPUT_FILE="${1:-src/assets/data/bet-index.json}"

echo "========================================="
echo "BET Index JSON Generator"
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

# Step 2: Parse the HTML and generate JSON
echo "🔍 Parsing BET index composition..."
python3 << 'PYTHON_SCRIPT' > "$OUTPUT_FILE"
import re
import json
from datetime import datetime, timezone

# Read the HTML file
with open('/tmp/bet_index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all rows with stock data (symbol and weight in last column)
pattern = r'<td><a href="/FinancialInstruments/Details/FinancialInstrumentsDetails.aspx\?s=([A-Z0-9]+)">([^<]+)</a></td>(?:<td[^>]*>.*?</td>){7}<td[^>]*>([0-9,]+)</td>'
matches = re.findall(pattern, content, re.DOTALL)

# Company name mapping (enhance with full names)
name_map = {
    'TLV': 'Banca Transilvania',
    'SNP': 'OMV Petrom',
    'SNG': 'Romgaz',
    'H2O': 'Hidroelectrica',
    'BRD': 'BRD Groupe Societe Generale',
    'TGN': 'Transgaz',
    'DIGI': 'Digi Communications',
    'EL': 'Electrica',
    'M': 'MedLife',
    'SNN': 'Nuclearelectrica',
    'TEL': 'Transelectrica',
    'FP': 'Fondul Proprietatea',
    'ONE': 'One United Properties',
    'PE': 'Premier Energy',
    'AQ': 'Aquila',
    'ATB': 'Antibiotice Iasi',
    'TTS': 'Transport Trade Services',
    'TRP': 'TeraPlast',
    'SFG': 'Sphera Franchise Group',
    'WINE': 'Purcari Wineries',
    'COTE': 'Conpet',
    'BVB': 'Bursa de Valori Bucuresti'
}

# Build companies list
companies = []
total_weight = 0.0

for symbol, _, weight in matches:
    weight_clean = float(weight.replace(',', '.'))
    total_weight += weight_clean
    companies.append({
        'symbol': symbol,
        'name': name_map.get(symbol, symbol),
        'proc': weight_clean,
        'type': 'BET'
    })

# Sort by weight descending
companies.sort(key=lambda x: x['proc'], reverse=True)

# Build JSON structure
bet_data = {
    'lastUpdated': datetime.now(timezone.utc).isoformat(),
    'source': 'https://m.bvb.ro/FinancialInstruments/Indices/IndicesProfiles.aspx?i=BET',
    'totalWeight': round(total_weight, 2),
    'companies': companies
}

# Output JSON
print(json.dumps(bet_data, indent=2, ensure_ascii=False))
PYTHON_SCRIPT

if [ $? -eq 0 ]; then
  echo "✅ Successfully generated JSON"
  echo ""
  echo "📊 Summary:"
  python3 << 'PYTHON_SUMMARY'
import json
with open("src/assets/data/bet-index.json", 'r') as f:
    data = json.load(f)
print(f"   Companies: {len(data['companies'])}")
print(f"   Total Weight: {data['totalWeight']}%")
print(f"   Last Updated: {data['lastUpdated']}")
print(f"   Top 3: {', '.join([f\"{c['symbol']} ({c['proc']}%)\" for c in data['companies'][:3]])}")
PYTHON_SUMMARY
  echo ""
  echo "📁 Output file: $OUTPUT_FILE"
  echo ""
  echo "✅ Done! Ready to commit and deploy."
else
  echo "❌ Error generating JSON"
  exit 1
fi

echo "========================================="
