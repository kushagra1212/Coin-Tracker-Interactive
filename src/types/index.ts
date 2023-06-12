export interface ICoin {
  s: string;
  c: string;
  v: string;
}
export interface DataItem {
  symbol: string;
  volume: string;
  lastPrice: string;
  prev?: DataItem;
}
export interface SortBy {
  type: 'volume' | 'lastPrice';
  order: 'asc' | 'desc';
}
export interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}
export enum TimeRange {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  ONE_MONTH = 'ONE_MONTH',
  SIX_MONTH = 'SIX_MONTH',
  YEAR_TO_DATE = 'YEAR_TO_DATE',
  ONE_YEAR = 'ONE_YEAR',
  FIVE_YEARS = 'FIVE_YEARS',
  ALL_TIME = 'ALL_TIME',
}

export interface IDataItem {
  lastPrice: string;
  symbol: string;
  volume: string;
  closeTime?: string;
  prev: {
    lastPrice: string;
    symbol: string;
    volume: string;
    prev: undefined;
  };
}
