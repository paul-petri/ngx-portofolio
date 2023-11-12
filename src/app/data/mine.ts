import { Stock } from '../models/stock';
import { StockType } from '../models/stock-type';

export const myPortofolio: Array<Stock> = [
  {
    symbol: 'TLV',
    name: 'Banca Transilvania',
    proc: 4.2,
    value: 1243,
    type: StockType.BET,
  },
  {
    symbol: 'H2O',
    name: 'Hidroelectrica',
    proc: 6.8,
    value: 1983.90,
    type: StockType.BET,
  },
  {
    symbol: 'SNP',
    name: 'OMV Petrom',
    proc: 4.3,
    value: 1265,
    type: StockType.BET,
  },
  {
    symbol: 'SNG',
    name: 'Romgaz',
    proc: 0,
    type: StockType.BET,
  },
  {
    symbol: 'BRD',
    name: 'BRD',
    proc: 5.4,
    value: 1607.76,
    type: StockType.BET,
  },
  {
    symbol: 'SNN',
    name: 'Nuclear Electrica',
    proc: 3.8,
    value: 1138.75,
    type: StockType.BET,
  },
  {
    symbol: 'FP',
    name: 'Fondul Proprietatea',
    proc: 0,
    type: StockType.BET,
  },
  {
    symbol: 'TGN',
    name: 'Transgaz',
    proc: 0,
    type: StockType.BET,
  },
  {
    symbol: 'M',
    name: 'Medlife',
    proc: 8.2,
    value: 2420,
    type: StockType.BET,
  },
  {
    symbol: 'ONE',
    name: 'One United',
    proc: 3.4,
    value: 994,
    type: StockType.BET,
  },
  {
    symbol: 'DIGI',
    name: 'Digi',
    proc: 8.6,
    value: 2553,
    type: StockType.BET,
  },
  {
    symbol: 'EL',
    name: 'Electrica',
    proc: 3.2,
    value: 959,
    type: StockType.BET,
  },
  {
    symbol: 'TTS',
    name: 'Transport Trade Services',
    proc: 0,
    type: StockType.BET,
  },
  {
    symbol: 'TEL',
    name: 'Transelectrica',
    proc: 0,
    type: StockType.BET,
  },
  {
    symbol: 'TRP',
    name: 'TERRAPLAST',
    proc: 10,
    value: 2958,
    type: StockType.BET,
  },
  {
    symbol: 'BVB',
    name: 'Bursa Valori Bucuresti',
    proc: 0,
    type: StockType.BET,
  },
  {
    symbol: 'AQ',
    name: 'Aquila',
    proc: 0,
    type: StockType.BET,
  },
  {
    symbol: 'WINE',
    name: 'Purcari',
    proc: 4.2,
    value: 1248,
    type: StockType.BET,
  },
  {
    symbol: 'SFG',
    name: 'Sphera',
    proc: 5.4,
    value: 1616,
    type: StockType.BET,
  },
  {
    symbol: 'COTE',
    name: 'Conpet',
    proc: 0,
    type: StockType.BET,
  },
  {
    symbol: 'SMTL',
    name: 'Simtel',
    proc: 0.6,
    type: StockType.AERO,
    value: 187.50
  },
  {
    symbol: 'BONA',
    name: 'Bonas',
    proc: 18.4,
    type: StockType.AERO,
    value: 5448
  },
  {
    symbol: 'AROBS',
    name: 'Arobs',
    proc: 7.2,
    type: StockType.AERO,
    value: 2120.80
  },
];
