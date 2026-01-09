import { BaseStock } from '../models/stock';
import { StockType } from '../models/stock-type';

// BET Index composition as of January 9, 2026
// Weights fetched from BVB: https://m.bvb.ro/FinancialInstruments/Indices/IndicesProfiles.aspx?i=BET
// To update: run ./scripts/update-bet-index.sh
export const BET20map: Map<string, BaseStock> = new Map([
  [
    'TLV',
    {
      symbol: 'TLV',
      name: 'Banca Transilvania',
      proc: 19.70,
      type: StockType.BET,
    },
  ],
  [
    'SNP',
    {
      symbol: 'SNP',
      name: 'OMV Petrom',
      proc: 18.43,
      type: StockType.BET,
    },
  ],
  [
    'SNG',
    {
      symbol: 'SNG',
      name: 'Romgaz',
      proc: 11.82,
      type: StockType.BET,
    },
  ],
  [
    'H2O',
    {
      symbol: 'H2O',
      name: 'Hidroelectrica',
      proc: 10.70,
      type: StockType.BET,
    },
  ],
  [
    'BRD',
    {
      symbol: 'BRD',
      name: 'BRD Groupe Societe Generale',
      proc: 7.02,
      type: StockType.BET,
    },
  ],
  [
    'TGN',
    {
      symbol: 'TGN',
      name: 'Transgaz',
      proc: 6.19,
      type: StockType.BET,
    },
  ],
  [
    'DIGI',
    {
      symbol: 'DIGI',
      name: 'Digi Communications',
      proc: 4.56,
      type: StockType.BET,
    },
  ],
  [
    'EL',
    {
      symbol: 'EL',
      name: 'Electrica',
      proc: 4.52,
      type: StockType.BET,
    },
  ],
  [
    'M',
    {
      symbol: 'M',
      name: 'MedLife',
      proc: 4.00,
      type: StockType.BET,
    },
  ],
  [
    'SNN',
    {
      symbol: 'SNN',
      name: 'Nuclearelectrica',
      proc: 3.43,
      type: StockType.BET,
    },
  ],
  [
    'TEL',
    {
      symbol: 'TEL',
      name: 'Transelectrica',
      proc: 2.19,
      type: StockType.BET,
    },
  ],
  [
    'FP',
    {
      symbol: 'FP',
      name: 'Fondul Proprietatea',
      proc: 1.35,
      type: StockType.BET,
    },
  ],
  [
    'ONE',
    {
      symbol: 'ONE',
      name: 'One United Properties',
      proc: 1.27,
      type: StockType.BET,
    },
  ],
  [
    'PE',
    {
      symbol: 'PE',
      name: 'Premier Energy',
      proc: 1.17,
      type: StockType.BET,
    },
  ],
  [
    'AQ',
    {
      symbol: 'AQ',
      name: 'Aquila',
      proc: 0.82,
      type: StockType.BET,
    },
  ],
  [
    'ATB',
    {
      symbol: 'ATB',
      name: 'Antibiotice Iasi',
      proc: 0.80,
      type: StockType.BET,
    },
  ],
  [
    'TTS',
    {
      symbol: 'TTS',
      name: 'Transport Trade Services',
      proc: 0.66,
      type: StockType.BET,
    },
  ],
  [
    'TRP',
    {
      symbol: 'TRP',
      name: 'TeraPlast',
      proc: 0.66,
      type: StockType.BET,
    },
  ],
  [
    'SFG',
    {
      symbol: 'SFG',
      name: 'Sphera Franchise Group',
      proc: 0.56,
      type: StockType.BET,
    },
  ],
  [
    'WINE',
    {
      symbol: 'WINE',
      name: 'Purcari Wineries',
      proc: 0.15,
      type: StockType.BET,
    },
  ],
]);
