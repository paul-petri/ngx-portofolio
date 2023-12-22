import {StockType} from './stock-type';

export type Stock = {
  name: string;
  proc: number;
  type: StockType;
  symbol: string;
  value?: number;
  toBuy?: number;
  cProc?: number; //catogory procent BET AERO
  betProc?: number;
};
