import {Stock} from '../models/stock';
import {StockType} from '../models/stock-type';

export const BET20map: Map<string, Stock> = new Map([
  [
    'TLV',
    {
      symbol: 'TLV',
      name: 'Banca Transilvania',
      proc: 19.55,
      type: StockType.BET,
    },
  ],
  [
    'H2O',
    {
      symbol: 'H2O',
      name: 'Hidroelectrica',
      proc: 17.79,
      type: StockType.BET,
    },
  ],
  [
    'SNP',
    {
      symbol: 'SNP',
      name: 'OMV Petrom',
      proc: 17.23,
      type: StockType.BET,
    },
  ],
  [
    'SNG',
    {
      symbol: 'SNG',
      name: 'Romgaz',
      proc: 8.91,
      type: StockType.BET,
    },
  ],
  [
    'BRD',
    {
      symbol: 'BRD',
      name: 'BRD',
      proc: 7.59,
      type: StockType.BET,
    },
  ],
  [
    'SNN',
    {
      symbol: 'SNN',
      name: 'Nuclear Electrica',
      proc: 4.6,
      type: StockType.BET,
    },
  ],
  [
    'FP',
    {
      symbol: 'FP',
      name: 'Fondul Proprietatea',
      proc: 4.07,
      type: StockType.BET,
    },
  ],
  [
    'TGN',
    {
      symbol: 'TGN',
      name: 'Transgaz',
      proc: 2.92,
      type: StockType.BET,
    },
  ],
  [
    'M',
    {
      symbol: 'M',
      name: 'Medlife',
      proc: 2.74,
      type: StockType.BET,
    },
  ],
  [
    'ONE',
    {
      symbol: 'ONE',
      name: 'One United',
      proc: 2.53,
      type: StockType.BET,
    },
  ],
  [
    'DIGI',
    {
      symbol: 'DIGI',
      name: 'Digi',
      proc: 2.48,
      type: StockType.BET,
    },
  ],
  [
    'EL',
    {
      symbol: 'EL',
      name: 'Electrica',
      proc: 2.23,
      type: StockType.BET,
    },
  ],
  [
    'TTS',
    {
      symbol: 'TTS',
      name: 'Transport Trade Services',
      proc: 1.51,
      type: StockType.BET,
    },
  ],
  [
    'TEL',
    {
      symbol: 'TEL',
      name: 'Transelectrica',
      proc: 1.44,
      type: StockType.BET,
    },
  ],
  [
    'TRP',
    {
      symbol: 'TRP',
      name: 'TERRAPLAST',
      proc: 1.08,
      type: StockType.BET,
    },
  ],
  [
    'BVB',
    {
      symbol: 'BVB',
      name: 'Bursa Valori Bucuresti',
      proc: 0.95,
      type: StockType.BET,
    },
  ],
  [
    'AQ',
    {
      symbol: 'AQ',
      name: 'Aquila',
      proc: 0.74,
      type: StockType.BET,
    },
  ],
  [
    'WINE',
    {
      symbol: 'WINE',
      name: 'Purcari',
      proc: 0.67,
      type: StockType.BET,
    },
  ],
  [
    'SFG',
    {
      symbol: 'SFG',
      name: 'Sphera',
      proc: 0.52,
      type: StockType.BET,
    },
  ],
  [
    'COTE',
    {
      symbol: 'COTE',
      name: 'Conpet',
      proc: 0.44,
      type: StockType.BET,
    },
  ],
]);
