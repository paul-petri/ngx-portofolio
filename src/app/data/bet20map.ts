import { Stock } from '../models/stock';
import { StockType } from '../models/stock-type';

export const BET20map: Map<string, Stock> = new Map([
  [
    'TLV',
    {
      symbol: 'TLV',
      name: 'Banca Transilvania',
      proc: 20.03, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'SNP',
    {
      symbol: 'SNP',
      name: 'OMV Petrom',
      proc: 19.24, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'H2O',
    {
      symbol: 'H2O',
      name: 'Hidroelectrica',
      proc: 15.26, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'SNG',
    {
      symbol: 'SNG',
      name: 'Romgaz',
      proc: 8.99, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'BRD',
    {
      symbol: 'BRD',
      name: 'BRD',
      proc: 7.98, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'SNN',
    {
      symbol: 'SNN',
      name: 'Nuclear Electrica',
      proc: 3.58, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'EL',
    {
      symbol: 'EL',
      name: 'Electrica',
      proc: 3.53, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'DIGI',
    {
      symbol: 'DIGI',
      name: 'Digi',
      proc: 3.81, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'TGN',
    {
      symbol: 'TGN',
      name: 'Transgaz',
      proc: 3.09, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'M',
    {
      symbol: 'M',
      name: 'Medlife',
      proc: 3.15, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'ONE',
    {
      symbol: 'ONE',
      name: 'One United',
      proc: 2.06, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'TEL',
    {
      symbol: 'TEL',
      name: 'Transelectrica',
      proc: 1.66, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'FP',
    {
      symbol: 'FP',
      name: 'Fondul Proprietatea',
      proc: 1.85, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'TTS',
    {
      symbol: 'TTS',
      name: 'Transport Trade Services',
      proc: 1.36, // No change
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'AQ',
    {
      symbol: 'AQ',
      name: 'Aquila',
      proc: 1.19, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'TRP',
    {
      symbol: 'TRP',
      name: 'TERRAPLAST',
      proc: 0.89, // No change
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'SFG',
    {
      symbol: 'SFG',
      name: 'Sphera',
      proc: 0.86, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'BVB',
    {
      symbol: 'BVB',
      name: 'Bursa Valori Bucuresti',
      proc: 0.63, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'WINE',
    {
      symbol: 'WINE',
      name: 'Purcari',
      proc: 0.67, 
      qty: 0,
      type: StockType.BET,
    },
  ],
  [
    'COTE',
    {
      symbol: 'COTE',
      name: 'Conpet',
      proc: 0.37, 
      qty: 0,
      type: StockType.BET,
    },
  ],
]);
