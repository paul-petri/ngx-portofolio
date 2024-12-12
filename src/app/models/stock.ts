import { StockType } from './stock-type';

export type BaseStock = {
  name: string;
  proc: number;
  type: StockType;
  symbol: string;
  hidden?: boolean;
};

export type Stock = BaseStock & {
  qty: number;
  value?: number;
  toBuy?: number;
  cProc?: number; //category procent BET AERO
  betProc?: number;
};
