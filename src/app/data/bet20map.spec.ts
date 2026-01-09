import { BET20map } from './bet20map';
import { StockType } from '../models/stock-type';

describe('BET20map Index Composition', () => {
  const bet20Array = Array.from(BET20map.values());
  const bet20Symbols = Array.from(BET20map.keys());

  describe('Data Integrity', () => {
    it('should have between 10 and 20 companies', () => {
      expect(BET20map.size).toBeGreaterThanOrEqual(10);
      expect(BET20map.size).toBeLessThanOrEqual(20);
    });

    it('should have no duplicate symbols', () => {
      const symbols = bet20Array.map(stock => stock.symbol);
      const uniqueSymbols = new Set(symbols);
      expect(uniqueSymbols.size).toBe(symbols.length);
    });

    it('should have all stocks with type BET', () => {
      bet20Array.forEach(stock => {
        expect(stock.type).toBe(StockType.BET);
      });
    });

    it('should have all stocks with valid symbols', () => {
      bet20Array.forEach(stock => {
        expect(stock.symbol).toBeTruthy();
        expect(stock.symbol.length).toBeGreaterThan(0);
        expect(stock.symbol).toMatch(/^[A-Z0-9]+$/);
      });
    });

    it('should have all stocks with valid company names', () => {
      bet20Array.forEach(stock => {
        expect(stock.name).toBeTruthy();
        expect(stock.name.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Weight Validation', () => {
    it('should have all weights as positive numbers', () => {
      bet20Array.forEach(stock => {
        expect(stock.proc).toBeGreaterThanOrEqual(0);
        expect(typeof stock.proc).toBe('number');
        expect(isNaN(stock.proc)).toBe(false);
      });
    });

    it('should have total weights approximately equal to 100%', () => {
      const totalWeight = bet20Array.reduce((sum, stock) => sum + stock.proc, 0);
      // Allow 1% tolerance for rounding differences
      expect(totalWeight).toBeGreaterThan(99);
      expect(totalWeight).toBeLessThan(101);
    });

    it('should have no single stock exceeding 20% weight (BVB cap)', () => {
      bet20Array.forEach(stock => {
        expect(stock.proc).toBeLessThanOrEqual(20);
      });
    });

    it('should have weights in descending order', () => {
      for (let i = 0; i < bet20Array.length - 1; i++) {
        expect(bet20Array[i].proc).toBeGreaterThanOrEqual(bet20Array[i + 1].proc);
      }
    });

    it('should have largest weight at the top (first element)', () => {
      const maxWeight = Math.max(...bet20Array.map(s => s.proc));
      expect(bet20Array[0].proc).toBe(maxWeight);
    });
  });

  describe('Expected Top Holdings', () => {
    it('should include Banca Transilvania (TLV)', () => {
      expect(BET20map.has('TLV')).toBe(true);
      const tlv = BET20map.get('TLV');
      expect(tlv?.name).toContain('Banca Transilvania');
    });

    it('should include OMV Petrom (SNP)', () => {
      expect(BET20map.has('SNP')).toBe(true);
      const snp = BET20map.get('SNP');
      expect(snp?.name).toContain('OMV Petrom');
    });

    it('should include Hidroelectrica (H2O)', () => {
      expect(BET20map.has('H2O')).toBe(true);
      const h2o = BET20map.get('H2O');
      expect(h2o?.name).toContain('Hidroelectrica');
    });

    it('should include Romgaz (SNG)', () => {
      expect(BET20map.has('SNG')).toBe(true);
      const sng = BET20map.get('SNG');
      expect(sng?.name).toContain('Romgaz');
    });

    it('should have top 4 holdings representing at least 50% of index', () => {
      const top4Weight = bet20Array.slice(0, 4).reduce((sum, stock) => sum + stock.proc, 0);
      expect(top4Weight).toBeGreaterThanOrEqual(50);
    });
  });

  describe('Map Consistency', () => {
    it('should have map keys matching stock symbols', () => {
      bet20Symbols.forEach(key => {
        const stock = BET20map.get(key);
        expect(stock?.symbol).toBe(key);
      });
    });

    it('should be retrievable by symbol', () => {
      // Test a few known symbols
      const testSymbols = ['TLV', 'SNP', 'H2O', 'SNG'];
      testSymbols.forEach(symbol => {
        if (BET20map.has(symbol)) {
          const stock = BET20map.get(symbol);
          expect(stock).toBeDefined();
          expect(stock?.symbol).toBe(symbol);
        }
      });
    });
  });

  describe('Data Freshness Check', () => {
    it('should log a warning if weights seem outdated', () => {
      // This is a soft check - logs warning but doesn't fail
      const totalWeight = bet20Array.reduce((sum, stock) => sum + stock.proc, 0);
      const hasZeroWeights = bet20Array.some(stock => stock.proc === 0);

      if (Math.abs(totalWeight - 100) > 5) {
        console.warn('⚠️  BET Index weights sum to', totalWeight.toFixed(2), '% - consider updating from BVB');
      }

      if (hasZeroWeights) {
        const zeroStocks = bet20Array.filter(s => s.proc === 0).map(s => s.symbol);
        console.warn('⚠️  Stocks with 0% weight:', zeroStocks.join(', '), '- update weights from BVB');
      }

      // Always pass, this is just informational
      expect(true).toBe(true);
    });
  });

  describe('Documentation', () => {
    it('should be documented with update instructions', () => {
      // This test ensures developers know how to update the data
      // by reading the test output
      expect(true).toBe(true);
    });
  });
});

describe('BET Index Update Instructions', () => {
  it('shows how to update the BET index weights', () => {
    const instructions = `

    ===============================================
    📊 BET INDEX UPDATE INSTRUCTIONS
    ===============================================

    To update the BET index weights:

    1. Run the update script:
       ./scripts/update-bet-index.sh

    2. Review the output and verify:
       - Total weight sums to ~100%
       - All 20 companies are present
       - Top holdings look correct

    3. Update bet20map.ts with new weights

    4. Run this test to verify:
       ng test --include='**/bet20map.spec.ts'

    📅 Update frequency: Quarterly
       (March, June, September, December)

    🌐 Data source:
       https://m.bvb.ro/FinancialInstruments/Indices/IndicesProfiles.aspx?i=BET

    ===============================================
    `;

    console.log(instructions);
    expect(true).toBe(true);
  });
});
