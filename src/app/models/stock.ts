import {StockType} from './stock-type';

export type Stock = {
  name: string;
  proc: number;
  type: StockType;
  symbol: string;
  qty: number;
  value?: number;
  toBuy?: number;
  cProc?: number; //category procent BET AERO
  betProc?: number;
};
