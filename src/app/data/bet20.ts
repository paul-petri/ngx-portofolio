// TLV, 798658233, 22.1, 0.19389999
// H2O, 449802567, 120, 0.18020001
// SNP, 62311667058, 0.57, 0.17790002
// SNG, 385422400, 45, 0.086899996
// BRD, 696901518, 15.62, 0.0727
// SNN, 301643894, 48.8, 0.049099997
// FP, 6217825213, 0.42, 0.0349
// TGN, 188381504, 19.16, 0.0301
// M, 531481968, 4.55, 0.028299998
// DIGI, 100000000, 36.8, 0.024600001
// ONE, 3797654315, 0.968, 0.024500001
// EL, 346443597, 9.91, 0.0229
// TTS, 60000000, 21.9, 0.0154
// TEL, 73303142, 30.1, 0.0147
// TRP, 2179000358, 0.518, 0.0113
// BVB, 8049246, 65.8, 0.0088
// AQ, 1200002400, 0.906, 0.0073
// WINE, 40117500, 12.82, 0.0069
// SFG, 38799340, 20.7, 0.0054
// COTE, 8657528, 76.4, 0.0044

import { Stock } from '../models/stock';
import { StockType } from '../models/stock-type';

export const BET20: Array<Stock> = [
  {
    symbol: 'TLV',
    name: 'Banca Transilvania',
    proc: 19.55,
    type: StockType.BET,
  },
  {
    symbol: 'H2O',
    name: 'Hidroelectrica',
    proc: 17.79,
    type: StockType.BET,
  },
  {
    symbol: 'SNP',
    name: 'Nuclear Electrica',
    proc: 17.23,
    type: StockType.BET,
  },
  {
    symbol: 'SNG',
    name: 'Romgaz',
    proc: 8.91,
    type: StockType.BET,
  },
  {
    symbol: 'BRD',
    name: 'BRD',
    proc: 7.59,
    type: StockType.BET,
  },
  {
    symbol: 'SNN',
    name: 'Nuclear Electrica',
    proc: 4.6,
    type: StockType.BET,
  },
  {
    symbol: 'FP',
    name: 'Fondul Proprietatea',
    proc: 4.07,
    type: StockType.BET,
  },
  {
    symbol: 'TGN',
    name: 'Transgaz',
    proc: 2.92,
    type: StockType.BET,
  },
  {
    symbol: 'M',
    name: 'Medlife',
    proc: 2.74,
    type: StockType.BET,
  },
  {
    symbol: 'ONE',
    name: 'One United',
    proc: 2.53,
    type: StockType.BET,
  },
  {
    symbol: 'DIGI',
    name: 'Digi',
    proc: 2.48,
    type: StockType.BET,
  },
  {
    symbol: 'EL',
    name: 'Electrica',
    proc: 2.23,
    type: StockType.BET,
  },
  {
    symbol: 'TTS',
    name: 'Transport Trade Services',
    proc: 1.51,
    type: StockType.BET,
  },
  {
    symbol: 'TEL',
    name: 'Transelectrica',
    proc: 1.44,
    type: StockType.BET,
  },
  {
    symbol: 'TRP',
    name: 'TERRAPLAST',
    proc: 1.08,
    type: StockType.BET,
  },
  {
    symbol: 'BVB',
    name: 'Bursa Valori Bucuresti',
    proc: 0.95,
    type: StockType.BET,
  },
  {
    symbol: 'AQ',
    name: 'Aquila',
    proc: 0.74,
    type: StockType.BET,
  },
  {
    symbol: 'WINE',
    name: 'Purcari',
    proc: 0.67,
    type: StockType.BET,
  },
  {
    symbol: 'SFG',
    name: 'Sphera',
    proc: 0.52,
    type: StockType.BET,
  },
  {
    symbol: 'COTE',
    name: 'Conpet',
    proc: 0.44,
    type: StockType.BET,
  },
];
