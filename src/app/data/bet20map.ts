import { BaseStock } from '../models/stock';
import { StockType } from '../models/stock-type';

export const BET20map: Map<string, BaseStock> = new Map([
  [
    'TLV',
    {
      symbol: 'TLV',
      name: 'Banca Transilvania',
      proc: 20.52,
      type: StockType.BET,
    },
  ],
  [
    'SNP',
    {
      symbol: 'SNP',
      name: 'OMV Petrom',
      proc: 19.51,
      type: StockType.BET,
    },
  ],
  [
    'H2O',
    {
      symbol: 'H2O',
      name: 'Hidroelectrica',
      proc: 15.57,
      type: StockType.BET,
    },
  ],
  [
    'SNG',
    {
      symbol: 'SNG',
      name: 'Romgaz',
      proc: 8.95,
      type: StockType.BET,
    },
  ],
  [
    'BRD',
    {
      symbol: 'BRD',
      name: 'BRD',
      proc: 7.48,
      type: StockType.BET,
    },
  ],
  [
    'DIGI',
    {
      symbol: 'DIGI',
      name: 'Digi',
      proc: 3.79,
      type: StockType.BET,
    },
  ],
  [
    'SNN',
    {
      symbol: 'SNN',
      name: 'Nuclear Electrica',
      proc: 3.62,
      type: StockType.BET,
    },
  ],
  [
    'EL',
    {
      symbol: 'EL',
      name: 'Electrica',
      proc: 3.19,
      type: StockType.BET,
    },
  ],
  [
    'M',
    {
      symbol: 'M',
      name: 'Medlife',
      proc: 3.17,
      type: StockType.BET,
    },
  ],
  [
    'TGN',
    {
      symbol: 'TGN',
      name: 'Transgaz',
      proc: 3.12,
      type: StockType.BET,
    },
  ],
  [
    'TEL',
    {
      symbol: 'TEL',
      name: 'Transelectrica',
      proc: 1.67,
      type: StockType.BET,
    },
  ],
  [
    'ONE',
    {
      symbol: 'ONE',
      name: 'One United',
      proc: 1.45,
      type: StockType.BET,
    },
  ],
  [
    'FP',
    {
      symbol: 'FP',
      name: 'Fondul Proprietatea',
      proc: 1.36,
      type: StockType.BET,
    },
  ],
  [
    'ATB',
    {
      symbol: 'ATB',
      name: 'Antibiotice Iasi',
      proc: 1.27,
      type: StockType.BET,
    },
  ],
  [
    'AQ',
    {
      symbol: 'AQ',
      name: 'Aquila',
      proc: 1.07,
      type: StockType.BET,
    },
  ],
  [
    'PE',
    {
      symbol: 'PE',
      name: 'Premier Energy',
      proc: 1.04,
      type: StockType.BET,
    },
  ],
  [
    'SFG',
    {
      symbol: 'SFG',
      name: 'Sphera Franchise Group',
      proc: 0.87,
      type: StockType.BET,
    },
  ],
  [
    'TRP',
    {
      symbol: 'TRP',
      name: 'TERRAPLAST',
      proc: 0.8,
      type: StockType.BET,
    },
  ],
  [
    'TTS',
    {
      symbol: 'TTS',
      name: 'Transport Trade Services',
      proc: 0.8,
      type: StockType.BET,
    },
  ],
  [
    'WINE',
    {
      symbol: 'WINE',
      name: 'Purcari',
      proc: 0.75,
      type: StockType.BET,
    },
  ],
]);
